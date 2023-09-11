import { type FunctionalComponent, h } from 'vue'
import { Tag } from '@/components'
import { useTimeAgo } from '@vueuse/core'

export interface TableBodyCellProps {
  type: 'date' | 'number' | 'status'
}

export const TableTextCell: FunctionalComponent = (props, { slots }) => {
  return h(
    'td',
    {
      class: 'vex-table-body-row-cell',
    },
    slots?.default?.()
  )
}

TableTextCell.inheritAttrs = true
TableTextCell.displayName = 'TableTextCell'

export const TableDateCell: FunctionalComponent = (props, { slots }) => {
  return h(
    'td',
    {
      class: 'vex-table-body-row-cell',
    },
    slots?.default?.()
  )
}

TableDateCell.inheritAttrs = true
TableDateCell.displayName = 'TableTimeCell'

export const TableNumericCell: FunctionalComponent = (props, { slots }) => {
  return h(
    'td',
    {
      class: 'vex-table-body-row-cell',
      style: {
        textAlign: 'right',
      },
    },
    slots?.default?.()
  )
}

TableNumericCell.inheritAttrs = true
TableNumericCell.displayName = 'TableNumericCell'

export const TableStatusCell: FunctionalComponent = (props, { slots }) => {
  return h(
    'td',
    {
      class: 'vex-table-body-row-cell',
      style: {
        textAlign: 'center',
      },
    },
    h(Tag, { color: props.color }, () => slots?.default?.())
  )
}

TableStatusCell.inheritAttrs = true
TableStatusCell.displayName = 'TableStatusCell'
