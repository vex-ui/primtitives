import { isUsingKeyboard, useClickOutside, useContext, useID } from '@/composables'
import { defineComponent, h, ref, provide } from 'vue'
import type { SlotsType, InjectionKey, Ref } from 'vue'
import { useComboboxContext } from './ComboboxContext'

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxTrigger
//----------------------------------------------------------------------------------------------------

export const ComboboxTrigger = defineComponent((p) => {
  const { listboxID, isDropdownVisible, triggerID, triggerEl, showDropdown, hideDropdown } =
    useComboboxContext('ComboboxTrigger')

  const onFocus = (e: FocusEvent) => {
    showDropdown(isUsingKeyboard.value ? 'keyboard' : 'mouse')
  }

  return () =>
    h('input', {
      type: 'text',
      role: 'combobox',
      ref: triggerEl,
      autocomplete: 'off',
      id: triggerID,
      'aria-controls': listboxID,
      'aria-expanded': isDropdownVisible.value,
      'aria-autocomplete': p.ariaAutocomplete,
      onFocus,
    })
})

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxDropdown
//----------------------------------------------------------------------------------------------------

export interface ComboboxDropdownProps {
  ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both'
}

export const ComboboxDropdown = defineComponent<ComboboxDropdownProps>(
  (p, { slots }) => {
    const { listboxID, triggerID, listboxEl, triggerEl, hideDropdown, select } =
      useComboboxContext('ComboboxDropdown')

    useClickOutside(
      listboxEl,
      () => {
        hideDropdown('mouse')
      },
      { ignore: [triggerEl] }
    )

    const onClick = (e: MouseEvent) => {
      const option = (e.target as HTMLElement).closest<HTMLElement>('[role=option]') ?? null
      const isSelected = option?.getAttribute('aria-selected') === 'true'
      const value = option?.dataset.vexValue
      if (isSelected || !value) return

      select(value)
    }

    return () =>
      h(
        'div',
        {
          id: listboxID,
          role: 'listbox',
          ref: listboxEl,
          'aria-describedby': triggerID,
          'aria-autocomplete': p.ariaAutocomplete,
          onClick,
        },
        slots.default?.()
      )
  },
  { props: ['ariaAutocomplete'] }
)

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxOption
//----------------------------------------------------------------------------------------------------

export interface ComboboxOptionProps {
  value: string
}

export const ComboboxOption = defineComponent<ComboboxOptionProps>(
  (p, { slots }) => {
    const { select } = useComboboxContext('ComboboxOption')

    return () =>
      h(
        'div',
        {
          role: 'option',
          'aria-selected': false,
          'data-vex-value': p.value,
        },
        slots.default?.()
      )
  },
  { props: ['value'] }
)
