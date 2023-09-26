import {
  isUsingKeyboard,
  useClickOutside,
  useEscapeKey,
  useFloating,
  useRovingFocus,
} from '@/composables'
import type { TemplateRef } from '@/types'
import type { Middleware, Padding, Placement, Strategy } from '@floating-ui/dom'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useComboboxContext } from './ComboboxContext'

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxTrigger
//----------------------------------------------------------------------------------------------------

export const ComboboxTrigger = defineComponent(
  (p) => {
    const { listboxID, listboxEl, isDropdownVisible, triggerID, triggerEl, showDropdown } =
      useComboboxContext('ComboboxTrigger')

    return () =>
      h('input', {
        type: 'text',
        ref: triggerEl,
        autocomplete: 'off',
        id: triggerID,
        role: 'combobox',
        'aria-controls': listboxID,
        'aria-expanded': isDropdownVisible.value,
        'aria-autocomplete': p.ariaAutocomplete,
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            showDropdown()
            nextTick(() => listboxEl.value?.focus())
          }
        },
      })
  },
  { name: 'ComboboxTrigger' }
)

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxDropdown
//----------------------------------------------------------------------------------------------------

export interface ComboboxDropdownProps {
  /**
   * Where to place the floating element relative to its reference element.
   * @default 'bottom-start'
   */
  placement?: Placement

  /**
   * The type of CSS positioning to use.
   * @default 'absolute'
   */
  strategy?: Strategy

  /**
   * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
   *  DO NOT USE SIZE MIDDLEWARE HERE*, use the autoMinWidth option.
   */
  middleware?: Middleware[]

  /**
   * Whether to auto set the floatingEl min-width to the width of the referenceEl
   */
  autoMinWidth?: boolean

  /**
   * The distance between the referenceEl and the floatingEl
   */
  offset?: number

  /**
   * The distance between the viewport and the floatingEl
   */
  padding?: Padding
}

export const ComboboxDropdown = defineComponent<ComboboxDropdownProps>(
  (p, { slots }) => {
    const { listboxEl, triggerEl, hideDropdown, isDropdownVisible } =
      useComboboxContext('ComboboxDropdown')

    const dropdownEl: TemplateRef = ref(null)

    useClickOutside(
      listboxEl,
      () => {
        hideDropdown('mouse')
      },
      { ignore: [triggerEl] }
    )

    useEscapeKey(() => {
      hideDropdown('keyboard')
      triggerEl.value?.focus({ preventScroll: true })
    })

    const { floatingStyles } = useFloating(triggerEl, dropdownEl, isDropdownVisible, {
      offset: p.offset,
      padding: p.padding,
      strategy: () => p.strategy,
      placement: () => p.placement,
      middleware: p.middleware,
      autoMinWidth: () => p.autoMinWidth ?? true,
    })

    return () =>
      h(
        'div',
        {
          ref: dropdownEl,
          style: { ...floatingStyles.value, 'min-width': 'var(--vex-auto-min-width)' },
        },
        slots.default?.()
      )
  },
  {
    name: 'ComboboxDropdown',
    props: ['placement', 'autoMinWidth', 'middleware', 'offset', 'padding', 'strategy', 'offset'],
  }
)

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxListbox
//----------------------------------------------------------------------------------------------------

export interface ComboboxListboxProps {
  ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both'
}

export const ComboboxListbox = defineComponent<ComboboxListboxProps>(
  (p, { slots }) => {
    const { listboxID, triggerID, listboxEl, select, getOptions } =
      useComboboxContext('ComboboxListbox')

    useRovingFocus(listboxEl, getOptions)

    return () =>
      h(
        'div',
        {
          id: listboxID,
          role: 'listbox',
          ref: listboxEl,
          tabindex: '-1',
          'aria-labelledby': triggerID,
          'aria-autocomplete': p.ariaAutocomplete,
          onClick: (e: MouseEvent) => {
            const option = (e.target as HTMLElement).closest<HTMLElement>('[role=option]')
            const isSelected = option?.getAttribute('aria-selected') === 'true'
            const value = option?.dataset.vexValue
            if (!isSelected && value) {
              select(value)
            }
          },
        },
        slots.default?.()
      )
  },
  { name: 'ComboboxListbox', props: ['ariaAutocomplete'] }
)

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxOption
//----------------------------------------------------------------------------------------------------

export interface ComboboxOptionProps {
  value: string
}

export const ComboboxOption = defineComponent<ComboboxOptionProps>(
  (p, { slots }) => {
    return () =>
      h(
        'div',
        {
          role: 'option',
          'aria-selected': false,
          'data-vex-value': p.value,
          tabindex: '-1',
        },
        slots.default?.()
      )
  },
  { name: 'ComboboxOption', props: ['value'] }
)
