<script setup lang="ts">
import {
  createCollection,
  useDropdownAria,
  useFloating,
  useRovingFocus,
  useSignal,
  isUsingKeyboard,
} from '@/composables'
import { type Placement } from '@floating-ui/vue'
import { provide } from 'vue'
import { MENU_CONTENT_CTX, injectMenuContext } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    placement?: Placement
    autoMinWidth?: boolean
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------

const {
  isMenuOpen: [isMenuOpen, setIsMenuOpen],
  TriggerEl: [TriggerEl],
  ContentEl: [ContentEl, setContentEl],
  TRIGGER_ID,
  CONTENT_ID,
  isSubMenu,
  parentMenu,

  orientation,
} = injectMenuContext('MenuContent')

//----------------------------------------------------------------------------------------------------

const [activeItemId, setActiveItemId] = useSignal('')
const { elements } = createCollection(ContentEl)

useRovingFocus(ContentEl, elements, {
  orientation,
  onEntryFocus(e, focusFirst) {
    isUsingKeyboard() && focusFirst(elements())
  },
})

useDropdownAria(TriggerEl, ContentEl, {
  ariaExpanded: isMenuOpen,
  dropdownID: CONTENT_ID,
  targetElID: TRIGGER_ID,
  role: 'menu',
  ariaActiveDescendant: activeItemId,
})

const { floatingStyles } = useFloating(TriggerEl, ContentEl, isMenuOpen, {
  placement: () => (p.placement ?? isSubMenu ? 'right-start' : 'bottom-start'),
  autoMinWidth: () => p.autoMinWidth,
  strategy: 'absolute',
  offset: isSubMenu ? -1 : undefined,
})

//----------------------------------------------------------------------------------------------------

provide(MENU_CONTENT_CTX, {
  CONTENT_ID,
  activeItemId: [activeItemId, setActiveItemId],

  closeAllMenus() {
    if (!parentMenu) {
      setIsMenuOpen(false)
      return
    }

    let mainMenu = parentMenu
    while (mainMenu.parentMenu) {
      mainMenu = mainMenu.parentMenu
    }
    mainMenu.isMenuOpen[1](false)
  },
})
</script>

<template>
  <!-- TODO: screen reader needs teleport to be active on all menus? -->
  <Teleport :disabled="isSubMenu" to="body">
    <Transition name="vex-t-menu">
      <div
        v-if="isMenuOpen()"
        v-bind="$attrs"
        :aria-orientation="orientation()"
        :style="floatingStyles()"
        :ref="setContentEl"
        :class="['vex-menu-content', p.autoMinWidth && '--auto-min-width']"
        tabindex="-1"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
