<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader } from '@/components'
import { EXPOSED_EL } from '@/config'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the input value
     */
    modelValue?: string | number

    /**
     * specifies the input type attribute
     * @default 'text'
     */
    //TODO: time is broken
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'time' | 'url' | 'button'

    /**
     * specifies v-model modifiers
     */
    modelModifiers?: { lazy?: boolean }

    /**
     * whether the input is disabled
     */
    disabled?: boolean

    /**
     * whether the input is loading
     */
    loading?: boolean

    /**
     * whether the input is readonly
     */
    readonly?: boolean

    /**
     * the class attribute for the internal input
     */
    inputClass?: string

    /**
     * shows a smaller input
     */
    compact?: boolean
    class?: string
  }>(),
  {
    type: 'text',
  }
)

const emit = defineEmits<{
  click: [e: Event]
  'update:modelValue': [value?: string]
}>()

const slots = defineSlots<{
  icon(props: {}): any
  suffix(props: {}): any
  dropdown(props: {}): any
  inputContent(props: {}): any
}>()

//----------------------------------------------------------------------------------------------------

// custom v-model.lazy implementation
const updateModel = computed(() => (p.modelModifiers?.lazy ? 'change' : 'input'))

const InputEl = ref<HTMLInputElement | null>(null)
const InputWrapperEl = ref<HTMLDivElement | null>(null)

const hasSuffix = computed<boolean>(() => !!slots.suffix)
const hasIcon = computed<boolean>(() => !!slots.icon)

const modifierClasses = computed(() => [
  'vex-field',
  p.class,
  {
    '--compact': p.compact,
    '--with-icon': hasIcon.value,
    '--with-suffix': hasSuffix.value,
  },
])

//----------------------------------------------------------------------------------------------------

defineExpose({
  InputEl,
  InputWrapperEl,
  [EXPOSED_EL]: InputEl,
})
</script>

<template>
  <div ref="InputWrapperEl" @click="emit('click', $event)" :class="modifierClasses">
    <input
      v-bind="$attrs"
      :type="p.type"
      :disabled="p.disabled"
      :readonly="p.readonly"
      :value="p.modelValue"
      @[updateModel]="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      ref="InputEl"
      title=""
      class="vex-field-input"
    />

    <div v-if="hasIcon" aria-hidden="true" class="vex-field-icon">
      <slot name="icon" />
    </div>

    <div v-if="hasSuffix" aria-hidden="true" class="vex-field-suffix">
      <Loader v-if="p.loading" />
      <slot v-else name="suffix" />
    </div>

    <slot name="inputContent" />
  </div>
</template>
