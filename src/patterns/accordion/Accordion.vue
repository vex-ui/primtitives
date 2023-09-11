<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components'
import { TransitionExpand } from '@/transitions'

const variants = [
  '--variant-default',
  '--variant-outline',
  '--variant-ladder',
  '--variant-light',
] as const
</script>

<template>
  <div class="grid grid-cols-1 h-screen place-items-center m-auto gap-4 p-12 bg-white">
    <Accordion v-for="variant in variants" :key="variant" :class="[variant, 'vex-accordion']">
      <AccordionItem v-for="i in 4" :key="i" #="{ expanded }" class="vex-accordion-item">
        <!-- wai-aria spec requires the trigger to be wrapped by a role=heading -->
        <h3 class="vex-accordion-header">
          <AccordionTrigger class="vex-accordion-trigger">
            Accordion Header
            <PlusIcon class="vex-accordion-chevron" />
          </AccordionTrigger>
        </h3>

        <TransitionExpand>
          <!-- 
            because of the way expansion transition works we need to wrap the content with
            a div to be able to apply padding to the content
          -->
          <div v-if="expanded" class="vex-accordion-panel">
            <AccordionContent class="vex-accordion-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nulla officia error
              sapiente unde assumenda amet repudiandae harum atque quasi voluptatem voluptate sed
              earum omnis accusantium, modi vitae veniam tempora!
            </AccordionContent>
          </div>
        </TransitionExpand>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style lang="scss">
.vex-accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: var(--vex-c-neutral-900);
  border-radius: var(--vex-border-radius-sm);
}

//------ item ------//

.vex-accordion-item {
  transition-property: color, background-color, border-color, outline-color;
  transition-timing-function: var(--vex-transition-easing);
  transition-duration: 150ms;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: var(--vex-border-radius-sm);
}

//------ trigger ------//

.vex-accordion-item :is(h1, h2, h3, h4, h5, h6) {
  font-size: var(--vex-font-size-sm);
  border-radius: var(--vex-border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: var(--vex-spacing-4);
}

.vex-accordion-trigger {
  flex-grow: 1;
  flex-basis: auto;
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: var(--vex-spacing-4);
  width: 100%;
  padding: var(--vex-spacing-3) var(--vex-spacing-4);
  cursor: pointer;
  text-align: start;
  background-color: transparent;

  &:disabled {
    cursor: not-allowed;
    opacity: 50%;
  }

  &:focus-visible {
    outline: 1px solid var(--vex-c-primary-500);
  }
}

.vex-accordion-chevron {
  flex: none;
  transition: transform 300ms var(--vex-transition-easing);
  width: 16px;
  height: 16px;
  margin-inline-start: auto;

  .vex-accordion-item.--expanded & {
    transform: rotate(45deg);
  }
}

//------ content ------//

.vex-accordion-content {
  font-size: var(--vex-font-size-sm);
  padding-inline: var(--vex-spacing-4);
  padding-block: var(--vex-spacing-1) var(--vex-spacing-3);
}

//------ variant default ------//

.vex-accordion.--variant-default {
  gap: var(--vex-spacing-1);

  .vex-accordion-trigger:enabled:hover {
    background-color: var(--vex-c-neutral-100);
  }
  .vex-accordion-item.--expanded {
    background-color: var(--vex-c-neutral-100);
  }
}

//------ variant ladder ------//

.vex-accordion.--variant-ladder {
  .vex-accordion-item {
    border-bottom-color: var(--vex-c-neutral-200);
  }

  .vex-accordion-trigger:enabled:hover {
    background-color: var(--vex-c-neutral-100);
  }
}

//------ variant outline ------//

.vex-accordion.--variant-outline {
  border: 1px solid var(--vex-border-clr-base);

  .vex-accordion-item ~ .vex-accordion-item {
    border-top-color: var(--vex-border-clr-base);
  }
  .vex-accordion-trigger:enabled:hover {
    background-color: var(--vex-c-neutral-100);
  }
}

//------ variant light ------//

.vex-accordion.--variant-light {
  gap: var(--vex-spacing-2);

  .vex-accordion-item {
    background-color: var(--vex-c-neutral-100);
  }
  .vex-accordion-item.--expanded {
    background-color: white;
    border-color: var(--vex-border-clr-base);
  }
}
</style>
