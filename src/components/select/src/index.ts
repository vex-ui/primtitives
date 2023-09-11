import type { Ref, InjectionKey } from 'vue'

export { default as Select } from './Select.vue'
export { default as SelectItem } from './SelectItem.vue'
export { default as SelectGroup } from './SelectGroup.vue'

export const SELECT_CTX = Symbol() as InjectionKey<{
  onSelect: (value: string) => void
  selectedItems: Ref<string | string[] | undefined>
}>
