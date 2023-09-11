<!-- @unocss-include -->
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
  <!-- TODO: refactor to use preset-vex for ui-state, refactor disabled state -->
  <Accordion class="w-full flex flex-col gap-1 text-gray-900" deselect-on-reselect>
    <AccordionItem
      v-for="{ content, header } of dummyData"
      :key="header"
      disabled
      class="flex flex-col items-stretch rounded-1 transition-colors duration-300 font-500 [&[data-vex-state~='expanded']]:bg-zinc-100"
      #="{ expanded }"
    >
      <!-- Trigger -->

      <h3 class="flex items-center justify-stretch gap-4 text-sm">
        <AccordionTrigger
          class="flex-grow flex-auto flex items-center text-14px gap-4 w-full rounded-1 p-4 cursor-pointer bg-inherit focus:outline-dark-900 enabled:hover:bg-zinc-100 transition-colors disabled:(opacity-50 cursor-not-allowed)"
        >
          <ChevronIcon
            :class="[
              'flex-none w-4 h-4 p1 box-content text-gray-900 bg-white rounded-full transition-transform duration-300',
              expanded && 'rotate-45',
            ]"
          />

          {{ header }}
        </AccordionTrigger>
      </h3>

      <!-- Content -->

      <TransitionExpand>
        <div v-if="expanded">
          <AccordionContent class="px-14 pb-4 text-12px text-gray-600">
            {{ content }}
          </AccordionContent>
        </div>
      </TransitionExpand>
    </AccordionItem>
  </Accordion>
</template>
