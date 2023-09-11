<script setup lang="ts">
//----------------------------------------------------------------------------------------------------
// 📌 component meta
//
//  TODO: functional component candidate
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }>(),
  {
    orientation: 'horizontal',
  }
)
</script>

<template>
  <div
    :class="[
      'vex-divider',
      {
        '--vertical': p.orientation === 'vertical',
      },
    ]"
    :role="p.decorative ? undefined : 'separator'"
    :aria-orientation="p.decorative ? undefined : p.orientation"
  >
    <span class="vex-divider-content">
      <slot />
    </span>
  </div>
</template>
