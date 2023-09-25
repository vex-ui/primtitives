<script setup lang="ts">
import { isString } from '@/composables/helpers'
import { TableNumericCell, TableStatusCell, TableTextCell, TableDateCell } from './TableBodyCell'
import { computed } from 'vue'

// TODO: value does not need to be string
export interface ObjectColumn {
  label: string
  value: string
}
export type Column = string | ObjectColumn

const p = withDefaults(
  defineProps<{
    caption?: string
    columns?: Column[]
    data?: string[][]
  }>(),
  {
    columns: () => [],
    data: () => [[]],
  }
)

const emit = defineEmits<{
  (event: 'sort', column: Column): void
}>()

// 📌 table head

const headers = computed<string[]>(() => {
  if (!p.columns.length) return []

  if (isString(p.columns[0])) {
    return [...(p.columns as string[])]
  }

  return (p.columns as ObjectColumn[]).map((i) => i.label)
})

// 📌 table body

// 📌 sort

function handleSort(header: string) {
  emit('sort', getColFromHeader(header))
}

// 📌 utils

function getColFromHeader(header: string): Column {
  return isString(p.columns[0])
    ? header
    : (p.columns as ObjectColumn[]).find((i) => i.label === header)
}
</script>

<template>
  <div class="vex-table-wrapper">
    <table class="vex-table">
      <caption class="vex-table-caption vex-sr-only">
        <slot name="caption">{{ caption }}</slot>
      </caption>

      <!-- head -->

      <thead class="vex-table-head">
        <tr class="vex-table-head-row">
          <th
            v-for="header in headers"
            :key="header"
            @click="handleSort(header)"
            class="vex-table-head-row-cell"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <!-- body -->

      <tbody class="vex-table-body">
        <tr class="vex-table-body-row" v-for="row in data">
          <TableDateCell v-for="cell in row" :key="cell">
            {{ cell }}
          </TableDateCell>
        </tr>
      </tbody>
    </table>
  </div>
</template>
