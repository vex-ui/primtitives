<script setup lang="ts">
import { createSelectScope, useVModel } from '@/composables'
import { MENU_GROUP, type Selected } from './context'
import { provide } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    modelValue?: Selected
    type?: 'radio' | 'checkbox'
  }>(),
  {
    type: 'checkbox',
  }
)

//----------------------------------------------------------------------------------------------------

const selection = useSelect(
  useVModel<Selected>(() => p.modelValue),
  {
    multiselect: () => p.type === 'checkbox',
    deselection: () => p.type === 'checkbox',
  }
)

provide(MENU_GROUP, {
  selection,
  itemType: () => (p.type === 'checkbox' ? 'menuitemcheckbox' : 'menuitemradio'),
})
</script>

<template>
  <div role="group" class="vex-menu-group">
    <slot />
  </div>
</template>
