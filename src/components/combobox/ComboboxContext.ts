import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import {
  useContext,
  useEventListener,
  useID,
  useSelectionGroup,
  type SelectionGroup,
  useCollection,
} from '@/composables'
import { ref, type InjectionKey, type Ref, provide, readonly, watch, toValue } from 'vue'
import { isWatchable, noop } from '@/utils'
import type { Collection } from '@/composables/collection'

type ChangeEventSource = 'keyboard' | 'mouse' | 'unknown'

export interface ComboboxContext {
  triggerID: string
  listboxID: string
  listboxEl: TemplateRef
  triggerEl: TemplateRef<HTMLInputElement>

  loop: MaybeRefOrGetter<boolean>
  group: SelectionGroup<string>
  collection: Collection<HTMLElement>
  scrollBehavior: MaybeRefOrGetter<ScrollBehavior>
  isDropdownVisible: Readonly<Ref<boolean>>

  showDropdown: (source?: ChangeEventSource) => void
  hideDropdown: (source?: ChangeEventSource) => void
}

export interface UseComboboxOptions {
  onSelect?: (value?: string) => void
  onShowDropdown?: (source: ChangeEventSource) => void
  onHideDropdown?: (source: ChangeEventSource) => void

  loop?: MaybeRefOrGetter<boolean>
  searchable?: MaybeRefOrGetter<boolean>
  multiselect?: MaybeRefOrGetter<boolean>
  deselection?: MaybeRefOrGetter<boolean>
  scrollBehavior?: MaybeRefOrGetter<ScrollBehavior>
}

// ----------------------------------------------------------------------------------------------------

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<ComboboxContext>

export function useCombobox(options: UseComboboxOptions = {}) {
  const {
    loop = true,
    searchable = false,
    multiselect = false,
    deselection = false,
    scrollBehavior = 'auto',
    onSelect,
    onHideDropdown,
    onShowDropdown,
  } = options

  const listboxID = useID()
  const triggerID = useID()
  const listboxEl: TemplateRef = ref(null)
  const triggerEl: TemplateRef<HTMLInputElement> = ref(null)

  const isDropdownVisible = ref(false)
  const selected = ref<string[]>([])

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

  const group = useSelectionGroup(selected, { deselection, multiselect })
  const collection = useCollection(listboxID)

  const select = (value: string): void => {
    const inputEl = triggerEl.value
    const optionEl = collection.elements.value.find((item) => item.dataset.vexValue === value)
    if (!optionEl || !inputEl) return

    clearAriaSelected()
    optionEl.setAttribute('aria-selected', 'true')
    inputEl.value = value
    group.select(value)
    onSelect?.(value)
  }

  const deselect = (value: string): void => {
    const optionEl = collection.elements.value.find((item) => item.dataset.vexValue === value)
    optionEl?.setAttribute('aria-selected', 'true')
    group.deselect(value)
  }

  const clearAriaSelected = (): void => {
    const items = listboxEl.value?.querySelectorAll<HTMLElement>(
      '[role=option][aria-selected=true]'
    )

    items?.forEach((item) => {
      item.setAttribute('aria-selected', 'false')
    })
  }

  const clearSelected = (): void => {
    clearAriaSelected()
    group.clearSelected()
  }

  // when a user presses a printable key (i.e [a-z]) move focus back
  // to the input field.
  useEventListener(listboxEl, 'keydown', (e: KeyboardEvent) => {
    if (!toValue(searchable)) return

    const isModifierKey = e.metaKey || e.ctrlKey || e.altKey
    const isPrintableKey = e.key.length === 1 && !isModifierKey
    const inputEl = triggerEl.value

    if (isPrintableKey && inputEl) {
      e.preventDefault()
      inputEl.value += e.key
      inputEl.focus()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const activeOptionEl = (e.target as HTMLElement).closest<HTMLElement>('[role=option]')
      activeOptionEl?.click()
      return
    }
  })

  const _group = {
    select,
    selected,
    deselect,
    clearSelected,
    isSelected: group.isSelected,
  }

  provide(COMBOBOX_INJECTION_KEY, {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,

    loop,
    group: _group,
    collection,
    scrollBehavior,

    showDropdown,
    hideDropdown,
    isDropdownVisible: readonly(isDropdownVisible),
  })

  return {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,

    group: _group,
    collection,

    showDropdown,
    hideDropdown,
    isDropdownVisible: readonly(isDropdownVisible),
  }
}

export function useComboboxContext(component: string) {
  return useContext(COMBOBOX_INJECTION_KEY, 'Combobox', component)
}
