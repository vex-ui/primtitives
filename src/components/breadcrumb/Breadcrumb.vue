<script setup lang="ts">
import { useTemplateRef } from '@/composables'
import { onBeforeUpdate, onMounted, onUpdated } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether to automatically add `aria-current="page"`
     * to the last `a` link in the breadcrumb,
     * some routing libraries (like vue-router)
     * already take care of this.
     */
    autoAriaCurrent?: boolean
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------
// 📌 aria-current
//----------------------------------------------------------------------------------------------------

const [getBreadcrumbEl, setBreadcrumbEl] = useTemplateRef('Breadcrumb')

if (p.autoAriaCurrent) {
  onBeforeUpdate(() => {
    getBreadcrumbEl()?.querySelector('a:last-of-type')?.removeAttribute('aria-current')
  })

  onUpdated(() => {
    getBreadcrumbEl()?.querySelector('a:last-of-type')?.setAttribute('aria-current', 'page')
  })

  onMounted(() => {
    getBreadcrumbEl()?.querySelector('a:last-of-type')?.setAttribute('aria-current', 'page')
  })
}
</script>

<template>
  <div :ref="setBreadcrumbEl" role="navigation" aria-label="breadcrumb" class="vex-breadcrumb">
    <slot></slot>
  </div>
</template>
