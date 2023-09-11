<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { SELECT_CTX } from '.'
import { IconCheckCircle, IconCheck } from '@/icons'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether the item is disabled.
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

//----------------------------------------------------------------------------------------------------

const ctx = inject(SELECT_CTX, null)

if (!ctx) {
  throw new Error(`[vex] <SelectItem> is missing a <Select> parent component.`)
}

const { onSelect, selectedItems } = ctx
//----------------------------------------------------------------------------------------------------

const isSelected = computed<boolean>(() =>
  Array.isArray(selectedItems.value)
    ? selectedItems.value.includes(p.value)
    : selectedItems.value === p.value
)

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    onSelect(p.value)
  }
}

const modifierClasses = computed(() => ['vex-select-item', { '--selected': isSelected.value }])
</script>

<template>
  <div
    tabindex="-1"
    role="option"
    @click="onSelect(p.value)"
    @keydown="onKeydown"
    :inert="p.disabled"
    :aria-selected="isSelected"
    :class="modifierClasses"
  >
    <slot />
    <!-- <IconCheckCircle v-show.lazy="isSelected" /> -->
    <IconCheck v-show.lazy="isSelected" />
  </div>
</template>
