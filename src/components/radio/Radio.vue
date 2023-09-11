<script setup lang="ts">
import { computed, ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the current active radio value.
     */
    modelValue?: string

    /**
     * specifies the radio value attribute.
     */
    value?: string

    /**
     * specifies the radio name attribute.
     */
    name?: string
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

//----------------------------------------------------------------------------------------------------

const InputEl = ref<HTMLInputElement | null>(null)
const isChecked = computed(() => p.modelValue === p.value)

defineExpose({
  InputEl,
})
</script>

<template>
  <div class="vex-radio">
    <input
      v-bind="$attrs"
      :value="p.value"
      :checked="isChecked"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      ref="InputEl"
      type="radio"
      class="vex-radio-input"
    />

    <!-- svg -->

    <svg class="vex-radio-svg" viewBox="0 0 24 24" filter="url(#goo-light)">
      <circle class="vex-radio-svg-top" cx="12" cy="-12" r="8" />
      <circle class="vex-radio-svg-dot" cx="12" cy="12" r="5" />
      <circle class="vex-radio-svg-drop" cx="12" cy="12" r="2" />
    </svg>

    <!-- gooey effect filter 
      TODO: the filter makes the edges pixelated -->

    <!-- <svg style="display: none" width="0" height="0">
      <defs>
        <filter
          id="goo-light"
          x="-50%"
          width="200%"
          y="-50%"
          height="200%"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.25" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
            result="cm"
          />
        </filter>
      </defs>
    </svg> -->
  </div>
</template>
