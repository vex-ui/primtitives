<script setup lang="ts">
import { IconDangerSign, IconWarn, IconCheckCircle, IconBell, IconXMark } from '@/icons'
import { useID } from '@/composables'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the alert header text
     */
    header?: string

    /**
     * specifies the alert color
     */
    color?: 'success' | 'warning' | 'danger' | 'accent' | 'primary'

    /**
     * whether to show the close button
     */
    dismissible?: boolean
  }>(),
  {
    color: 'primary',
  }
)

const emit = defineEmits<{
  (event: 'dismiss'): void
}>()

const slots = defineSlots<{
  default?: (props: {}) => any
  header?: (props: {}) => any
  icon?: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const headerID = useID()
const contentID = useID()

const icons = {
  danger: IconDangerSign,
  success: IconCheckCircle,
  accent: IconBell,
  primary: IconBell,
  warning: IconWarn,
}
</script>

<template>
  <div
    role="alert"
    :class="['vex-alert', `--c-${p.color}`]"
    :aria-labelledby="headerID"
    :aria-describedby="contentID"
  >
    <!-- icon -->

    <span class="vex-alert-icon">
      <slot name="icon">
        <Component :is="icons[p.color]" width="20" height="20" />
      </slot>
    </span>

    <!-- header -->

    <div v-if="p.header || slots.header" :id="headerID" class="vex-alert-header">
      <slot name="header">
        {{ p.header }}
      </slot>
    </div>

    <!-- content -->

    <div v-if="slots.default" :id="contentID" class="vex-alert-content">
      <slot />
    </div>

    <!-- close button -->

    <button
      v-if="p.dismissible"
      type="button"
      class="vex-alert-close"
      aria-label="dismiss"
      @click="emit('dismiss')"
    >
      <IconXMark aria-hidden="true" width="14" height="14" />
    </button>
  </div>
</template>
