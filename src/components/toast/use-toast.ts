import { render, h, markRaw } from 'vue'
import type { VNode, Component } from 'vue'
import ToastRoot from './ToastRoot.vue'
import { useID } from '@/composables'

export interface ToastifyProps {
  content: string | Component
  color?: 'success' | 'warning' | 'danger' | 'accent' | 'primary'
  duration?: number
}

export interface ToastItem extends ToastifyProps {
  key: string
}

let Root: VNode | null = null

export function useToast() {
  if (!Root) {
    Root = h(ToastRoot)
    render(Root, document.createDocumentFragment() as unknown as Element)
  }

  /**
   * creates new toasts
   * @returns a function that removes the toast
   */
  function toastify(params: ToastifyProps) {
    const item = markRaw({ ...params, key: useID() })

    Root?.component?.exposed?.addToast(item)

    /** removes the toast*/
    const remove = () => {
      Root?.component?.exposed?.removeToast(item)
    }

    return remove
  }

  return {
    toastify,
  }
}
