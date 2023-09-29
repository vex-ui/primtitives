import { EXPOSED_EL } from '@/config'
import type { MaybeRefOrGetter } from '@/types'
import { isRef, type ComponentPublicInstance, type WatchSource } from 'vue'

// ----------------------------------------------------------------------------------------------------

export const noop = () => {}
export const isClient = typeof window !== 'undefined'
export const isString = (v: unknown): v is string => typeof v === 'string'
export const isFunction = (v: unknown): v is Function => v instanceof Function
export const isArray = Array.isArray
export const isIOS = getIsIOS()
export const isWatchable = <T>(v: MaybeRefOrGetter<T>): v is WatchSource<T> => {
  return isRef(v) || isFunction(v)
}

// ----------------------------------------------------------------------------------------------------

export function getIsIOS() {
  return !!(
    isClient &&
    window?.navigator?.userAgent &&
    /iP(ad|hone|od)/.test(window.navigator.userAgent)
  )
}

export function getRandomString(length: number): string {
  let result = ''
  while (result.length < length) {
    const randomSubstring = Math.random().toString(36).substring(2)
    result += randomSubstring.slice(0, length - result.length)
  }
  return result
}

export function getElementFromRef(
  vm: ComponentPublicInstance | Element | null,
  component: string
): HTMLElement | null {
  if (vm == null) return null
  if (vm instanceof Element) return vm as HTMLElement
  if (EXPOSED_EL in vm && vm[EXPOSED_EL] instanceof Element) return vm[EXPOSED_EL] as HTMLElement
  if (vm.$el instanceof Element) return vm.$el as HTMLElement

  throw new Error(`[vex] <${component}> has a non Element root child`)
}

export function getKebabCase(str = '') {
  if (getKebabCase.cache.has(str)) return getKebabCase.cache.get(str)!
  const kebab = str
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
  getKebabCase.cache.set(str, kebab)
  return kebab
}
getKebabCase.cache = new Map<string, string>()

// ----------------------------------------------------------------------------------------------------

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
export function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}

/**
 * removes an item from an array if it exists.
 * mutates the original array.
 */
export function remove<T>(array: T[], item: T) {
  const index = array.indexOf(item)
  if (index > -1) array.splice(index, 1)
}
