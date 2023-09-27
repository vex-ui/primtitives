import { computed, shallowReactive, type ComputedRef } from 'vue'
import type { Getter, TemplateRef } from '@/types'

export interface CollectionItem<T extends HTMLElement> {
  id: string
  templateRef: TemplateRef<T>
  disabled?: Getter<boolean>
}

export interface Collection<T extends HTMLElement> {
  add: (templateRef: TemplateRef<T>, disabled?: Getter<boolean>) => CollectionItem<T>
  items: ComputedRef<CollectionItem<T>[]>
  remove: (templateRef: TemplateRef<T>) => void
  elements: ComputedRef<T[]>
}

export function useCollection<T extends HTMLElement = HTMLElement>(id: string): Collection<T> {
  let count = 0
  const collection = shallowReactive<Map<TemplateRef<T>, CollectionItem<T>>>(new Map())

  const items = computed(() => [...collection.values()])
  const elements = computed(() =>
    [...collection.keys()].reduce<T[]>((arr, ref) => {
      const el = ref.value
      el != null && arr.push(el)
      return arr
    }, [])
  )

  const generateID = (): string => {
    return `${id}-${count++}`
  }

  const add = (templateRef: TemplateRef<T>, disabled?: Getter<boolean>): CollectionItem<T> => {
    const id = generateID()
    const item = { id, templateRef, disabled }
    collection.set(templateRef, item)
    return item
  }

  const remove = (templateRef: TemplateRef<T>): void => {
    collection.delete(templateRef)
  }

  return {
    add,
    remove,
    items,
    elements,
  }
}
