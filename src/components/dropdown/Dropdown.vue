<script lang="ts" setup>
import { useDelayedOpen, useFloating, useID, useInjectRef } from '@/composables'
import { EXPOSED_EL } from '@/config'
import type { Placement, Strategy } from '@floating-ui/vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import type { VNode } from 'vue'
import { computed, nextTick, ref, toRef, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * The dropdown aria role.
     * @default 'menu'
     */
    role?: 'menu' | 'listbox'

    /**
     * Whether to disable visibility.
     */
    disabled?: boolean

    /**
     * Sets the min-width of the Dropdown to the width of the Trigger element.
     */
    autoMinWidth?: boolean

    /**
     * Controls the dropdown's placement direction.
     * @defaultValue 'bottom-start'
     */
    placement?: Placement

    /**
     * Controls the dropdown's display strategy.
     */
    strategy?: Strategy

    /**
     * The distance between the dropdown and the trigger.
     * @defaultValue 4
     */
    offset?: number

    /**
     * The time before the dropdown opens/closes
     * @defaultValue 150
     */

    openDelay?: number
    /**
     * The time before the dropdown opens/closes
     * @defaultValue 150
     */
    closeDelay?: number

    /**
     * Specifies the action that opens the dropdown.
     */
    triggerOn?: 'hover' | 'click'

    /**
     * the element to position the dropdown relative to
     */
    triggerEl?: HTMLElement | null

    triggerId?: string

    dropdownId?: string

    teleport?: boolean
  }>(),
  {
    placement: 'bottom-start',
    autoMinWidth: true,
    offset: 4,
    role: 'menu',
    openDelay: 150,
    closeDelay: 150,
    triggerOn: 'click',
    triggerEl: null,
  }
)

const slots = defineSlots<{
  default?: (props: {}) => any
  trigger?: (props: {}) => VNode[]
}>()

const emit = defineEmits<{
  open: [e: Event]
}>()

//----------------------------------------------------------------------------------------------------

const DROPDOWN_ID = p.dropdownId || useID()
const TRIGGER_ID = p.triggerId || useID()
const role = toRef(() => p.role)

const DropdownEl = ref<HTMLElement | null>(null)

const __isOpen = ref(false)
const isDropdownOpen = computed({
  get: () => __isOpen.value && !p.disabled,
  set: (val) => {
    if (val !== __isOpen.value) __isOpen.value = val
  },
})

//----------------------------------------------------------------------------------------------------
// 📌 Trigger
//----------------------------------------------------------------------------------------------------

const TriggerSlotEl = ref<HTMLElement | null>(null)
const TriggerEl = computed(() => (slots.trigger ? TriggerSlotEl.value : p.triggerEl))
const TriggerComponent = useInjectRef(TriggerSlotEl, () => slots.trigger?.({}), 'Dropdown')

watch(TriggerEl, (el) => {
  if (!el) return
  el.setAttribute('aria-expanded', `${isDropdownOpen.value}`)
  el.setAttribute('aria-haspopup', `${role.value}`)
  el.setAttribute('aria-controls', `${DROPDOWN_ID}`)
  el.setAttribute('id', `${TRIGGER_ID}`)
})

watch(
  [isDropdownOpen, role],
  ([open, role]) => {
    const el = TriggerEl.value
    if (!el) return
    el.setAttribute('aria-haspopup', `${role}`)
    el.setAttribute('aria-expanded', `${open}`)
  },
  { flush: 'post' }
)

//----------------------------------------------------------------------------------------------------
// 📌 open / close
//----------------------------------------------------------------------------------------------------

const { close: closeDropdown, open: openDropdown } = useDelayedOpen({
  open: () => (isDropdownOpen.value = true),
  close: () => (isDropdownOpen.value = false),
  defaultOpenDelay: () => p.openDelay,
  defaultCloseDelay: () => p.closeDelay,
})

useEventListener(TriggerEl, 'keydown', (e: KeyboardEvent) => {
  if (e.shiftKey || e.altKey || e.ctrlKey) return

  if (isOpenKey(e.key)) {
    e.preventDefault()
    isDropdownOpen.value || openDropdown()
    emit('open', e)
    e.stopImmediatePropagation()
    return
  }

  if (isCloseKey(e.key)) {
    e.preventDefault()
    isDropdownOpen.value && closeDropdown()
    nextTick(() => TriggerEl.value?.focus({ preventScroll: true }))
    return
  }
})

if (p.triggerOn === 'hover') {
  useEventListener(TriggerEl, 'pointerenter', () => openDropdown())
  useEventListener(TriggerEl, 'pointerleave', () => closeDropdown())

  useEventListener(DropdownEl, 'pointerenter', () => openDropdown())
  useEventListener(DropdownEl, 'pointerleave', () => closeDropdown())
}

if (p.triggerOn === 'click') {
  useEventListener(TriggerEl, 'pointerdown', () => openDropdown())
  onClickOutside(DropdownEl, () => closeDropdown(), { ignore: [TriggerEl] })
}

function isOpenKey(key: string) {
  return ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)
}

function isCloseKey(key: string) {
  return ['Escape'].includes(key)
}

//----------------------------------------------------------------------------------------------------

const { floatingStyles } = useFloating(TriggerEl, DropdownEl, isDropdownOpen, {
  autoMinWidth: () => p.autoMinWidth,
  placement: () => p.placement,
  strategy: () => p.strategy,
})

defineExpose({
  isDropdownOpen,
  DropdownEl,
  TriggerEl,
  [EXPOSED_EL]: TriggerEl,
})
</script>

<template>
  <Component v-if="slots.trigger" :is="TriggerComponent" />

  <Teleport to="body" :disabled="!p.teleport">
    <Transition name="vex-fade">
      <div
        ref="DropdownEl"
        v-bind="$attrs"
        v-show.lazy="isDropdownOpen"
        tabindex="-1"
        class="vex-dropdown"
        :id="DROPDOWN_ID"
        :aria-labelledby="TRIGGER_ID"
        :role="role"
        :style="floatingStyles"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
