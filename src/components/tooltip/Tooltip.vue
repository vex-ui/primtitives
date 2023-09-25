<script setup lang="ts">
import { arrowMiddleware, useArrow, useFloating, useID } from '@/composables'
import { EXPOSED_EL } from '@/config'
import type { Placement, Strategy } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import type { ComponentPublicInstance, VNode, VNodeTypes } from 'vue'
import { Fragment, cloneVNode, computed, ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 Component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the tooltip's background color.
     * @defaultValue 'neutral'
     */
    color?: 'danger' | 'warning' | 'success' | 'primary' | 'accent' | 'neutral'

    /**
     * specifies the tooltip's variant.
     * @defaultValue 'filled'
     */
    variant?: 'filled' | 'light'

    /**
     * whether to hide the arrow.
     */
    hideArrow?: boolean

    /**
     * adds a delay before the tooltip opens.
     * @defaultValue 200
     */
    openDelay?: number

    /**
     * whether to make the min-width of the tooltip the same as the trigger width.
     */
    autoMinWidth?: boolean

    /**
     * tooltip's placement direction.
     * @defaultValue 'top'
     */
    placement?: Placement

    /**
     * tooltip's display strategy.
     * @defaultValue 'absolute'
     */
    strategy?: Strategy
  }>(),
  {
    openDelay: 0,
    placement: 'top',
    strategy: 'absolute',
    color: 'neutral',
    variant: 'filled',
  }
)

const slots = defineSlots<{
  default?: (props: {}) => any
  trigger?: (props: {}) => VNode[]
}>()

//----------------------------------------------------------------------------------------------------

const TOOLTIP_ID = useID()
const TooltipEl = ref<HTMLElement | null>(null)
const TriggerEl = ref<HTMLElement | null>(null)
const ArrowEl = ref<HTMLElement | null>(null)

//----------------------------------------------------------------------------------------------------
// 📌 Trigger
//----------------------------------------------------------------------------------------------------

const INVALID_VNODE_TYPES: VNodeTypes[] = [Fragment, Comment, Text, 'template']

const TriggerVNode = (): VNode => {
  const vNodes = slots.trigger?.({})
  if (!vNodes || vNodes?.length !== 1 || INVALID_VNODE_TYPES.includes(vNodes[0].type)) {
    throw new Error(
      '[vex] <Tooltip> trigger slot requires exactly a single root child at all times'
    )
  }
  return cloneVNode(
    vNodes[0],
    {
      ref: (vm) => (TriggerEl.value = getElementFromRef(vm)),
      'aria-describedby': TOOLTIP_ID,
    },
    true
  )
}

function getElementFromRef(vm: ComponentPublicInstance | Element | null): HTMLElement | null {
  if (vm == null) return null
  if (vm instanceof Element) return vm as HTMLElement
  if (vm.$el instanceof Element) return vm.$el as HTMLElement

  throw new Error(`[vex] <Tooltip> trigger slot received a non Element root child`)
}

//----------------------------------------------------------------------------------------------------
// 📌 Floating
//----------------------------------------------------------------------------------------------------

const isTooltipVisible = ref(false)

const { floatingStyles, middlewareData, placement } = useFloating(
  TriggerEl,
  TooltipEl,
  isTooltipVisible,
  {
    autoMinWidth: () => p.autoMinWidth,
    placement: () => p.placement,
    middleware: [arrowMiddleware(ArrowEl)],
    offset: 8,
  }
)

const arrowStyles = useArrow(middlewareData, placement)

//----------------------------------------------------------------------------------------------------
// 📌 visibility
//----------------------------------------------------------------------------------------------------

let openTimeoutId: ReturnType<typeof setTimeout> = -1

function open() {
  clearTimeout(openTimeoutId)

  if (p.openDelay <= 0) {
    isTooltipVisible.value = true
    return
  }

  openTimeoutId = setTimeout(() => {
    isTooltipVisible.value = true
  }, p.openDelay)
}

function close() {
  clearTimeout(openTimeoutId)
  isTooltipVisible.value = false
}

useEventListener(TriggerEl, 'pointerenter', open)
useEventListener(TriggerEl, 'pointerleave', close)

useEventListener(TriggerEl, 'focus', open)
useEventListener(TriggerEl, 'blur', close)

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => ['vex-tooltip', `--c-${p.color}`, `--variant-${p.variant}`])

defineExpose({
  open,
  close,
  [EXPOSED_EL]: TriggerEl,
})
</script>

<template>
  <Component :is="TriggerVNode" />

  <Teleport to="body">
    <Transition name="vex-fade">
      <div
        v-show.lazy="isTooltipVisible"
        v-bind="$attrs"
        :style="floatingStyles"
        :class="modifierClasses"
        :id="TOOLTIP_ID"
        ref="TooltipEl"
        role="tooltip"
      >
        <div class="vex-tooltip-content">
          <slot />
        </div>
        <div :style="arrowStyles" ref="ArrowEl" class="vex-tooltip-arrow" />
      </div>
    </Transition>
  </Teleport>
</template>
