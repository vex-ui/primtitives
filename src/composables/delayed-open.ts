import type { Fn, Getter } from '@/types'
import { onScopeDispose } from 'vue'

interface UseDelayedOpenOptions {
  defaultShowDelay?: Getter<number | undefined>
  defaultHideDelay?: Getter<number | undefined>
}

export function useDelayedOpen(show: Fn, hide: Fn, options: UseDelayedOpenOptions) {
  let showTimeoutID: NodeJS.Timeout = -1 as unknown as NodeJS.Timeout
  let hideTimeoutID: NodeJS.Timeout = -1 as unknown as NodeJS.Timeout

  const _show = (delay?: number) => {
    clearTimeouts()
    const _delay = delay ?? options.defaultShowDelay?.() ?? 0

    if (_delay === 0) {
      show()
    } else {
      showTimeoutID = setTimeout(show, _delay)
    }
  }

  const _hide = (delay?: number) => {
    clearTimeouts()
    const _delay = delay ?? options.defaultHideDelay?.() ?? 0

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
