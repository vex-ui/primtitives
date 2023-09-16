import type { Fn, MaybeRefOrGetter, TemplateRef } from '@/types'
import { isClient, isIOS, isWatchable, noop } from '@/utils'
import { onScopeDispose, toValue, watch } from 'vue'

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

  let unregister = noop

  if (isWatchable(isActive)) {
    watch([isActive, target], ([active, target]) => {
      if (active && target) {
        window.addEventListener('pointerdown', onClick, { capture: true })
        unregister = () => window.removeEventListener('pointerdown', onClick, { capture: true })
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
