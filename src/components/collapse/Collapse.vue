<script setup lang="ts">
import { useControllableState } from '@/composables'
import { TransitionExpand } from '@/transitions'
import type { Orientation, TemplateRef } from '@/types'
import { ref, toRef } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    expanded?: boolean
    disableExpandTransition?: boolean
    orientation?: Orientation
    ariaLabelledby: string
  }>(),
  {
    orientation: 'vertical',
  }
)

//----------------------------------------------------------------------------------------------------

const collapseEl: TemplateRef = ref(null)
const isExpanded = toRef(() => p.expanded)

defineExpose({
  isExpanded,
  collapseEl,
})
</script>

<template>
  <TransitionExpand :disabled="p.disableExpandTransition" :orientation="p.orientation">
    <div
      ref="collapseEl"
      v-show="isExpanded"
      v-bind="$attrs"
      role="region"
      :data-vex-state="isExpanded ? 'expanded' : 'collapsed'"
      :aria-labelledby="p.ariaLabelledby"
    >
      <slot />
    </div>
  </TransitionExpand>
</template>
