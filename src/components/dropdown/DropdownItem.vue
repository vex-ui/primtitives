<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * the rendered html tag
     * @default 'li'
     */
    tag?: string

    /**
     * whether the item is disabled
     */
    disabled?: boolean

    /**
     * whether the item is selected
     */
    selected?: boolean
  }>(),
  {
    tag: 'li',
  }
)
</script>

<template>
  <Component
    :is="props.tag"
    :inert="props.disabled"
    :class="['vex-dropdown-item', props.selected && 'vex-selected']"
    tabindex="0"
  >
    <slot></slot>
  </Component>
</template>
