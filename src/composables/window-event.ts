import type { Fn } from '@/types'
import { isClient, noop, remove } from '@/utils'
import { onScopeDispose } from 'vue'

type WindowEvents = keyof WindowEventMap
type Listener<T extends WindowEvents> = (event: WindowEventMap[T]) => void
type SharedEventHandler<T extends WindowEvents> = {
  listeners: Listener<T>[]
  isAttached: boolean
  remove: () => void
}

const handlersMap = new Map<WindowEvents, SharedEventHandler<WindowEvents>>()

export function useWindowEvent<T extends WindowEvents>(eventType: T, listener: Listener<T>): Fn {
  if (!isClient) return noop

  const handler = getHandler(eventType)
  handler.listeners.push(listener)
  attachHandler(handler, eventType)

  const cleanup = () => {
    remove(handler.listeners, listener)
    if (!handler.listeners.length) {
      handler.remove()
    }
  }

  onScopeDispose(cleanup)
  return cleanup
}

function attachHandler<T extends WindowEvents>(
  handler: SharedEventHandler<T>,
  eventType: T
): SharedEventHandler<T> {
  if (!handler.isAttached) {
    const listener: Listener<T> = (e) => handler.listeners.forEach((cb) => cb(e))

    window.addEventListener(eventType, listener)

    handler.remove = () => {
      window.removeEventListener(eventType, listener)
      handler.isAttached = false
    }

    handler.isAttached = true
  }

  return handler
}

function getHandler<T extends WindowEvents>(eventType: T): SharedEventHandler<T> {
  if (handlersMap.has(eventType)) {
    return handlersMap.get(eventType)!
  }

  return handlersMap
    .set(eventType, {
      listeners: [],
      isAttached: false,
      remove: noop,
    })
    .get(eventType)!
}

/**
 * DO NOT USE.
 * this function is here only to support tests
 */
export const clearMap = () => {
  for (const [, handler] of handlersMap) {
    handler.remove()
  }
  handlersMap.clear()
}
