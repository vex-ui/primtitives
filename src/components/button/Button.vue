<script lang="ts">
export interface ButtonProps {
  /**
   * whether the button is loading, shows a loading spinner and
   * disables click events.
   */
  loading?: boolean

  /**
   * disables the button and click events
   */
  disabled?: boolean

  /**
   * specifies the button variant
   * @default 'filled'
   */
  variant?: 'text' | 'filled' | 'outline' | 'light'

  /**
   * whether the button indicates a destructive action,
   * note that this only changes how the button looks,
   * not its behavior
   */
  destructive?: boolean

  /**
   * renders a smaller button
   */
  compact?: boolean

  /**
   * transforms the button into an icon-button
   */
  iconOnly?: boolean
}
</script>

<script setup lang="ts">
import { Loader } from '@/components'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(defineProps<ButtonProps>(), {
  variant: 'filled',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

//----------------------------------------------------------------------------------------------------

function onClick(e: MouseEvent) {
  if (p.disabled || p.loading) return
  emit('click', e)
}
</script>

<template>
  <button
    @click="onClick"
    :disabled="p.disabled"
    :aria-disabled="p.disabled || p.loading || undefined"
    :class="[
      'vex-button',
      `--variant-${p.variant}`,
      {
        '--icon-only': p.iconOnly,
        '--compact': p.compact,
        '--loading': p.loading,
        '--destructive': p.destructive,
      },
    ]"
  >
    <Loader
      role="progressbar"
      aria-valuetext="loading"
      style="position: absolute"
      v-if="p.loading"
    />
    <span class="vex-button-content">
      <slot />
    </span>
  </button>
</template>
