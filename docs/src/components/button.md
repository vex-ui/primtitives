<script lang="ts" setup>
import {ref} from 'vue'
import { Button, Demo } from '@vex-ui/core'
import {TrashIcon, PaperAirplaneIcon, UserIcon, HomeIcon} from '@heroicons/vue/24/solid'

function getCode(state: any) {
  const params = Object.keys(state)
    .map((key) => `${key}="${state[key]?.label || state[key]}"`)
    .join('\n')

  const _code = `
  <Button ${params} >
    button
  </Button>
  `
  code.value = _code

  return _code
}

const code = ref()

const controls = [
  {
    label: 'variant',
    options: [
      {
        label: 'filled',
        value: 'filled',
      },
      {
        label: 'light',
        value: 'light',
      },
      {
        label: 'outline',
        value: 'outline',
      },
      {
        label: 'text',
        value: 'text',
      },
    ],
    controlType: 'Select',
    default: {
      label: 'filled',
      value: 'filled',
    },
  },

  {
    label: 'size',
    options: [
      {
        label: 'sm',
        value: 'sm',
      },
      {
        label: 'md',
        value: 'md',
      },
      {
        label: 'lg',
        value: 'lg',
      },
    ],
    controlType: 'Select',
    default: {
      label: 'md',
      value: 'md',
    },
  },
  {
    label: 'danger',
    controlType: 'Switch',
    default: false,
  },
  {
    label: 'loading',
    controlType: 'Switch',
    default: false,
  },
  {
    label: 'disabled',
    controlType: 'Switch',
    default: false,
  },
]
</script>

# Button

a button is a UI element that can be used to trigger actions, submit forms, or navigate between pages. It is a fundamental component in most web applications.

<Demo :controls="controls">
  <template #window="{ state }">
    <Button
      :danger="state.danger"
      :size="state.size.value"
      :variant="state.variant.value"
      :loading="state.loading"
      :disabled="state.disabled"
      >button</Button
    >
  </template>

<!-- <template #code="{ state }"> <div class="overflow-x-auto">{{ getCode(state) }}</div></template> -->
</Demo>

```ts-vue

<template>
  <Button>button</Button>
</template>

```

## Best practices

When using the button component, it's important to follow these best practices:

- Use clear and concise labels that describe the action that will be taken when the button is clicked.
- Use contrasting colors and visual cues to make the button stand out and easy to find.
- Select the variant that best suits the level of emphasis required for the action that the button represents, whether it needs to stand out or blend in with the surrounding content.

## variants

::: raw

<div class="demo-container">
  <div class="row">
    <Button variant="filled">filled</Button>
    <Button variant="light">light</Button>
    <Button variant="outline">outline</Button>
    <Button variant="text">text</Button>
  </div>
</div>
:::

The button component comes in the following variations:

- `filled`: Used for primary actions require immediate attention like a call to action.
- `light`: often used for secondary actions that are less important than the primary actions.
- `outline`: has less priority and is often used to de-emphasize an action like a cancel button in a pop-up.
- `text`: Used for actions that require minimal attention.

## destructive button

the `danger` prop transforms the button into a destructive button.

<div class="demo-container">
  <div class="row">
    <Button danger variant="filled" >filled</Button>
    <Button danger variant="light" >light</Button>
    <Button danger variant="outline" >outline</Button>
    <Button danger variant="text" >text</Button>
  </div>
</div>

## icons

icons can be added before or after the label text, however do prefer using only one icon at a time for a more descriptive button.

<div class="demo-container">
  <div class="row">
    <Button>
      send
      <PaperAirplaneIcon class="icon" />
    </Button>
    <Button danger>
      <TrashIcon class="icon" />
      delete
    </Button>
  </div>
</div>

## icon-only

add `icon-only` prop to make an icon button.

<div class="demo-container">
  <div class="row">
    <Button icon-only>
      <PaperAirplaneIcon class="icon" />
    </Button>
    <Button icon-only color="danger" variant="light">
      <TrashIcon class="icon" />
    </Button>
    <Button icon-only color="success" variant="outline">
      <HomeIcon class="icon" />
    </Button>
    <Button icon-only color="plain" variant="text">
      <UserIcon class="icon" />
    </Button>
  </div>
</div>

it's crucial to consider the usage context and ensure that the icon is recognizable and meaningful to the user. In addition, it's a good practice to provide alternative text via the `aria-label` prop or a tooltip. This ensures that users can understand the button's purpose and use it effectively, especially if they rely on assistive technologies or have visual impairments.

## Props

| name          | type                                            | default     | description                                            |
| ------------- | ----------------------------------------------- | ----------- | ------------------------------------------------------ |
| variant       | `'filled' \| 'light' \| 'outline' \| 'text'`    | `'filled'`  | controls the button variant                            |
| size          | `'sm' \| 'md' \| 'lg'`                          | `'md'`      | controls the button size                               |
| disabled      | `boolean`                                       | `false`     | controls the button disabled state                     |
| danger        | `boolean`                                       | `false`     | transforms the button into a destructive action button |
| loading       | `boolean`                                       | `false`     | shows a loading spinner when enabled                   |
| icon-only     | `boolean`                                       | `false`     | transforms the button into an icon button              |
| type          | `'submit' \| 'button' \| 'reset'`               | `'button'`  | controls the button type                               |
| border-radius | `'sm' \| 'md' \| 'lg' \| 'square' \| 'rounded'` | `'rounded'` | controls the button border radius                      |
| aria-label    | `string \| undefined`                           | `undefined` | controls the button aria label                         |

## slots

| name    | slot props | description                       |
| ------- | :--------: | --------------------------------- |
| default |     -      | used for button text and/or icons |

## keyboard interactions

- `Tab key`: Allows the user to navigate to the button element.

- `Space key`: Activates the button when it has focus.b This is equivalent to clicking the button with a mouse or tapping it on a touch screen.

- `Arrow keys`: When a button is part of a group of focusable elements, such as a toolbar or a menu, the arrow keys can be used to navigate between them.

<style>
  .demo-container{
    padding: 1rem;
    border-radius: var(--vex-border-radius-md); 
  }
  .row{
    display: flex;
    flex-wrap: wrap;
    grid-template-rows: auto;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
  .column{
    display: flex;
    flex-wrap: wrap;
    grid-template-rows: auto;
    flex-direction: column;
    gap: 16px;
  }
  .icon{
    width: 18px;
    height: 18px;
  }
</style>
