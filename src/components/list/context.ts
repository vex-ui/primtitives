import type { InjectionKey, Ref } from 'vue'
import type { ComputableGetter, Setter } from '@/types'
import { useContext } from '@/composables'

type Value = string

export const LIST_CTX = Symbol() as InjectionKey<{
  selected: [ComputableGetter<Value | Value[] | undefined>, Setter<Value>]
}>

export function useListContext() {
  return useContext(LIST_CTX, 'List', 'ListItem')
}
