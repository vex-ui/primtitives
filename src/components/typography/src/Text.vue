<script setup lang="ts">
import { computed } from 'vue'

const p = withDefaults(
  defineProps<{
    tag?: string
    color?:
      | 'primary'
      | 'danger'
      | 'warning'
      | 'success'
      | 'muted'
      | 'disabled'
      | 'default'
    decoration?: 'line-through' | 'underline' | 'overline'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    italic?: boolean
    align?: 'start' | 'center' | 'end' | 'justify'
    weight?: string
    clamp?: number
  }>(),
  {
    tag: 'span',
    color: 'default',
    size: 'sm',
  }
)

//----------------------------------------------------------------------------------------------------
// 📌 styles & classes
//----------------------------------------------------------------------------------------------------

const styles = computed(() => {
  return {
    textDecoration: p.decoration,
    color: `var(--vex-text-clr-${p.color})`,
    fontStyle: p.italic ? 'italic' : undefined,
    fontWeight: p.weight,
    textAlign: p.align,
    '-webkit-line-clamp': p.clamp > 0 ? `${p.clamp}` : undefined,
  }
})

const classes = computed(() => {
  return [`vex-text-size-${p.size}`, { 'vex-text-clamp': p.clamp }]
})
</script>

<template>
  <Component :style="styles" :class="classes" :is="p.tag">
    <slot />
  </Component>
</template>
