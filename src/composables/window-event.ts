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
type HandlersMap = {
  [K in WindowEvents]?: SharedEventHandler<K>
}
const handlersMap: HandlersMap = {}

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

function attachHandler<T extends WindowEvents>(handler: SharedEventHandler<T>, eventType: T): void {
  if (!handler.isAttached) {
    const listener: Listener<T> = (e) => handler.listeners.forEach((cb) => cb(e))

    window.addEventListener(eventType, listener)
    handler.isAttached = true

    handler.remove = () => {
      if (!handler.isAttached) return
      window.removeEventListener(eventType, listener)
      handler.isAttached = false
    }
  }
}

function getHandler<T extends WindowEvents>(eventType: T): SharedEventHandler<T> {
  return (handlersMap[eventType] ??= {
    listeners: [],
    isAttached: false,
    remove: noop,
  })
}

/**
 * DO NOT USE.
 * this function is here only to support tests
 */
export const clearMap = () => {
  for (const [key, value] of Object.entries(handlersMap)) {
    value.remove()
    delete handlersMap[key as WindowEvents]
  }
}
