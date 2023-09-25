<script setup lang="ts">
import { useListContext } from './context'
import { useCollection, useID, useMemo, useTemplateRef } from '@/composables'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether the item is disabled
     */
    disabled?: boolean

    /**
     * specifies the item's value,
     * the value needs to be unique from
     * other sibling items.
     */
    value: string
  }>(),
  {}
)

defineSlots<{
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const {
  selected: [getSelected, setSelected],
} = useListContext()

const id = useID('list-item')
const [getItemEl, setItemEl] = useTemplateRef('ListItem')

useCollection({
  id,
  ref: getItemEl,
  disabled: () => p.disabled,
})

const isSelected = useMemo(() =>
  getSelected((v) => (Array.isArray(v) ? v.includes(p.value) : v === p.value))
)

defineExpose({
  id,
  getItemEl,
  isSelected,
  select() {
    !isSelected() && setSelected(p.value)
  },
})
</script>

<template>
  <li
    tabindex="-1"
    @click="setSelected(p.value)"
    :id="id"
    :ref="setItemEl"
    :inert="p.disabled"
    :aria-selected="isSelected()"
    :class="['vex-list-item', { '--selected': isSelected() }]"
  >
    <slot />
  </li>
</template>
