<script setup lang="tsx">
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components'
import { TransitionExpand } from '@/transitions'

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z" />
  </svg>
)

const dummyData = [
  {
    header: 'Scalable Solutions',
    content: `As your business grows, our platform scales with you. We offer flexible plans and features that adapt to the size and needs of your company.`,
  },
  {
    header: 'Secure Data Management',
    content: `Our platform ensures your data is securely stored and managed. With advanced encryption and compliance features, you can trust us with your most sensitive information.`,
  },
  {
    header: 'Comprehensive Suite of Tools',
    content: `Our platform offers a comprehensive suite of tools designed to streamline your workflow.From project management and team collaboration to data analysis and reporting, we provide a single solution to manage all aspects of your business. Experience the power of seamless integration and improved efficiency with our platform.`,
  },
]
</script>

<template>
  <Accordion class="accordion">
    <AccordionItem
      v-for="{ content, header } of dummyData"
      :key="header"
      class="accordion-item"
      #="{ expanded }"
    >
      <!-- Trigger -->

      <h3>
        <AccordionTrigger class="accordion-trigger">
          <ChevronIcon />
          {{ header }}
        </AccordionTrigger>
      </h3>

      <!-- Content -->

      <TransitionExpand>
        <div v-if="expanded">
          <AccordionContent class="accordion-content">
            {{ content }}
          </AccordionContent>
        </div>
      </TransitionExpand>
    </AccordionItem>
  </Accordion>
</template>

<style lang="scss">
.accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(17, 24, 39); // gray-900
  border-radius: 0.25rem;
}

//------ item ------//

.accordion-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);

  &[data-vex-state~='expanded'],
  &[data-vex-state~='enabled']:hover {
    background-color: rgba(244, 244, 245); // zinc-100
  }
}

//------ trigger ------//

.accordion-item :is(h1, h2, h3, h4, h5, h6) {
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.accordion-trigger {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  text-align: start;
  background-color: inherit;
  transition: background-color 150ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 50%;
  }

  &:enabled:hover {
    background-color: rgba(244, 244, 245); // zinc-100
  }

  &:focus-visible {
    outline: 1px solid black;
  }
}

.accordion-trigger svg {
  flex: none;
  width: 16px;
  height: 16px;
  padding: 0.25rem;
  box-sizing: content-box;
  color: rgba(17, 24, 39); // gray-900
  background-color: white;
  border-radius: 9999px;
  transition: transform 300ms ease;

  .accordion-item[data-vex-state~='expanded'] & {
    transform: rotate(45deg);
  }
}

//------ content ------//

.accordion-content {
  padding-inline: 3.5rem;
  padding-bottom: 1rem;
  font-size: 0.75rem;
  color: rgba(75, 85, 99); // gray-600
}
</style>
