import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import { isClient, isIOS, isWatchable, noop } from '@/utils'
import { onScopeDispose, toValue, watch } from 'vue'
import { useWindowEvent } from './window-event'

type Listener = (e: PointerEvent) => void

interface Options {
  ignore?: MaybeRefOrGetter<MaybeRefOrGetter<HTMLElement | null>[]>
  isActive?: MaybeRefOrGetter<boolean>
}

export function useClickOutside(target: TemplateRef, listener: Listener, options: Options = {}) {
  if (!isClient) return noop
  useIosWorkaround()

  const { ignore = [], isActive = true } = options

  const onClick: Listener = (e) => {
    const path = e.composedPath()
    const elements = [target, ...toValue(ignore)]

    const shouldIgnore = elements.some((templateRef) => {
      const el = toValue(templateRef)
      return el && path.includes(el)
    })

    if (!shouldIgnore) {
      listener(e)
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
  return { stop: unregister }
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let isIOSWorkaroundActive = false
function useIosWorkaround() {
  if (!isIOSWorkaroundActive && isIOS) {
    isIOSWorkaroundActive = true
    Array.from(document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
}
