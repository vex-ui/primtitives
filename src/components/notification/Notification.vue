<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useEventListener, useMouseInElement } from '@vueuse/core'
import { IconDangerSign, IconBell, IconXMark, IconCheckCircle, IconWarn } from '@/icons'
import { useTimer } from '@/composables'
import { Progress } from '@/components/progress'
import { animate } from 'motion'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    type?: 'success' | 'danger' | 'warning' | 'primary' | 'info'
    title?: string
    body?: string
    duration?: number
    persist?: boolean
    hideProgress?: boolean
  }>(),
  {
    type: 'primary',
    duration: 10000,
  }
)

const emit = defineEmits<{
  close: []
}>()

const slots = defineSlots<{
  default?: (props: {}) => any
  title?: (props: {}) => any
  body?: (props: {}) => any
  customContent?: (props: {}) => any
  icon?: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 timer
//----------------------------------------------------------------------------------------------------

const NotificationEl = ref<HTMLElement | null>(null)
const ProgressEl = ref<InstanceType<typeof Progress> | null>(null)
const progressValue = ref(0)
// we add 300ms to compensate for the lost time during enter transition
const _duration = p.duration + 300
const timer = !p.persist ? useTimer(_duration, onClose) : undefined

// TODO: this is too expensive for its usage
// find a better solution
const { isOutside: isMouseOutside } = useMouseInElement(NotificationEl)

if (timer) {
  onMounted(() => {
    timer.start()
    progressValue.value = 100
  })
}

function onClose() {
  timer?.stop()
  emit('close')
}

function onMouseLeave() {
  if (document.activeElement !== NotificationEl.value) {
    resumeTimer()
  }
}

function onBlur() {
  if (isMouseOutside.value) {
    resumeTimer()
  }
}

function pauseTimer() {
  timer?.pause()
  ProgressEl.value?.pause()
}

function resumeTimer() {
  timer?.resume()
  ProgressEl.value?.resume()
}

//----------------------------------------------------------------------------------------------------
// 📌 swipe gesture
//
// TODO: extract into composable
// TODO: does this work on pc touch screens?
//----------------------------------------------------------------------------------------------------

let initialX = 0
let prevX = 0
let lastFrame: number | null = null
useEventListener(NotificationEl, 'touchstart', (e: TouchEvent) => {
  initialX = e.touches[0].clientX
})

useEventListener(NotificationEl, 'touchmove', (e: TouchEvent) => {
  // ignore multi fingers touches
  if (e.touches.length !== 1) return
  e.preventDefault()
  e.stopPropagation()

  // Ignore left swipes beyond the initial position
  // reset prevX to prevent jumps
  if (e.touches[0].clientX < initialX) {
    prevX = initialX
    return
  }

  // debounced drag animation
  if (!lastFrame) {
    lastFrame = requestAnimationFrame(() => {
      if (!NotificationEl.value) return

      lastFrame = null
      prevX = e.touches[0].clientX
      const delta = Math.abs(prevX - initialX)
      NotificationEl.value.style.transform = `translateX(${delta}px)`
    })
  }
})

useEventListener(NotificationEl, 'touchend', (e: TouchEvent) => {
  // Ignore left swipes
  if (prevX < initialX) return

  // if the swipe distance is greater than 33% of el width, close
  // else reset the element's transform to 0
  const delta = Math.abs(prevX - initialX)
  if (delta > Math.floor(NotificationEl.value!.offsetWidth / 3)) {
    onClose()
    return
  }

  requestAnimationFrame(() => {
    animate(NotificationEl.value!, { x: [delta, 0] }, { duration: 0.15, easing: 'ease-out' })
  })
})

//----------------------------------------------------------------------------------------------------

const icon = computed(() => {
  if (p.type === 'danger') return IconDangerSign
  if (p.type === 'warning') return IconWarn
  if (p.type === 'success') return IconCheckCircle
  return IconBell
})

const modifierClasses = computed(() => [
  slots.default ? 'vex-notification-custom' : `vex-notification`,
  `--type-${p.type}`,
])
</script>

<template>
  <div
    ref="NotificationEl"
    tabindex="0"
    role="status"
    aria-atomic
    @keydown.esc="onClose"
    @mouseenter="pauseTimer"
    @mouseleave="onMouseLeave"
    @focus="pauseTimer"
    @blur="onBlur"
    :class="modifierClasses"
  >
    <slot>
      <!-- icon -->

      <div class="vex-notification-icon">
        <slot name="icon">
          <Component :is="icon" width="20" height="20" />
        </slot>
      </div>

      <!-- content -->

      <div class="vex-notification-content">
        <slot name="title">
          <span class="vex-notification-content-title">
            {{ p.title }}
          </span>
        </slot>

        <slot name="body">
          <p class="vex-notification-content-body">
            {{ p.body }}
          </p>
        </slot>
      </div>
    </slot>

    <!-- close button -->

    <button type="button" aria-label="close" class="vex-notification-close" @click="onClose">
      <IconXMark />
    </button>

    <!-- progress bar -->

    <div v-if="!p.persist && !hideProgress" class="vex-notification-progress">
      <Progress
        ref="ProgressEl"
        :color="p.type"
        :duration="_duration"
        :value="progressValue"
        inert
      />
    </div>
  </div>
</template>
