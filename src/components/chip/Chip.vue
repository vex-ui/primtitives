<script setup lang="ts">
import { useCollection, useSelectScope, useID } from '@/composables'
import { IconCheck } from '@/icons'
import { TransitionExpand } from '@/transitions'
import { ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the chip's unique value.
     */
    value: string

    /**
     * whether the chip is disabled
     */
    disabled?: boolean
  }>(),
  {}
)

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const ChipEl = ref<HTMLElement | null>(null)
const chipID = useID()

const { isSelected, setSelected } = useSelectScope(() => p.value)

useCollection({ id: chipID, ref: ChipEl, disabled: () => p.disabled })
</script>

<template>
  <div
    v-bind="$attrs"
    :id="chipID"
    :class="['vex-chip', { '--checked': isSelected, '--disabled': p.disabled }]"
    @click="setSelected(p.value)"
    ref="ChipEl"
    tabindex="-1"
  >
    <!-- check icon -->

    <TransitionExpand orientation="width">
      <IconCheck aria-hidden="true" class="vex-chip-check" v-show="isSelected" />
    </TransitionExpand>

    <!-- content -->

    <span class="vex-chip-content">
      <slot />
    </span>
  </div>
</template>
