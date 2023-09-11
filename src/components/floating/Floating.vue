<script setup lang="ts">
import {
  useFloating,
  size,
  shift,
  flip,
  autoUpdate,
  offset,
  type Placement,
  arrow,
} from '@floating-ui/vue'
import { onClickOutside, useEventListener, useVModel } from '@vueuse/core'
import { computed, ref, toRef, type StyleValue, onUnmounted } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * the floating element will be positioned relative to this element
     */
    reference?: HTMLElement | null

    /**
     * whether the component is visible or not
     */
    visible?: boolean

    /**
     * the space between the reference element and the floating element in `px` css unit.
     * @default 0
     */
    offset?: number

    /**
     * the `Transition` component `name` prop
     */
    transition?: string

    /**
     * the floating element placement relative to the reference element
     * @default 'bottom-start'
     */
    placement?: Placement

    /**
     * whether to trigger visibility on hover or on click
     * @default 'click'
     */
    trigger?: 'click' | 'hover'

    /**
     * sets the floating element min-width to the width of the reference element,
     * @default true
     */
    autoMinWidth?: boolean

    /**
     * whether to render the arrow
     */
    arrow?: boolean

    /**
     * specifies the distance between the edge of arrow and the edge of floating element,
     * positive values will add more distance and shows more of the arrow.
     * @default 0
     */
    arrowPadding?: number

    /**
     * specifies the floating element html tag
     * @default 'div'
     */
    tag?: string

    /**
     * whether to hide the floatingEl when its clicked
     */
    hideOnClick?: boolean
  }>(),
  {
    trigger: 'click',
    placement: 'bottom-start',
    offset: 0,
    autoMinWidth: true,
    tag: 'div',
    arrowPadding: 0,
  }
)

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
}>()

const referenceEl = toRef(p, 'reference')
const floatingEl = ref<HTMLElement>()
const arrowEl = ref<HTMLElement>()
const isFloatingElVisible = useVModel(p, 'visible', emit, {
  eventName: 'update:visible',
})

//----------------------------------------------------------------------------------------------------
// 📌 trigger
//----------------------------------------------------------------------------------------------------

if (p.trigger === 'click') {
  useEventListener(referenceEl, 'click', () => {
    isFloatingElVisible.value = !isFloatingElVisible.value
  })

  onClickOutside(
    floatingEl,
    () => {
      isFloatingElVisible.value = false
    },
    { ignore: [referenceEl] }
  )
}

if (p.trigger === 'hover') {
  let timeoutId: ReturnType<typeof setTimeout>

  // reference element events
  useEventListener(referenceEl, 'mouseenter', () => {
    clearTimeout(timeoutId)
    if (!isFloatingElVisible.value) isFloatingElVisible.value = true
  })
  useEventListener(referenceEl, 'mouseleave', () => {
    timeoutId = _setInvisible()
  })

  // floating element events
  useEventListener(floatingEl, 'mouseenter', () => {
    clearTimeout(timeoutId)
  })
  useEventListener(floatingEl, 'mouseleave', () => {
    timeoutId = _setInvisible()
  })

  // we debounce to avoid toggling isFloatingElVisible (v-show)
  // when hover is moved from referenceEl to floatingEl
  // which will fire Transition hooks and animations
  function _setInvisible() {
    return setTimeout(() => {
      if (isFloatingElVisible.value) isFloatingElVisible.value = false
    }, 25)
  }

  onUnmounted(() => {
    clearTimeout(timeoutId)
  })
}

useEventListener(floatingEl, 'click', () => {
  if (p.hideOnClick) {
    isFloatingElVisible.value = false
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 middleware
//----------------------------------------------------------------------------------------------------

const middleware = computed(() => {
  const mw = [offset(p.offset), flip(), shift({ padding: 8 })]

  if (p.autoMinWidth) {
    mw.unshift(
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${Math.round(rects.reference.width)}px`
        },
      })
    )
  }

  if (p.arrow) {
    mw.push(arrow({ element: arrowEl, padding: p.arrowPadding }))
  }

  return mw
})

//----------------------------------------------------------------------------------------------------
// 📌 floating-ui
//----------------------------------------------------------------------------------------------------

const {
  strategy,
  x,
  y,
  middlewareData,
  placement: floatingPlacement,
} = useFloating(referenceEl, floatingEl, {
  placement: p.placement,
  whileElementsMounted: autoUpdate,
  middleware,
  open: isFloatingElVisible,
})

//----------------------------------------------------------------------------------------------------
// 📌 arrow
//----------------------------------------------------------------------------------------------------

const arrowX = computed(() => middlewareData.value.arrow?.x ?? null)
const arrowY = computed(() => middlewareData.value.arrow?.y ?? null)

const arrowStyles = computed<StyleValue>(() => {
  const side = floatingPlacement.value.split('-')[0]
  const staticSide =
    {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side] ?? 'bottom'

  return {
    position: 'absolute',
    left: arrowX.value != null ? `${arrowX.value}px` : '',
    top: arrowY.value != null ? `${arrowY.value}px` : '',
    [staticSide]: `-2px`,
  }
})

defineExpose({
  floatingEl,
})
</script>

<template>
  <Transition :name="p.transition">
    <component
      ref="floatingEl"
      :is="p.tag"
      v-bind="$attrs"
      v-show.lazy="visible"
      class="vex-floating"
      :style="{
        top: `${y ?? 0}px`,
        left: `${x ?? 0}px`,
        position: strategy,
      }"
    >
      <div v-if="p.arrow" ref="arrowEl" class="vex-floating-arrow" :style="arrowStyles" />
      <slot></slot>
    </component>
  </Transition>
</template>
