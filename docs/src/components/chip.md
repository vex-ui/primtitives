<script setup>
import { Chip,ChipGroup , Demo } from '@vex-ui/core'
import { ref } from 'vue'

const selectedChip = ref()

const controls = [
  {
    label: 'multiple',
    default: false,
    controlType: 'Switch'
  }
]
</script>

# chip

<Demo :controls="controls">
  <template #window="{ state }">
    <ChipGroup v-model="selectedChip" :multiple="state.multiple">
      <Chip value="value 1">Chip</Chip>
      <Chip value="value 2">Chip</Chip>
      <Chip value="value 3">Chip</Chip>
    </ChipGroup>
  </template>
</Demo>

## usage

chips without a `value` prop are basically presentational chips, and they can't be toggled by
users actions - such as a mouse click - but they can be toggled by changing `modelValue` using javascript

<div class="flex items-center justify-center">
  <Chip>chip</Chip>
</div>
