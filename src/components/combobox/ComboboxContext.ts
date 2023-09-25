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
  showDropdown: (source: ChangeEventSource) => void
  hideDropdown: (source: ChangeEventSource) => void
}

export interface UseComboboxOptions {
  onDropdownShow?: (source: ChangeEventSource) => void
  onDropdownHide?: (source: ChangeEventSource) => void

  loop?: MaybeRefOrGetter<boolean>
  scrollBehavior?: MaybeRefOrGetter<ScrollBehavior>
}

// ----------------------------------------------------------------------------------------------------

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<ComboboxContext>

export function useCombobox(options: UseComboboxOptions = {}) {
  const { onDropdownHide, onDropdownShow, scrollBehavior = 'auto', loop = true } = options

  const listboxID = useID()
  const triggerID = useID()
  const listboxEl: TemplateRef = ref(null)
  const triggerEl: TemplateRef<HTMLInputElement> = ref(null)

  const isDropdownVisible = ref(false)
  const selected = ref<string | undefined>()

  const showDropdown = (source: ChangeEventSource) => {
    if (isDropdownVisible.value) return
    isDropdownVisible.value = true
    onDropdownShow?.(source)
  }

  const hideDropdown = (source: ChangeEventSource) => {
    if (!isDropdownVisible.value) return
    isDropdownVisible.value = false
    onDropdownHide?.(source)
  }

  const select = (value: string) => {
    const option = getOptions(listboxEl).find((item) => item.dataset.vexValue === value)
    if (option) {
      clearSelected()
      option.setAttribute('aria-selected', 'true')
      selected.value = option.dataset.vexValue
    }
  }

  const clearSelected = () => {
    const items = listboxEl.value?.querySelectorAll<HTMLElement>(
      '[role=option][aria-selected=true]'
    )

    items?.forEach((item) => {
      item.setAttribute('aria-selected', 'false')
    })

    selected.value = undefined
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

// TODO: fix the any return type on @/composables then remove this annotation
export function useComboboxContext(component: string): ComboboxContext {
  return useContext(COMBOBOX_INJECTION_KEY, 'Combobox', component)
}

//----------------------------------------------------------------------------------------------------
// 📌 utils
//----------------------------------------------------------------------------------------------------

function getOptions(list: TemplateRef): HTMLElement[] {
  return Array.from(list.value?.querySelectorAll<HTMLElement>('[role=option]') ?? [])
}
