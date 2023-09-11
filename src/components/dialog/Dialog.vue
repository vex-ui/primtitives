<script setup lang="ts">
import { dialogStore } from '.'
import { IconXMark } from '@/icons'
import { useEventListener } from '@vueuse/core'
import type { FocusTrap } from 'focus-trap'
import { createFocusTrap } from 'focus-trap'
import { animate, timeline } from 'motion'
import { computed, onUnmounted, ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * whether to blur the background overlay
     */
    blurOverlay?: boolean

    /**
     * whether the dialog is open
     */
    modelValue?: boolean
  }>(),
  {}
)

defineSlots<{
  default: (props: {}) => any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

//----------------------------------------------------------------------------------------------------
// 📌 visibility
//----------------------------------------------------------------------------------------------------

const DialogEl = ref<HTMLDialogElement | null>(null)
const OverlayEl = ref<HTMLElement | null>(null)

useEventListener(DialogEl, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && p.modelValue) {
    emit('update:modelValue', false)
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 remove body scroll
//----------------------------------------------------------------------------------------------------

function hideBodyScrollbar(): void {
  dialogStore.openDialogsCount++
  if (dialogStore.openDialogsCount === 1) {
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.marginRight = `${scrollBarWidth}px`
    document.body.style.overflow = 'hidden'
  }
}

function showBodyScrollbar(): void {
  dialogStore.openDialogsCount--
  if (dialogStore.openDialogsCount === 0) {
    document.body.style.marginRight = ''
    document.body.style.overflow = ''
  }
}

onUnmounted(showBodyScrollbar)

//----------------------------------------------------------------------------------------------------
// 📌 animation & focus trap
//----------------------------------------------------------------------------------------------------

let trap: FocusTrap | null = null

async function onEnter(_: Element, done: () => void) {
  await timeline([
    [OverlayEl.value!, { opacity: [0, 1] }, { duration: 0.3 }],
    [DialogEl.value!, { scale: [0.95, 1] }, { duration: 0.3, at: 0 }],
  ]).finished

  done()
  trap = createFocusTrap(DialogEl.value!)
  trap.activate()
}

async function onLeave(overlay: Element, done: () => void) {
  await animate(overlay, { opacity: [1, 0] }, { duration: 0.3 }).finished

  done()
  trap?.deactivate()
}

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => [
  'vex-dialog',
  {
    '--blur': p.blurOverlay,
  },
])

defineExpose({
  DialogEl,
})
</script>

<template>
  <Teleport to="body">
    <Transition
      @before-enter="hideBodyScrollbar"
      @before-leave="showBodyScrollbar"
      @enter="onEnter"
      @leave="onLeave"
      :css="false"
    >
      <div v-if="p.modelValue" ref="OverlayEl" class="vex-overlay">
        <div
          v-bind="$attrs"
          :class="modifierClasses"
          ref="DialogEl"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
        >
          <slot />
          <button
            aria-label="close"
            class="vex-dialog-close"
            @click="emit('update:modelValue', false)"
          >
            <IconXMark aria-hidden="true" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
