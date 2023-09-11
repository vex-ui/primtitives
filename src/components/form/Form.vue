<script setup lang="ts">
import { ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(defineProps<{}>(), {})

//----------------------------------------------------------------------------------------------------
// 📌 validation
//----------------------------------------------------------------------------------------------------
// const FormEl = ref<HTMLFormElement>()
// function onInvalid(e: Event) {
//   const firstInvalidControl = getFirstInvalidControl(FormEl.value!);
//   if (firstInvalidControl === e.target) firstInvalidControl.focus();

//   // prevent default browser UI for form validation
//   e.preventDefault();
// }

// function getFirstInvalidControl(form: HTMLFormElement): HTMLElement | undefined {
//   const elements = form.elements;
//   const [firstInvalidControl] = Array.from(elements).filter((el)=>{
//     if(el instanceof HTMLElement && el.validity.valid)
//   });
//   return firstInvalidControl;
// }

// function isHTMLElement(element: any): element is HTMLElement {
//   return element instanceof HTMLElement;
// }

// function isFormControl(element: any): element is { validity: ValidityState } {
//   return 'validity' in element;
// }

// function isInvalid(control: HTMLElement) {
//   return (
//     isFormControl(control) &&
//     (control.validity.valid === false || control.getAttribute('aria-invalid') === 'true')
//   );
// }
</script>

<template>
  <form ref="FormEl">
    <slot />
  </form>
</template>
