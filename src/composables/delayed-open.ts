import type { Fn, MaybeRefOrGetter } from '@/types'
import { onScopeDispose, toValue } from 'vue'

interface UseDelayedOpenOptions {
  defaultShowDelay?: MaybeRefOrGetter<number | undefined>
  defaultHideDelay?: MaybeRefOrGetter<number | undefined>
}

export function useDelayedOpen(show: Fn, hide: Fn, options: UseDelayedOpenOptions) {
  const { defaultHideDelay = 0, defaultShowDelay = 0 } = options

  let showTimeoutID: ReturnType<typeof setTimeout>
  let hideTimeoutID: ReturnType<typeof setTimeout>

  const _show = (delay?: number) => {
    clearTimeouts()
    const _delay = delay ?? toValue(defaultShowDelay)

    if (_delay === 0) {
      show()
    } else {
      showTimeoutID = setTimeout(show, _delay)
    }
  }

  const _hide = (delay?: number) => {
    clearTimeouts()
    const _delay = delay ?? toValue(defaultHideDelay)

    if (_delay === 0) {
      hide()
    } else {
      hideTimeoutID = setTimeout(hide, _delay)
    }
  }

  const clearTimeouts = () => {
    clearTimeout(showTimeoutID)
    clearTimeout(hideTimeoutID)
  }

  onScopeDispose(clearTimeouts)

  return { show: _show, hide: _hide }
}
