<script lang="ts" setup>
import { animate } from 'motion'
import { Transition } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    duration?: number
    orientation?: 'horizontal' | 'vertical'
    disabled?: boolean
  }>(),
  {
    duration: 300,
    orientation: 'vertical',
  }
)

//----------------------------------------------------------------------------------------------------

let expandedSize = '0'
const dynamicSize = p.orientation === 'vertical' ? 'height' : 'width'
const staticSize = p.orientation === 'vertical' ? 'width' : 'height'

async function onEnter(el: HTMLElement, done: () => void) {
  el.style.transitionDuration = '0s'
  el.style.animationName = 'none'
  el.style[staticSize] = getComputedStyle(el)[staticSize]
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style[dynamicSize] = 'auto'

  expandedSize = el.getBoundingClientRect()[dynamicSize] + 'px'

  el.style.transitionDuration = ''
  el.style.animationName = ''
  el.style[staticSize] = ''
  el.style.position = ''
  el.style.visibility = ''
  el.style.overflow = 'hidden'

  await animate(
    el,
    { [dynamicSize]: [0, expandedSize], opacity: [0, 1] },
    { duration: p.duration / 1000 }
  ).finished
  done()
}

function onAfterEnter(el: HTMLElement) {
  el.style.overflow = ''
  el.style[dynamicSize] = ''
  el.style.opacity = ''
}

async function onLeave(el: HTMLElement, done: () => void) {
  expandedSize = el.getBoundingClientRect()[dynamicSize] + 'px'
  el.style.overflow = 'hidden'

  await animate(
    el,
    { [dynamicSize]: [expandedSize, 0], opacity: [1, 0] },
    { duration: p.duration / 1000 }
  ).finished
  done()
}

function onAfterLeave(el: HTMLElement) {
  el.style.overflow = ''
  el.style[dynamicSize] = ''
  el.style.opacity = ''
}
</script>

<template>
  <slot v-if="disabled" />

  <Transition
    v-else
    :css="false"
    @enter="(el, done) => onEnter(el as HTMLElement, done)"
    @leave="(el, done) => onLeave(el as HTMLElement, done)"
    @after-enter="(el) => onAfterEnter(el as HTMLElement)"
    @after-leave="(el) => onAfterLeave(el as HTMLElement)"
  >
    <slot />
  </Transition>
</template>
