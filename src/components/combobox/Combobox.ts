import {
  useClickOutside,
  useEscapeKey,
  useEventListener,
  useFloating,
  useRovingFocus,
} from '@/composables'
import type { TemplateRef } from '@/types'
import type { Middleware, Padding, Placement, Strategy } from '@floating-ui/dom'
import { defineComponent, h, nextTick, onUnmounted, ref } from 'vue'
import { useComboboxContext } from './ComboboxContext'

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxTrigger
//----------------------------------------------------------------------------------------------------

export interface ComboboxTriggerProps {
  ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both'
}

export const ComboboxTrigger = defineComponent<ComboboxTriggerProps>(
  (p) => {
    const { listboxID, listboxEl, isDropdownVisible, triggerID, triggerEl, showDropdown } =
      useComboboxContext('ComboboxTrigger')

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        showDropdown()
        nextTick(() => listboxEl.value?.focus())
      }
    }

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
        onKeydown,
      })
  },
  {
    name: 'ComboboxTrigger',
    props: ['ariaAutocomplete'],
  }
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
        hideDropdown()
      },
      { ignore: [triggerEl] }
    )

    useEscapeKey(() => {
      hideDropdown()
      triggerEl.value?.focus({ preventScroll: true })
    })

    const { floatingStyles } = useFloating(triggerEl, dropdownEl, isDropdownVisible, {
      offset: p.offset,
      padding: p.padding,
      strategy: () => p.strategy,
      placement: () => p.placement,
      middleware: p.middleware,
      autoMinWidth: () => p.autoMinWidth,
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
  /**
   * The orientation of the listbox, used internally for keyboard navigation.
   * @defaultValue 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   *  Whether to focus the ComboboxTrigger when the user types something.
   */
  focusTriggerOnType?: boolean
}

export const ComboboxListbox = defineComponent<ComboboxListboxProps>(
  (p, { slots }) => {
    const { listboxID, triggerEl, triggerID, listboxEl } = useComboboxContext('ComboboxListbox')

    useRovingFocus(
      listboxEl,
      // unfortunately we can't use collection.elements here because components inside v-for
      // are not always registered in the same order as their dom order
      () => Array.from(listboxEl.value?.querySelectorAll<HTMLElement>('[role=option]') ?? []),
      {
        orientation: () => p.orientation ?? 'vertical',
      }
    )

    // when a user presses a printable key (i.e [a-z]) move focus back
    // to the input field.
    const onKeydown = (e: KeyboardEvent) => {
      if (!p.focusTriggerOnType) return

      const withModifierKey = e.metaKey || e.ctrlKey || e.altKey
      const isPrintableKey = e.key.length === 1 && !withModifierKey
      const input = triggerEl.value

      if ((isPrintableKey || e.key === 'Backspace') && input) {
        e.preventDefault()
        if (isPrintableKey) {
          input.value += e.key
        } else if (e.key === 'Backspace') {
          input.value = input.value.slice(0, -1)
        }

        input.focus()
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const activeEl = e.target as HTMLElement | null
        const isOptionEl = activeEl?.getAttribute('role') === 'option'
        if (isOptionEl) activeEl.click()
        return
      }
    }

    return () =>
      h(
        'div',
        {
          id: listboxID,
          role: 'listbox',
          ref: listboxEl,
          tabindex: '-1',
          'aria-labelledby': triggerID,
          onKeydown,
        },
        slots.default?.()
      )
  },
  { name: 'ComboboxListbox', props: ['orientation', 'focusTriggerOnType'] }
)

//----------------------------------------------------------------------------------------------------
// 📌 ComboboxOption
//----------------------------------------------------------------------------------------------------

export interface ComboboxOptionProps {
  value: string
  disabled?: boolean
}

export const ComboboxOption = defineComponent<ComboboxOptionProps>(
  (p, { slots }) => {
    const optionEl: TemplateRef = ref(null)
    const { collection, group } = useComboboxContext('ComboboxOption')

    const item = collection.add(optionEl, () => !!p.disabled)
    onUnmounted(() => collection.remove(optionEl))

    return () =>
      h(
        'div',
        {
          id: item.id,
          ref: optionEl,
          role: 'option',
          'aria-disabled': !!item.disabled?.(),
          'aria-selected': group.isSelected(p.value),
          'data-vex-value': p.value,
          tabindex: item.disabled?.() ? undefined : '-1',
        },
        slots.default?.()
      )
  },
  {
    name: 'ComboboxOption',
    props: {
      disabled: Boolean,
      value: String,
    },
  }
)
