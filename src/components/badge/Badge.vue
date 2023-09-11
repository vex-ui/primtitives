<script lang="ts">
export interface BadgeProps {
  /**
   * specifies the badge displayed value text
   */
  value?: string
  /**
   * specifies the badge color
   * @default 'info'
   */
  color?: 'accent' | 'warning' | 'success' | 'danger' | 'primary'
  /**
   * specifies the badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * whether to render only a small circle without a value
   */
  dot?: boolean
  /**
   * whether to hide the badge
   */
  hidden?: boolean
  /**
   * specifies the badge offset from the corner of its host element.
   * this can be any valid css length value `1px, 1rem ...etc`
   * @default '-2px'
   */
  offset?: string
  /**
   * specifies the badge placement.
   * - Note: this is not RTL | LTR friendly
   * @default 'top-right'
   */
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: true,
})

const p = withDefaults(defineProps<BadgeProps>(), {
  color: 'accent',
  offset: '-2px',
  placement: 'top-right',
  size: 'md',
})

//----------------------------------------------------------------------------------------------------

const isVisible = computed(() => (p.dot || p.value) && !p.hidden)

const modifierClasses = computed(() => [
  'vex-badge',
  `--color-${p.color}`,
  `--size-${p.size}`,
  {
    '--value': !p.dot,
  },
])

const positionStyles = computed(() => {
  const [y, x] = p.placement.split('-')
  return {
    top: y === 'top' ? `calc(0% - ${p.offset})` : `calc(100% + ${p.offset})`,
    left: x === 'left' ? `calc(0% - ${p.offset})` : `calc(100% + ${p.offset})`,
  }
})
</script>

<template>
  <div style="position: relative">
    <div v-bind="$attrs" v-show="isVisible" :class="modifierClasses" :style="positionStyles">
      <span v-if="!p.dot">
        {{ p.value }}
      </span>
    </div>
    <slot />
  </div>
</template>
