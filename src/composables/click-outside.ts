import type { Fn, MaybeRefOrGetter, TemplateRef } from '@/types'
import { isWatchable, remove } from '@/utils'
import { EffectScope, effectScope, onScopeDispose, toValue, watch } from 'vue'
import { isIOS, noop } from './helpers'

interface Options {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeRefOrGetter<TemplateRef[]>
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
  if (!window) return noop

  const { ignore = [], isActive = true } = options
  const initiallyActive = toValue(isActive)

  const shouldIgnore = (e: PointerEvent): boolean =>
    toValue(ignore).some((ref) => isTargetInsideElement(e, ref))

  let isClickOutside = true

  const onClick = (e: PointerEvent): void => {
    if (isTargetInsideElement(e, source)) {
      return
    }

    if (e.detail === 0) {
      isClickOutside = !shouldIgnore(e)
    }

    isClickOutside && cb(e)
  }

  let unregister = initiallyActive ? registerListener(onClick) : noop

  if (isWatchable(isActive)) {
    watch(isActive, (isActive) => {
      if (isActive) {
        unregister = registerListener(onClick)
      } else {
        unregister()
      }
    })
  }

  onScopeDispose(unregister)
  return unregister
}

//----------------------------------------------------------------------------------------------------
// 📌 shared listener
//
// The idea is to have a single shared window listener that automatically removes itself
// when there are no active listeners in the array, the window listener should loop through
// and run all the registered listeners.
//----------------------------------------------------------------------------------------------------

type Listener = (e: PointerEvent) => void

let scope: EffectScope | null
const listeners: Listener[] = []

function registerListener(listener: Listener) {
  listeners.push(listener)

  if (!scope) {
    scope = effectScope(true)
    scope.run(() => {
      useWindowEventListener((e: PointerEvent) => {
        listeners.forEach((listener) => listener(e))
      })
    })
  }

  return () => {
    remove(listeners, listener)
    if (scope && !listeners.length) {
      scope.stop()
      scope = null
    }
  }
}

//----------------------------------------------------------------------------------------------------
// 📌 utils
//----------------------------------------------------------------------------------------------------

function useWindowEventListener(listener: Listener) {
  useIosWorkaround()

  window.addEventListener('pointerdown', listener, { passive: true, capture: true })
  onScopeDispose(() => {
    window.removeEventListener('pointerdown', listener, { capture: true })
  })
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let isIOSWorkaroundActive = false
function useIosWorkaround() {
  if (!isIOSWorkaroundActive && isIOS) {
    isIOSWorkaroundActive = true
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
}

function isTargetInsideElement(e: PointerEvent, templateRef: TemplateRef) {
  const el = templateRef.value
  return el && (e.target === el || e.composedPath().includes(el))
}
