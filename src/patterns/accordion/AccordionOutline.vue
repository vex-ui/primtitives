<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components'
import { TransitionExpand } from '@/transitions'
</script>

<template>
  <Accordion
    class="w-full flex flex-col c-neutral-900 rounded-sm border-c-neutral-100 border-1"
    deselect-on-reselect
  >
    <AccordionItem
      class="flex flex-col items-stretch rounded-1 transition-colors not-last-of-type:border-b-1 not-last-of-type:border-b-neutral-300"
      v-for="i in 4"
      :key="i"
      #="{ expanded }"
    >
      <h3 class="flex items-center justify-stretch gap-4 text-sm rounded-sm">
        <AccordionTrigger
          class="flex-grow flex-auto flex items-center justify-stretch gap-4 w-full px-4 py-3 cursor-pointer text-left bg-transparent focus:outline-primary-500 hover:bg-neutral-100 disabled:(opacity-50 cursor-not-allowed)"
        >
          Accordion Header
          <PlusIcon
            :class="[
              'flex-none w-4 h-4 ml-auto transition-transform duration-300',
              expanded && 'rotate-45',
            ]"
          />
        </AccordionTrigger>
      </h3>

      <TransitionExpand>
        <div v-if="expanded">
          <AccordionContent class="px-4 pt-1 pb-3 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nulla officia error sapiente
            unde assumenda amet repudiandae harum atque quasi voluptatem voluptate sed earum omnis
            accusantium, modi vitae veniam tempora!
          </AccordionContent>
        </div>
      </TransitionExpand>
    </AccordionItem>
  </Accordion>
</template>
