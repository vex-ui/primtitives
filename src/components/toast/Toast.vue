<script setup lang="ts">
import { IconDangerSign, IconBell, IconCheckCircle, IconWarn } from '@/icons'
import { isString } from '@/composables/helpers'
import { useTimer } from '@/composables/timer'
import { onMounted, computed } from 'vue'
import type { Component } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    content: string | Component
    duration: number
    color: 'primary' | 'accent' | 'danger' | 'warning' | 'success'
  }>(),
  {
    color: 'primary',
    duration: 5000,
  }
)

const emit = defineEmits<{
  close: []
}>()

//----------------------------------------------------------------------------------------------------
// 📌 timer
//----------------------------------------------------------------------------------------------------

// TODO: maybe we should add visual indication when the timer is paused?
const timer = useTimer(p.duration, () => emit('close'))
onMounted(timer.start)

//----------------------------------------------------------------------------------------------------
// 📌 icon
//----------------------------------------------------------------------------------------------------

const iconType = computed(() => {
  if (p.color === 'danger') return IconDangerSign
  if (p.color === 'warning') return IconWarn
  if (p.color === 'success') return IconCheckCircle
  return IconBell
})

const modifierClasses = computed(() => ['vex-toast', `--c-${p.color}`])
</script>

<template>
  <div
    :class="modifierClasses"
    @mouseenter="timer.pause"
    @mouseleave="timer.resume"
    tabindex="0"
    role="alert"
    aria-atomic
  >
    <Component width="16" height="16" :is="iconType" />
    <span v-if="isString(p.content)">{{ p.content }}</span>
    <Component v-else :is="p.content" />
  </div>
</template>
