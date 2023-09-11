<script setup lang="ts">
import { animate, type AnimationControls } from 'motion'
import { onMounted, ref, watch, computed } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the current progress percentage.
     * @default 0
     */
    value?: number

    /**
     * specifies the time it takes - in ms - to animate the progress bar
     * from the previous value the new value.
     * @default 300
     */
    duration?: number

    /**
     * specifies the progress bar height.
     * @default 3
     */
    height?: number

    /**
     * specifies the progress bar color.
     * @default 'primary'
     */
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'info'

    /**
     * specifies the progress aria-valuetext attribute
     */
    ariaValuetext?: string
  }>(),
  {
    value: 0,
    height: 3,
    duration: 300,
    color: 'primary',
  }
)

const emit = defineEmits<{
  (event: 'finished'): void
}>()

//----------------------------------------------------------------------------------------------------
// 📌 animation
//
// TODO: add reduced motion
//----------------------------------------------------------------------------------------------------

const progressEl = ref<HTMLElement | null>(null)
let animationControls: AnimationControls | null = null

onMounted(() => {
  watch(
    () => p.value,
    (val, _, onCleanup) => {
      if (!progressEl.value) return
      onCleanup(() => animationControls?.stop())

      animationControls = animate(
        progressEl.value,
        { width: [null, `${Math.min(val, 100)}%`] },
        { duration: p.duration / 1000, easing: 'linear' }
      )

      animationControls.finished.then(() => {
        if (val === 100) {
          emit('finished')
        }
      })
    },
    { immediate: true }
  )
})

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => ['vex-progress', `--color-${p.color}`])

defineExpose({
  resume: () => animationControls?.play(),
  pause: () => animationControls?.pause(),
  finish: () => animationControls?.finish(),
  stop: () => animationControls?.stop(),
})
</script>

<template>
  <div
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="p.value"
    :aria-valuetext="p.ariaValuetext"
    :class="modifierClasses"
    :style="{
      height: p.height + 'px',
    }"
  >
    <div ref="progressEl" class="vex-progress-bar" />
  </div>
</template>
