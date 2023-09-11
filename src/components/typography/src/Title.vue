<script setup lang="ts">
import { computed } from 'vue'

const p = withDefaults(
  defineProps<{
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
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
    capitalize?: boolean
  }>(),
  {
    color: 'default',
    size: 'md',
    weight: '500',
  }
)

//----------------------------------------------------------------------------------------------------
// 📌 styles & classes
//----------------------------------------------------------------------------------------------------

const styles = computed(() => {
  return {
    textDecoration: p.decoration,
    color: `var(--vex-text-clr-${p.color})`,
    fontSize: `var(--vex-font-size-${p.size})`,
    fontStyle: p.italic ? 'italic' : undefined,
    fontWeight: p.weight,
    textAlign: p.align,
    textTransform: p.capitalize ? 'capitalize' : undefined,
  }
})
</script>

<template>
  <Component class="vex-title" :style="styles" :is="p.tag">
    <slot />
  </Component>
</template>
