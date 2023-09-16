import type { Fn, MaybeRefOrGetter, TemplateRef } from '@/types'
import { isClient, isIOS, isWatchable, noop } from '@/utils'
import { onScopeDispose, toValue, watch } from 'vue'
import { useWindowEvent } from './window-event'

type Listener = (e: PointerEvent) => void

interface Options {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeRefOrGetter<MaybeRefOrGetter<HTMLElement | null>[]>
  /**
   * whether the listener is Active, use it to temporarily remove the listener.
   * @defaultValue true
   */
  isActive?: MaybeRefOrGetter<boolean>
}

/**
 * Listen for clicks outside of an element.
 * @returns cleanupFn
 */
export function useClickOutside(source: TemplateRef, cb: Listener, options: Options = {}): Fn {
  if (!isClient) return noop
  useIosWorkaround()

  const { ignore = [], isActive = true } = options

  const onClick = (e: PointerEvent): void => {
    const path = e.composedPath()
    const elements = [source, ...toValue(ignore)]

    const shouldIgnore = elements.some((templateRef) => {
      const el = toValue(templateRef)
      return el && path.includes(el)
    })

    if (!shouldIgnore) {
      cb(e)
    }
  }

  let unregister = toValue(isActive) ? useWindowEvent('pointerdown', onClick) : noop

  if (isWatchable(isActive)) {
    watch(isActive, (active) => {
      if (active) {
        unregister = useWindowEvent('pointerdown', onClick)
      } else {
        unregister()
        unregister = noop
      }
    })
  }

  onScopeDispose(unregister)
  return unregister
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let isIOSWorkaroundActive = false
function useIosWorkaround() {
  if (!isIOSWorkaroundActive && isIOS) {
    isIOSWorkaroundActive = true
    Array.from(document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
}
