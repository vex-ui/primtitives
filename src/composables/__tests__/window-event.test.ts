import { useWindowEvent, clearMap } from '../window-event'
import { describe, it, expect, vi, beforeEach, afterEach, type SpyInstance } from 'vitest'

describe('useWindowEvent', () => {
  let addEventListenerSpy: SpyInstance
  let removeEventListenerSpy: SpyInstance

  beforeEach(() => {
    clearMap()
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should add only one handler for multiple listeners for the same event', () => {
    useWindowEvent('click', () => {})
    useWindowEvent('click', () => {})
    useWindowEvent('click', () => {})

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))

    useWindowEvent('pointerdown', () => {})
    useWindowEvent('pointerdown', () => {})
    useWindowEvent('pointerdown', () => {})

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2)
    expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function))
  })

  it('should remove the listener when remove function is called', () => {
    const listener = vi.fn()
    const remove = useWindowEvent('click', listener)

    remove()
    const event = new MouseEvent('click')
    window.dispatchEvent(event)

    expect(listener).not.toHaveBeenCalled()
  })

  it('should remove the handler if there are no more listeners', () => {
    const listener = vi.fn()
    const remove = useWindowEvent('click', listener)

    remove()
    expect(removeEventListenerSpy).toHaveBeenCalledOnce()
  })

  it('should call the listener when the event is triggered', () => {
    const listener = vi.fn()
    useWindowEvent('click', listener)

    const event = new MouseEvent('click')
    window.dispatchEvent(event)

    expect(listener).toHaveBeenCalledWith(event)
  })

  it('should call all listeners of the same event type', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    useWindowEvent('click', listener1)
    useWindowEvent('click', listener2)

    const event = new MouseEvent('click')
    window.dispatchEvent(event)

    expect(listener1).toHaveBeenCalledWith(event)
    expect(listener2).toHaveBeenCalledWith(event)
  })

  it('should handle different event types', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    useWindowEvent('click', listener1)
    useWindowEvent('resize', listener2)

    const clickEvent = new MouseEvent('click')
    const resizeEvent = new Event('resize')

    window.dispatchEvent(clickEvent)
    window.dispatchEvent(resizeEvent)

    expect(listener1).toHaveBeenCalledWith(clickEvent)
    expect(listener2).toHaveBeenCalledWith(resizeEvent)
  })

  it('should handle removing individual listeners', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    const cleanup1 = useWindowEvent('click', listener1)
    const cleanup2 = useWindowEvent('click', listener2)

    const event = new MouseEvent('click')
    window.dispatchEvent(event)

    expect(listener1).toHaveBeenCalledWith(event)
    expect(listener2).toHaveBeenCalledWith(event)

    cleanup1()

    window.dispatchEvent(event)
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)

    cleanup2()

    window.dispatchEvent(event)
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)
  })

  it('should handle removing individual listeners and handler', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    const cleanup1 = useWindowEvent('click', listener1)
    const cleanup2 = useWindowEvent('click', listener2)

    const event = new MouseEvent('click')
    window.dispatchEvent(event)

    expect(listener1).toHaveBeenCalledWith(event)
    expect(listener2).toHaveBeenCalledWith(event)

    cleanup1()
    window.dispatchEvent(event)
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(0)

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)

    cleanup2()
    window.dispatchEvent(event)

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
  })
})
