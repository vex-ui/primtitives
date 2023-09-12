import type { Fn, MaybeRefOrGetter, TemplateRef } from '@/types'
import { isClient, isIOS, isWatchable, noop, remove } from '@/utils'
import { onScopeDispose, toValue, watch } from 'vue'

interface Options {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeRefOrGetter<(HTMLElement | null)[]>
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

  const { ignore = [], isActive = true } = options
  let shouldIgnore = false

  const onClick = (e: PointerEvent): void => {
    if (!source.value || isElementInsideComposedPath(e, source.value)) return

    if (e.detail === 0) {
      shouldIgnore = toValue(ignore).some((el) => el && isElementInsideComposedPath(e, el))
    }

    if (!shouldIgnore) cb(e)
  }

  let unregister = toValue(isActive) ? registerListener(onClick) : noop

  if (isWatchable(isActive)) {
    watch(isActive, (active) => {
      if (active) unregister = registerListener(onClick)
      else unregister()
    })
  }

  onScopeDispose(unregister)
  return unregister
}

//----------------------------------------------------------------------------------------------------
// 📌 Global Click Event Listener
//
// The idea is to have a single shared window listener that automatically removes itself
// when there are no active listeners in the array, the window listener should loop through
// and run all the registered listeners.
//----------------------------------------------------------------------------------------------------

type Listener = (e: PointerEvent) => void

const listeners: Listener[] = []
let removeWindowListener = noop
let isWindowListenerAttached = false

function registerListener(listener: Listener) {
  listeners.push(listener)

  if (!isWindowListenerAttached) {
    removeWindowListener = useWindowEventListener((e: PointerEvent) => {
      listeners.forEach((listener) => listener(e))
    })
    isWindowListenerAttached = true
  }

  return () => {
    remove(listeners, listener)
    if (!listeners.length) {
      removeWindowListener()
      isWindowListenerAttached = false
    }
  }
}

//----------------------------------------------------------------------------------------------------
// 📌 utils
//----------------------------------------------------------------------------------------------------

function useWindowEventListener(listener: Listener) {
  useIosWorkaround()

  window.addEventListener('pointerdown', listener, { passive: true, capture: true })
  return () => window.removeEventListener('pointerdown', listener, { capture: true })
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let isIOSWorkaroundActive = false
function useIosWorkaround() {
  if (!isIOSWorkaroundActive && isIOS) {
    isIOSWorkaroundActive = true
    Array.from(document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
}

function isElementInsideComposedPath(e: PointerEvent, el: HTMLElement) {
  return e.target === el || e.composedPath().includes(el)
}
