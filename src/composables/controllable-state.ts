import type { Getter } from '@/types'
import { getCurrentInstance, shallowRef, type Ref } from 'vue'
import { getKebabCase } from './helpers'
import { useVModel } from './v-model'

type Options = {
  name?: string
}

export function useControllableState<T>(prop: Getter<T>, { name = 'modelValue' }: Options): Ref<T> {
  const vm = getCurrentInstance()
  const kebabName = getKebabCase(name)
  const isControlled =
    (vm?.vnode.props?.hasOwnProperty(name) || vm?.vnode.props?.hasOwnProperty(kebabName)) &&
    (vm.vnode.props?.hasOwnProperty(`onUpdate:${name}`) ||
      vm.vnode.props?.hasOwnProperty(`onUpdate:${kebabName}`))

  if (isControlled) {
    return useVModel(prop, { eventName: `update:${name}` })
  }

  return shallowRef(prop())
}
