<script setup lang="ts">
//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the loader color,
     * @defaultValue 'currentColor'
     */
    color?: 'primary' | 'currentColor' | 'success' | 'warning' | 'error'

    /**
     * specifies the loader size
     * @defaultValue 'sm'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the loader aria-label
     * @defaultValue 'loading'
     */
    ariaLabel?: string
  }>(),
  {
    color: 'currentColor',
    size: 'sm',
    ariaLabel: 'Loading',
  }
)
</script>

<template>
  <div
    role="status"
    :aria-label="ariaLabel"
    :class="['vex-loader', `--size-${p.size}`, `--color-${p.color}`]"
  />
</template>
