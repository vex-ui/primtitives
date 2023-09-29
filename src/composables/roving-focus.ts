import type { Getter, MaybeRefOrGetter, Orientation } from '@/types'
import { wrapArray } from '@/utils'
import { toRef, toValue } from 'vue'
import { useEventListener } from '.'
import { useKeyIntent } from './key-intent'

interface RovingFocusOptions {
  onEntryFocus?: (e: FocusEvent, focusFirst: (items: HTMLElement[]) => void) => void
  orientation?: Getter<Orientation>
}

export function useRovingFocus(
  parent: MaybeRefOrGetter<HTMLElement | null>,
  children: MaybeRefOrGetter<HTMLElement[]>,
  options: RovingFocusOptions = {}
) {
  const { orientation, onEntryFocus } = options

  useEventListener(parent, 'focus', (e: FocusEvent) => {
    onEntryFocus ? onEntryFocus(e, focusFirst) : focusFirst(toValue(children))
  })

  useKeyIntent(
    toRef(parent),
    (e, intent) => {
      let elements = [...toValue(children)]
      if (!elements.includes(e.target as HTMLElement)) return

      e.preventDefault()
      e.stopPropagation()

      switch (intent) {
        case 'next': {
          const currFocusedItemIdx = elements.indexOf(e.target as HTMLElement)
          elements = wrapArray(elements, currFocusedItemIdx + 1)
          focusFirst(elements)
          break
        }

        case 'prev': {
          elements.reverse()
          const currFocusedItemIdx = elements.indexOf(e.target as HTMLElement)
          elements = wrapArray(elements, currFocusedItemIdx + 1)
          focusFirst(elements)
          break
        }

        case 'first': {
          focusFirst(elements)
          break
        }

        case 'last': {
          focusFirst(elements.reverse())
          break
        }
      }
    },
    { orientation }
  )
}

function focusFirst(elements: HTMLElement[]) {
  for (const el of elements) {
    const prevFocusedItem = document.activeElement
    if (el === prevFocusedItem) return
    el.focus()
    if (document.activeElement !== prevFocusedItem) return
  }
}
