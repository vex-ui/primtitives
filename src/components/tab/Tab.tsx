import { useResizeObserver } from '@vueuse/core'
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  watch,
  provide,
  type Ref,
  type SlotsType,
  type PropType,
} from 'vue'
import type { InjectionKey } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 Taps
//----------------------------------------------------------------------------------------------------

export interface TabContext {
  activeTab: Ref<string | undefined>
}

const TAB_INJECTION_KEY = Symbol() as InjectionKey<TabContext>

const Tabs = defineComponent({
  props: {
    variant: { type: String as PropType<'underline' | 'switch'>, default: 'switch' },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'horizontal' },
    modelValue: String,
  },

  emits: ['update:modelValue'],

  setup(p, { slots, emit }) {
    const activeTab = computed<typeof p.modelValue>({
      get: () => p.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    provide(TAB_INJECTION_KEY, {
      activeTab,
    })

    const PointerEl = ref<HTMLElement | null>(null)
    const TabsEl = ref<HTMLElement | null>(null)
    const ActiveTabEl = ref<HTMLElement | null>(null)

    function movePointer() {
      ActiveTabEl.value =
        TabsEl.value?.querySelector<HTMLElement>('.vex-tabs-trigger.--active') ?? null

      if (!ActiveTabEl.value) {
        PointerEl.value!.style.scale = '0'
        return
      }

      const { width, height } = ActiveTabEl.value.getBoundingClientRect()
      PointerEl.value!.style.translate = `${ActiveTabEl.value.offsetLeft}px ${ActiveTabEl.value.offsetTop}px`

      if (p.orientation === 'horizontal') {
        PointerEl.value!.style.scale = `${(width * 10) / 100} 1`
      } else {
        PointerEl.value!.style.scale = `1 ${(height * 10) / 100}`
      }
    }

    useResizeObserver(ActiveTabEl, movePointer)
    onMounted(() => {
      watch(() => activeTab.value, movePointer, { flush: 'post', immediate: true })
    })

    return () => (
      <div
        ref={TabsEl}
        class={['vex-tabs', `--variant-${p.variant}`, `--orientation-${p.orientation}`]}
      >
        {slots.default?.()}
        <div ref={PointerEl} class="vex-tabs-pointer" />
      </div>
    )
  },
})

//----------------------------------------------------------------------------------------------------
// 📌 Trigger
//----------------------------------------------------------------------------------------------------

const TabTrigger = defineComponent({
  props: {
    value: String,
  },
  setup(p, { slots }) {
    const context = inject(TAB_INJECTION_KEY)

    return () => (
      <div
        class={['vex-tabs-trigger', { '--active': p.value === context?.activeTab.value }]}
        onClick={() => (context!.activeTab.value = p.value)}
      >
        {slots.default?.()}
      </div>
    )
  },
})

//----------------------------------------------------------------------------------------------------

export { Tabs, TabTrigger }
