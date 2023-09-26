import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import { useContext, useID } from '@/composables'
import { ref, type InjectionKey, type Ref, provide, readonly } from 'vue'

type ChangeEventSource = 'keyboard' | 'mouse' | 'unknown'

export interface ComboboxContext {
  triggerID: string
  listboxID: string
  listboxEl: TemplateRef
  triggerEl: TemplateRef<HTMLInputElement>

  loop: MaybeRefOrGetter<boolean>
  scrollBehavior: MaybeRefOrGetter<ScrollBehavior>
  isDropdownVisible: Readonly<Ref<boolean>>

  select: (value: string) => void
  getOptions: () => HTMLElement[]
  showDropdown: (source?: ChangeEventSource) => void
  hideDropdown: (source?: ChangeEventSource) => void
}

export interface UseComboboxOptions {
  onShowDropdown?: (source: ChangeEventSource) => void
  onHideDropdown?: (source: ChangeEventSource) => void

  loop?: MaybeRefOrGetter<boolean>
  scrollBehavior?: MaybeRefOrGetter<ScrollBehavior>
}

// ----------------------------------------------------------------------------------------------------

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<ComboboxContext>

export function useCombobox(options: UseComboboxOptions = {}) {
  const { onHideDropdown, onShowDropdown, scrollBehavior = 'auto', loop = true } = options

  const listboxID = useID()
  const triggerID = useID()
  const listboxEl: TemplateRef = ref(null)
  const triggerEl: TemplateRef<HTMLInputElement> = ref(null)

  const isDropdownVisible = ref(false)
  const selected = ref<string | undefined>()

  const showDropdown = (source: ChangeEventSource = 'unknown'): void => {
    if (isDropdownVisible.value) return
    isDropdownVisible.value = true
    onShowDropdown?.(source)
  }

  const hideDropdown = (source: ChangeEventSource = 'unknown'): void => {
    if (!isDropdownVisible.value) return
    isDropdownVisible.value = false
    onHideDropdown?.(source)
  }

  const select = (value: string): void => {
    const option = getOptions().find((item) => item.dataset.vexValue === value)
    if (option) {
      clearSelected()
      option.setAttribute('aria-selected', 'true')
      selected.value = option.dataset.vexValue
    }
  }

  const clearSelected = (): void => {
    const items = listboxEl.value?.querySelectorAll<HTMLElement>(
      '[role=option][aria-selected=true]'
    )

    items?.forEach((item) => {
      item.setAttribute('aria-selected', 'false')
    })

    selected.value = undefined
  }

  const getOptions = (): HTMLElement[] => {
    return Array.from(listboxEl.value?.querySelectorAll<HTMLElement>('[role=option]') ?? [])
  }

  provide(COMBOBOX_INJECTION_KEY, {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,

    loop,
    scrollBehavior,
    isDropdownVisible: readonly(isDropdownVisible),

    select,
    getOptions,
    showDropdown,
    hideDropdown,
  })

  return {
    select,
    showDropdown,
    hideDropdown,
    isDropdownVisible: readonly(isDropdownVisible),
  }
}

export function useComboboxContext(component: string) {
  return useContext(COMBOBOX_INJECTION_KEY, 'Combobox', component)
}
