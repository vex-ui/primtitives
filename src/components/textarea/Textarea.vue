<script setup lang="ts">
import { computed } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the textarea's value
     */
    modelValue?: string

    /**
     * specifies `v-model` modifiers
     */
    modelModifiers?: { lazy?: boolean }
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value?: string]
}>()

//----------------------------------------------------------------------------------------------------

const updateModel = computed(() => (p.modelModifiers?.lazy ? 'change' : 'input'))
</script>

<template>
  <textarea
    class="vex-textarea"
    :value="p.modelValue"
    @[updateModel]="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  ></textarea>
</template>
