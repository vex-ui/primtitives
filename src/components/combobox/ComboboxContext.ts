import {
  useCollection,
  useContext,
  useDelayedOpen,
  useEventListener,
  useID,
  useSelectionGroup,
  type SelectionGroup,
} from '@/composables'
import type { Collection } from '@/composables/collection'
import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import { provide, readonly, ref, toValue, type InjectionKey, type Ref } from 'vue'

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
  multiselect?: MaybeRefOrGetter<boolean>
  deselection?: MaybeRefOrGetter<boolean>
  scrollBehavior?: MaybeRefOrGetter<ScrollBehavior>
}

interface UseComboboxReturn {
  listboxID: string
  triggerID: string
  listboxEl: TemplateRef
  triggerEl: TemplateRef<HTMLInputElement>
  group: SelectionGroup<string>
  collection: Collection<HTMLElement>
  showDropdown: (delay?: number | undefined) => void
  hideDropdown: (delay?: number | undefined) => void
  isDropdownVisible: Readonly<Ref<boolean>>
}

// ----------------------------------------------------------------------------------------------------

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<ComboboxContext>

export function useCombobox(options: UseComboboxOptions = {}): UseComboboxReturn {
  const {
    loop = true,
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
