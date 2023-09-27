import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import {
  useContext,
  useEventListener,
  useID,
  useSelectionGroup,
  type SelectionGroup,
  useCollection,
  useDelayedOpen,
} from '@/composables'
import { ref, type InjectionKey, type Ref, provide, readonly, watch, toValue } from 'vue'
import { isWatchable, noop } from '@/utils'
import type { Collection } from '@/composables/collection'

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

  showDropdown: () => void
  hideDropdown: () => void
}

export interface UseComboboxOptions {
  onSelect?: (value?: string) => void
  onShowDropdown?: () => void
  onHideDropdown?: () => void

  loop?: MaybeRefOrGetter<boolean>
  hideDelay?: MaybeRefOrGetter<number>
  showDelay?: MaybeRefOrGetter<number>
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
    hideDelay = 0,
    showDelay = 0,
    onSelect,
    onHideDropdown,
    onShowDropdown,
  } = options

  const listboxID = useID()
  const triggerID = useID()
  const listboxEl: TemplateRef = ref(null)
  const triggerEl: TemplateRef<HTMLInputElement> = ref(null)

  const isDropdownVisible = ref(false)

  const delayed = useDelayedOpen(
    () => {
      if (isDropdownVisible.value) return
      isDropdownVisible.value = true
      onShowDropdown?.()
    },
    () => {
      if (!isDropdownVisible.value) return
      isDropdownVisible.value = false
      onHideDropdown?.()
    },
    {
      defaultShowDelay: showDelay,
      defaultHideDelay: hideDelay,
    }
  )

  const group = useSelectionGroup(ref<string[]>([]), { deselection, multiselect })
  const collection = useCollection(listboxID)

  const select = (value: string): void => {
    const inputEl = triggerEl.value
    if (!inputEl) return

    inputEl.value = value
    group.select(value)
    onSelect?.(value)
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
    ...group,
    select,
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

    showDropdown: delayed.show,
    hideDropdown: delayed.hide,
    isDropdownVisible: readonly(isDropdownVisible),
  })

  return {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,

    group: _group,
    collection,

    showDropdown: delayed.show,
    hideDropdown: delayed.hide,
    isDropdownVisible: readonly(isDropdownVisible),
  }
}

export function useComboboxContext(component: string) {
  return useContext(COMBOBOX_INJECTION_KEY, 'Combobox', component)
}
