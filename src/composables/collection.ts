import type { Getter, TemplateRef } from '@/types'
import { computed, shallowReactive } from 'vue'

type Item<T extends HTMLElement> = {
  id: string
  templateRef: TemplateRef<T>
  disabled?: Getter<boolean>
}

export function createCollection<T extends HTMLElement = HTMLElement>(collectionID: string) {
  const _collection = shallowReactive<Map<TemplateRef<T>, Item<T>>>(new Map())

  const items = computed(() => [..._collection.values()])

  const elements = computed(() =>
    [..._collection.keys()].reduce<T[]>((arr, ref) => {
      const el = ref.value
      el != null && arr.push(el)
      return arr
    }, [])
  )

  let count = 0
  const getID = () => `${collectionID}-${count++}`

  const add = (templateRef: TemplateRef<T>, disabled?: Getter<boolean>) => {
    const id = getID()
    const item = { id, templateRef, disabled }
    _collection.set(templateRef, item)
    return item
  }

  const remove = (templateRef: TemplateRef<T>) => {
    _collection.delete(templateRef)
  }

  return {
    items,
    elements,
    add,
    remove,
  }
}
