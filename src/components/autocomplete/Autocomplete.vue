<script lang="ts">
interface Option {
  label: string
  value: string
}

export interface AutocompleteProps {
  /**
   * display a smaller field
   */
  compact?: boolean

  /**
   * specifies the selected option/s
   */
  modelValue?: Option

  /**
   * specifies the list of all the available options, this will only be used with client mode,
   * when using server mode use the `getOptions` prop instead.
   */
  options?: Option[]

  /**
   * whether the field is disabled
   */
  disabled?: boolean

  /**
   * specifies a custom filtering function.
   *
   * @param query the search query.
   * @param max maximum displayed options count.
   */
  filter?: (query: string, max: number) => Option[]

  /**
   * used for custom search logic or server mode.
   */
  getOptions?: (query: string, limit: number) => Promise<Option[]>

  /**
   * use this prop to cleanup pending async work.
   * - if specified, the function will be called before
   * every call to `getOptions` except the first.
   */
  getOptionsCleanup?: () => void

  /**
   * maximum number of options to display.
   * @default 10
   */
  maxDisplayedOptions?: number

  /**
   * the search debounce time in milliseconds.
   * @default 300
   */
  debounce?: number

  /**
   * whether to allow multiselect
   */
  multiselect?: boolean
}
</script>

<script setup lang="ts">
import { Input } from '@/components'
import {
  useCollection,
  useSelectionGroup,
  useEscapeKey,
  useFloating,
  useID,
  useRovingFocus,
  useVModel,
} from '@vex-ui/composables'
import { isArray } from '@vex-ui/composables'
import { useInputSearch } from '@vex-ui/composables'
import { IconChevronUpDown } from '@/icons'
import type { TemplateRef } from '@/types'
import { controlledRef, onClickOutside, useEventListener } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(defineProps<AutocompleteProps>(), {
  options: () => [],
  debounce: 300,
  maxDisplayedOptions: 10,
})

const emit = defineEmits<{
  'update:modelValue': [value?: Option]
}>()

//----------------------------------------------------------------------------------------------------

const TriggerEl: TemplateRef = ref(null)
const ContentEl: TemplateRef = ref(null)
const getFormEl = () => (TriggerEl.value as HTMLInputElement)?.form

const triggerID = useID()
const contentID = useID()

const isContentOpen = ref(false)

const modelValue = useVModel(() => p.modelValue?.value, {
  setter: (newValue) => (newValue ? { label: getLabel(newValue)!, value: newValue } : undefined),
})

const { selected, clearSelected } = useSelectionGroup(modelValue, {
  deselection: () => true,
  multiselect: () => p.multiselect,
})

const { elements: OptionsElements } = useCollection(triggerID)

//----------------------------------------------------------------------------------------------------
// 📌 keyboard interactions & visibility
//----------------------------------------------------------------------------------------------------

useRovingFocus(ContentEl, OptionsElements, {
  orientation: () => 'vertical',
})

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    isContentOpen.value = true
    nextTick(() => ContentEl.value?.focus())
  }
}

function onContentKeydown(e: KeyboardEvent) {
  if ([' ', 'Enter'].includes(e.key)) {
    e.preventDefault()
    ;(e.target as HTMLElement).click()
  }
}

useEscapeKey((e) => {
  if (!isContentOpen.value) return

  e.preventDefault()
  isContentOpen.value = false
  TriggerEl.value?.focus()
})

onClickOutside(
  ContentEl,
  () => {
    isContentOpen.value &&= false
  },
  { ignore: [TriggerEl] }
)

function onTriggerClick() {
  isContentOpen.value = true
}

//----------------------------------------------------------------------------------------------------
// 📌 search
//----------------------------------------------------------------------------------------------------

const inputValue = controlledRef(p.modelValue?.label)

const { result, isSearching } = useInputSearch(inputValue, p.getOptions ?? p.options, {
  debounce: () => p.debounce,
  onAfterSearch: () => (isContentOpen.value ||= true),
  maxDisplayedSuggestions: () => p.maxDisplayedOptions,
})

// if focus is moved from the input make sure to set input value to the last "correct" selectable value.
// we use `.lay` to avoid triggering filter watcher
function onTriggerBlur(selected: string | string[] | undefined) {
  if (!selected) return
  inputValue.lay(isArray(selected) ? selected.map(getLabel).join(', ') : getLabel(selected))
}

watch(selected, (selected) => {
  inputValue.lay(isArray(selected) ? selected.map(getLabel).join(', ') : getLabel(selected))
})

//----------------------------------------------------------------------------------------------------

useEventListener(getFormEl, 'reset', () => clearSelected())

function getLabel(value?: string): string | undefined {
  if (value === undefined) return undefined
  return p.options.find((option) => option.value === value)?.label
}

const { floatingStyles } = useFloating(TriggerEl, ContentEl, isContentOpen, {
  placement: 'bottom-start',
  offset: 4,
  autoMinWidth: true,
})
</script>

<template>
  <Input
    v-model="inputValue"
    v-bind="$attrs"
    @blur="onTriggerBlur(selected)"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
    :ref="(vm )=> TriggerEl = (vm as InstanceType<typeof Input>)?.InputEl"
    :aria-expanded="isContentOpen"
    :aria-controls="contentID"
    :id="triggerID"
    :compact="p.compact"
    aria-haspopup="listbox"
    aria-autocomplete="list"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template #suffix>
      <IconChevronUpDown class="vex-autocomplete-chevron" />
    </template>
  </Input>

  <!-- listbox -->

  <Teleport to="body">
    <ul
      v-if="isContentOpen"
      :style="floatingStyles()"
      :aria-describedby="triggerID"
      :id="contentID"
      :loading="isSearching"
      @keydown="onContentKeydown"
      ref="ContentEl"
      tabindex="-1"
      class="vex-autocomplete-content"
    >
      <div v-if="!result.length" class="vex-autocomplete-placeholder">
        <span>no data</span>
      </div>

      <slot v-else :options="result"></slot>
    </ul>
  </Teleport>
</template>
