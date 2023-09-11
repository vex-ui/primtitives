<template>
  <div class="vex-loading-spinner" />
</template>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.vex-loading-spinner {
  position: relative;
  display: grid;
  place-items: center;
  height: 1rem;
  width: 1rem;
}

.vex-loading-spinner::before,
.vex-loading-spinner::after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  border-color: transparent;
  border-top-color: currentColor;
  border-style: solid;
  border-radius: 100%;
  border-width: 2px;
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.vex-loading-spinner::after {
  animation-timing-function: ease;
}

.vex-loading-spinner::before {
  animation-timing-function: linear;
  border-style: dashed;
  opacity: 50%;
}
</style>
