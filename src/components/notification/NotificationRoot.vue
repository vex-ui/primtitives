<script setup lang="ts">
import type { NotificationItem } from '.'
import Notification from './Notification.vue'
import { animate, timeline } from 'motion'
import { useEventListener } from '@vueuse/core'
import { isString } from '@/composables/helpers'
import { ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 add/remove items
//----------------------------------------------------------------------------------------------------

const items = ref<NotificationItem[]>([])

function addNotification(notification: NotificationItem) {
  items.value.unshift(notification)
}

function removeNotification(notification: NotificationItem) {
  const idx = items.value.findIndex((_notification) => _notification === notification)
  items.value.splice(idx, 1)
}

//----------------------------------------------------------------------------------------------------
// 📌 keyboard navigation
//----------------------------------------------------------------------------------------------------

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'F8' && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    const el = document.querySelector<HTMLElement>('.vex-notification-root')
    el?.focus()
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 animation
//----------------------------------------------------------------------------------------------------

async function onEnter(el: HTMLElement, done: () => void) {
  const children = el.querySelectorAll<HTMLElement>('.vex-notification-item > *')
  const { opacity, transform } = getComputedStyle(el)

  await timeline(
    [
      [el, { x: ['100%', 0], opacity: [0, 1] }, { duration: 0.5 }],
      [children, { opacity: [0, 1] }, { duration: 0.3, at: 0.3 }],
    ],
    { defaultOptions: { easing: 'ease-out' }, persist: false }
  ).finished

  children.forEach((child) => {
    child.style.opacity = ''
  })
  el.style.opacity = opacity
  el.style.transform = transform

  done()
}

function onBeforeLeave(el: HTMLElement) {
  // make the element retain its position
  const rect = el.getBoundingClientRect()
  el.style.top = `${rect.top}px`
  el.style.left = `${rect.left}px`
  el.style.position = 'absolute'
}

async function onLeave(el: HTMLElement, done: () => void) {
  await animate(el, { opacity: 0, x: '100%' }, { duration: 0.3 }).finished
  done()
}

//----------------------------------------------------------------------------------------------------

defineExpose({
  addNotification,
  removeNotification,
})
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      id="vex-notification-root"
      class="vex-notification-root"
      moveClass="vex-notification-move-class"
      leaveActiveClass="vex-notification-leave-active"
      @beforeLeave="(el)=> onBeforeLeave(el as HTMLElement)"
      @enter="(el, done)=> onEnter(el as HTMLElement, done)"
      @leave="(el, done)=> onLeave(el as HTMLElement, done)"
      aria-label="Notifications (F8)"
      tabindex="-1"
      role="region"
      aria-live="polite"
    >
      <Notification
        v-for="item in items"
        :key="item.key"
        :title="isString(item.title) ? item.title : undefined"
        :body="isString(item.body) ? item.body : undefined"
        :duration="item.duration"
        :type="item.type"
        :persist="item.persist"
        :hide-progress="item.hideProgress"
        :closeable="item.closable"
        @close="removeNotification(item)"
      >
        <template v-if="item.customContent" #default>
          <Component :is="item.customContent" />
        </template>

        <template v-if="!isString(item.title)" #title>
          <Component :is="item.title" />
        </template>

        <template v-if="!isString(item.body)" #body>
          <Component :is="item.body" />
        </template>

        <template v-if="item.icon" #icon>
          <Component :is="item.icon" />
        </template>
      </Notification>
    </TransitionGroup>
  </Teleport>
</template>
