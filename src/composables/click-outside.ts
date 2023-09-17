import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import { isClient, isIOS, noop } from '@/utils'
import { onScopeDispose, toValue } from 'vue'

type Listener = (e: PointerEvent) => void

interface Options {
  ignore?: MaybeRefOrGetter<MaybeRefOrGetter<HTMLElement | null>[]>
  isActive?: MaybeRefOrGetter<boolean>
}

export function useClickOutside(target: TemplateRef, listener: Listener, options: Options = {}) {
  if (!isClient) return noop
  useIosWorkaround()

  const { ignore = [], isActive = true } = options

  const onPointerDown: Listener = (e) => {
    const _target = toValue(target)
    if (!toValue(isActive) || !_target) return

    const path = e.composedPath()
    if (path.includes(_target)) return

    const shouldIgnore = toValue(ignore).some((templateRef) => {
      const el = toValue(templateRef)
      return el && path.includes(el)
    })

    if (!shouldIgnore) {
      listener(e)
    }
  }

  window.addEventListener('pointerdown', onPointerDown, { capture: true })
  const unregister = () =>
    window.removeEventListener('pointerdown', onPointerDown, { capture: true })

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
