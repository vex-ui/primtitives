<script setup lang="ts">
import { useControllableState, useID, useTemplateRef } from '@/composables'
import { inject, onUnmounted, provide, shallowReactive, toRef } from 'vue'
import { MENU_CTX, type MenuContext } from './context'
import type { Getter } from '@/types'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal'
    open?: boolean
  }>(),
  {
    orientation: 'vertical',
  }
)

defineSlots<{
  default: (props: { open: boolean }) => any
}>()

//----------------------------------------------------------------------------------------------------

const TRIGGER_ID = useID()
const CONTENT_ID = useID()

const TriggerEl = useTemplateRef('MenuTrigger')
const ContentEl = useTemplateRef('MenuContent')

const isMenuOpen = useControllableState({
  prop: () => p.open,
  defaultValue: !!p.open,
  name: 'open',
})

const parentMenu = inject(MENU_CTX, null)
const isSubMenu = !!parentMenu

const menu: MenuContext = {
  isMenuOpen,
  TriggerEl,
  ContentEl,
  TRIGGER_ID,
  CONTENT_ID,
  isSubMenu,
  orientation: () => p.orientation,
  submenus: shallowReactive([]),
  parentMenu,
}

//----------------------------------------------------------------------------------------------------

isSubMenu && parentMenu.submenus.push(menu)
onUnmounted(() => {
  const array = parentMenu?.submenus
  if (!array) return

  const index = array.indexOf(menu)
  index !== -1 && array.splice(index, 1)
})

provide(MENU_CTX, menu)

const open = toRef(isMenuOpen[0] as Getter<boolean>)
defineExpose({
  open,
})
</script>

<template>
  <slot :open="open" />
</template>
