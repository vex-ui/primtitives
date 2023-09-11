<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components'
import { TransitionExpand } from '@/transitions'
</script>

<template>
  <Accordion class="accordion" deselect-on-reselect>
    <AccordionItem class="accordion-item" v-for="i in 4" :key="i" #="{ expanded }">
      <h3 class="accordion-header">
        <AccordionTrigger class="accordion-trigger">
          Accordion Header
          <PlusIcon class="accordion-chevron" />
        </AccordionTrigger>
      </h3>

      <TransitionExpand>
        <div v-if="expanded" class="accordion-panel">
          <AccordionContent class="accordion-content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nulla officia error sapiente
            unde assumenda amet repudiandae harum atque quasi voluptatem voluptate sed earum omnis
            accusantium, modi vitae veniam tempora!
          </AccordionContent>
        </div>
      </TransitionExpand>
    </AccordionItem>
  </Accordion>
</template>
