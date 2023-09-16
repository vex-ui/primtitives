import type { Fn } from '@/types'
import { isClient, noop, remove } from '@/utils'
import { onScopeDispose } from 'vue'

export function useWindowEvent<T extends WindowEvents>(eventType: T, listener: Listener<T>): Fn {
  if (!isClient) return noop

  WindowEventsHandler.addListener(eventType, listener)
  const cleanup = () => WindowEventsHandler.removeListener(eventType, listener)

  onScopeDispose(cleanup)
  return cleanup
}

//----------------------------------------------------------------------------------------------------
// 📌 implementation
//----------------------------------------------------------------------------------------------------

type WindowEvents = keyof WindowEventMap
type Listener<T extends WindowEvents> = (event: WindowEventMap[T]) => void
type EventHandler<T extends WindowEvents> = {
  listeners: Listener<T>[]
  isAttached: boolean
  detach: () => void
}
type HandlersMap = {
  [K in WindowEvents]?: EventHandler<K>
}

//----------------------------------------------------------------------------------------------------

export abstract class WindowEventsHandler {
  static #map: HandlersMap = {}

  private static getHandler<T extends WindowEvents>(event: T): EventHandler<T> {
    return (this.#map[event] ??= {
      listeners: [],
      isAttached: false,
      detach: noop,
    })
  }

  private static attachHandler<T extends WindowEvents>(event: T, handler: EventHandler<T>): void {
    const sharedListener: Listener<T> = (e) => handler.listeners.forEach((fn) => fn(e))
    handler.isAttached = true
    window.addEventListener(event, sharedListener)
    handler.detach = () => window.removeEventListener(event, sharedListener)
  }

  private static detachHandler<T extends WindowEvents>(event: T, handler: EventHandler<T>): void {
    if (handler.isAttached) {
      handler.detach()
      handler.isAttached = false
    }
  }

  //  DO NOT USE in real code, this is just a test helper
  private static clearMap(): void {
    for (const [key, value] of Object.entries(this.#map)) {
      value.detach()
      delete this.#map[key as WindowEvents]
    }
  }

  static addListener<T extends WindowEvents>(event: T, listener: Listener<T>): void {
    const handler = this.getHandler(event)
    handler.listeners.push(listener)
    if (!handler.isAttached) {
      this.attachHandler(event, handler)
    }
  }

  static removeListener<T extends WindowEvents>(event: T, listener: Listener<T>): void {
    const handler = this.getHandler(event)
    remove(handler.listeners, listener)
    if (!handler.listeners.length) {
      this.detachHandler(event, handler)
    }
  }
}
