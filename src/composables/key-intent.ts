import type {
  Fn,
  KeyIntent,
  MaybeRefOrGetter,
  NavigationKey,
  Orientation,
  TemplateRef,
} from '@/types'
import { toValue } from 'vue'
import { useEventListener, useTextDirection } from '.'
import type { Dir } from './text-direction'

type Listener = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKey) => void

interface Options {
  orientation?: MaybeRefOrGetter<Orientation>
}

export function useKeyIntent(target: TemplateRef, listener: Listener, options: Options = {}): Fn {
  const { orientation = 'vertical' } = options
  const dir = useTextDirection()

  return useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const key = e.key
    if (!isNavigationKey(key)) return

    const intent = getKeyIntent(key, dir.value, toValue(orientation))
    listener(e, intent, key)
  })
}

export function getKeyIntent(key: NavigationKey, dir: Dir, orientation: Orientation): KeyIntent {
  switch (getDirectionAwareKey(key, dir)) {
    case 'ArrowDown':
      if (orientation === 'vertical') return 'next'
      return 'show'

    case 'ArrowUp':
      if (orientation === 'vertical') return 'prev'
      return 'hide'

    case 'ArrowRight':
      if (orientation === 'vertical') return 'show'
      return 'next'

    case 'ArrowLeft':
      if (orientation === 'vertical') return 'hide'
      return 'prev'

    case 'End':
      return 'last'

    case 'Home':
      return 'first'
  }
}

// FIXME: handle dir === 'auto' | undefined cases
function getDirectionAwareKey(key: NavigationKey, dir: Dir) {
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

function isNavigationKey(v: string): v is NavigationKey {
  return ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(v)
}
