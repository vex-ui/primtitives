<script setup lang="ts">
import { useCollection, useMemo, useID, useTemplateRef } from '@/composables'
import { injectGroupContext, injectContentContext, injectTriggerContext } from './context'
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    disabled?: boolean
    value?: string
  }>(),
  {}
)

defineSlots<{
  prefix: (props: {}) => any
  suffix: (props: {}) => any
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const {
  CONTENT_ID,
  activeItemId: [, setActiveItemId],
  closeAllMenus,
} = injectContentContext('MenuItem')

const groupCtx = injectGroupContext()

const [ItemEl, setItemEl] = useTemplateRef('MenuItem')
const itemData = { id: useID(), ref: ItemEl, disabled: () => p.disabled }
const { items: getItems } = useCollection(itemData)

//----------------------------------------------------------------------------------------------------
// 📌 selection
//----------------------------------------------------------------------------------------------------

const [selected, setSelected] = groupCtx?.selection ?? []
const role = () => groupCtx?.itemType() ?? 'menuitem'
const isTrigger = !!injectTriggerContext()

const index = useMemo(() => getItems().indexOf(itemData))
const isSelected = selected
  ? useMemo(() => {
      if (p.value === undefined) return false
      return selected((v) => (Array.isArray(v) ? v.includes(p.value!) : v === p.value))
    })
  : () => undefined

function onClick() {
  if (isTrigger) return

  if (setSelected) {
    p.value && setSelected(p.value)
  } else {
    role() === 'menuitem' && closeAllMenus()
  }
}
</script>

<template>
  <button
    tabindex="-1"
    :ref="setItemEl"
    :id="`${CONTENT_ID}-${index()}`"
    :disabled="p.disabled"
    :role="role()"
    :aria-checked="isSelected()"
    :class="['vex-menu-item', { '--checked': isSelected() }]"
    @focus="setActiveItemId(`${CONTENT_ID}-${index()}`)"
    @click="onClick"
  >
    <div class="vex-menu-item-prefix">
      <slot name="prefix">
        <CheckIcon
          v-if="isSelected() && role() === 'menuitemcheckbox'"
          class="vex-menu-item-prefix-check"
        />
        <svg
          v-else-if="isSelected() && role() === 'menuitemradio'"
          class="vex-menu-item-prefix-check"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="50%" cy="50%" r="6" />
        </svg>
      </slot>
    </div>

    <div class="vex-menu-item-content">
      <slot />
    </div>

    <div class="vex-menu-item-suffix">
      <slot name="suffix">
        <ChevronRightIcon v-if="isTrigger" class="vex-menu-item-suffix-chevron" />
      </slot>
    </div>
  </button>
</template>
