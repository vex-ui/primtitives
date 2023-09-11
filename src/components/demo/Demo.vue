<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Select, Input, Switch } from '@/components'

export interface DemoControls {
  label: string
  options?: any[]
  default?: any
  controlType: 'Select' | 'Input' | 'Switch'
}

const props = defineProps<{
  controls?: DemoControls[]
}>()

const state = reactive<any>({})

props.controls.forEach((c) => {
  state[c.label] = c.default
})

const getControl = (name: 'Select' | 'Input' | 'Switch') => {
  if (name === 'Input') return Input
  if (name === 'Switch') return Switch
  else return Select
}
</script>

<template>
  <div class="vex-demo-wrapper">
    <div class="vex-demo-window">
      <slot name="window" :state="state" />
    </div>
    <div class="vex-demo-controls">
      <template v-for="c in controls" :key="c.label">
        <Component
          v-model="state[c.label]"
          :label="c.label"
          :options="c.options"
          :is="getControl(c.controlType)"
          compact="sm"
        ></Component>
      </template>
    </div>
    <div class="vex-demo-code">
      <pre style="margin: 0">
        <slot name="code" :state="state" />
      </pre>
    </div>
  </div>
</template>

<style lang="scss">
.vex-demo-wrapper {
  width: 100%;
  display: grid;
  grid-template: 1fr max-content / 1fr max-content;
  border: 1px solid var(--vex-border-clr-base);
  border-radius: var(--vex-border-radius-md);
}

.vex-demo-window {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--vex-spacing-4);
  border-right: 1px solid var(--vex-border-clr-base);
}

.vex-demo-controls {
  padding: var(--vex-spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--vex-spacing-3);
}

.vex-demo-code {
  border-top: 1px solid var(--vex-border-clr-base);
  padding: var(--vex-spacing-4);
  grid-column: 1 / -1;
  margin: 0;
  font-family: inherit;
}
</style>
