<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

type LoadState = 'loading' | 'error' | 'idle' | 'loaded'

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    src?: string
    class?: any
    style?: any
    size?: 'sm' | 'md' | 'lg'
    radius?: 'sm' | 'md' | 'lg' | 'full' | 'none'
    ring?: 'primary' | 'accent' | 'danger' | 'warning' | 'success' | 'black' | 'white' | 'none'
  }>(),
  {
    size: 'md',
    radius: 'full',
    ring: 'accent',
  }
)

defineSlots<{
  default: (props: { loadState: LoadState }) => any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 image loading state
//----------------------------------------------------------------------------------------------------

const loadState = ref<LoadState>('idle')

onMounted(() => {
  watch(
    () => p.src,
    () => {
      if (!p.src) {
        loadState.value = 'error'
        return
      }
      loadState.value = 'loading'
      const img = new Image()
      img.onload = onLoad
      img.onerror = onError
      img.src = p.src
    },
    { immediate: true }
  )
})

function onLoad(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.complete && img.naturalHeight > 0) {
    loadState.value = 'loaded'
  }
}

function onError() {
  loadState.value = 'error'
}
</script>

<template>
  <div
    :class="[
      p.class,
      'vex-avatar',
      `--size-${p.size}`,
      ` --rounded-${p.radius}`,
      p.ring !== 'none' && `--ring-${p.ring}`,
    ]"
    :style="p.style"
  >
    <slot v-if="loadState !== 'loaded'" :load-state="loadState" />

    <img class="vex-avatar-img" v-else v-bind="$attrs" :src="p.src" />
  </div>
</template>
