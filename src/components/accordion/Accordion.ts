import {
  useContext,
  useControllableState,
  useID,
  useSelectionGroup,
  type SelectionGroup,
} from '@vex-ui/composables'
import type { Getter } from '@/types'
import { computedEager } from '@vueuse/core'
import type { InjectionKey, PropType, Ref, SlotsType } from 'vue'
import { defineComponent, h, provide } from 'vue'

type Value = string

const ACCORDION_INJECTION_KEY = Symbol() as InjectionKey<{
  group: SelectionGroup<Value>
}>

function useAccordionCtx(component: string) {
  return useContext(ACCORDION_INJECTION_KEY, 'Accordion', component)
}

const ACCORDION_ITEM_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  disabled: Getter<boolean>
  isExpanded: Ref<boolean>
  toggleExpansion: () => void
}>

function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_INJECTION_KEY, 'AccordionItem', component)
}

//----------------------------------------------------------------------------------------------------
// 📌 accordion
//----------------------------------------------------------------------------------------------------

const Accordion = defineComponent({
  setup(p, { slots }) {
    const group = useSelectionGroup<Value>(
      useControllableState(() => p.modelValue ?? []),
      {
        multiselect: () => p.multiple,
        deselection: () => true,
      }
    )

    provide(ACCORDION_INJECTION_KEY, { group })
    return () => h('div', null, slots.default?.())
  },

  name: 'Accordion',
  props: {
    multiple: Boolean,
    modelValue: Array as PropType<Value[]>,
  },
  emits: ['update:modelValue'],
})

//----------------------------------------------------------------------------------------------------
// 📌 Accordion Item
//----------------------------------------------------------------------------------------------------

const AccordionItem = defineComponent({
  setup(p, { slots }) {
    const { group } = useAccordionCtx('AccordionItem')

    const contentID = useID()
    const triggerID = useID()
    const value = p.value ?? triggerID

    if (p.initiallyExpanded) {
      group.select(value)
    }
    const isExpanded = computedEager(() => (p.alwaysExpanded ? true : group.isSelected(value)))

    provide(ACCORDION_ITEM_INJECTION_KEY, {
      contentID,
      triggerID,
      isExpanded,
      disabled: () => p.disabled!,
      toggleExpansion: () => group.select(value),
    })

    return () =>
      h(
        'div',
        {
          'data-vex-state': [
            isExpanded.value ? 'expanded' : 'collapsed',
            p.disabled ? 'disabled' : 'enabled',
          ].join(' '),
        },
        slots.default?.({ expanded: isExpanded.value })
      )
  },

  name: 'AccordionItem',
  props: {
    /**
     * expands the item and prevents it from being collapsed
     */
    alwaysExpanded: Boolean,
    /**
     * expands the item on the first render
     */
    initiallyExpanded: Boolean,
    /**
     * prevents the item from being collapsed/expanded
     */
    disabled: Boolean,
    /**
     * used for controlled state
     */
    value: String,
  },
  slots: Object as SlotsType<{
    default: { expanded: boolean }
  }>,
})

//----------------------------------------------------------------------------------------------------
// 📌 AccordionTrigger
//----------------------------------------------------------------------------------------------------

const AccordionTrigger = defineComponent({
  setup(_, { slots }) {
    const { toggleExpansion, contentID, isExpanded, triggerID, disabled } =
      useAccordionItemCtx('AccordionTrigger')

    return () =>
      h(
        'button',
        {
          id: triggerID,
          type: 'button',
          disabled: disabled(),
          onClick: toggleExpansion,
          'aria-controls': contentID,
          'aria-expanded': isExpanded.value,
        },
        slots.default?.()
      )
  },

  name: 'AccordionTrigger',
})

//----------------------------------------------------------------------------------------------------
// 📌 AccordionContent
//----------------------------------------------------------------------------------------------------

const AccordionContent = defineComponent({
  setup(_, { slots }) {
    const { contentID, triggerID } = useAccordionItemCtx('AccordionContent')

    return () =>
      h(
        'div',
        {
          id: contentID,
          role: 'region',
          'aria-labelledby': triggerID,
        },
        slots.default?.()
      )
  },

  name: 'AccordionContent',
})

//----------------------------------------------------------------------------------------------------

// TODO: should we export these?
type Accordion = InstanceType<typeof Accordion>
type AccordionItem = InstanceType<typeof AccordionItem>
type AccordionTrigger = InstanceType<typeof AccordionTrigger>
type AccordionContent = InstanceType<typeof AccordionContent>

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
