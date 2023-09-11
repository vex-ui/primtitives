<script setup lang="ts">
import { useCollection, useID, useSelectScope } from '@/composables'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    disabled?: boolean
    value: string
  }>(),
  {}
)

defineSlots<{
  prefix: (props: {}) => any
  suffix: (props: {}) => any
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const id = useID()
const OptionEl = ref<HTMLElement | null>(null)

const { isSelected, setSelected, multiselect } = useSelectScope(() => p.value)
useCollection({ ref: OptionEl, id, disabled: () => p.disabled })
</script>

<template>
  <div
    :id="id"
    :class="['vex-option', { '--selected': isSelected, '--disabled': p.disabled }]"
    @click="setSelected(p.value)"
    ref="OptionEl"
    role="option"
    tabindex="-1"
  >
    <div class="vex-option-prefix">
      <slot name="prefix">
        <svg
          v-if="!multiselect() && isSelected"
          class="vex-option-prefix-check"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="50%" cy="50%" r="6" />
        </svg>
        <CheckIcon v-else-if="multiselect() && isSelected" class="vex-option-prefix-check" />
      </slot>
    </div>

    <div class="vex-option-content">
      <slot />
    </div>

    <div class="vex-option-suffix">
      <slot name="suffix" />
    </div>
  </div>
</template>
