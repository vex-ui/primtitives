import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Alert } from '.'

describe('Alert', () => {
  it('renders without crashing', () => {
    // Arrange
    const wrapper = mount(() => <Alert header="alert header">alert body</Alert>)

    // Assert
    expect(wrapper.find('.vex-alert').exists()).toBe(true)
  })

  it('renders content with default slot and header prop', () => {
    // Arrange
    const wrapper = mount(() => <Alert header="alert header">alert body</Alert>)

    // Assert
    expect(wrapper.text()).toContain('alert header')
    expect(wrapper.text()).toContain('alert body')
  })

  it('renders header with header prop', () => {
    // Arrange
    const wrapper = mount(() => (
      <Alert>{{ default: () => 'alert body', header: () => 'alert header' }}</Alert>
    ))

    // Assert
    expect(wrapper.text()).toContain('alert header')
    expect(wrapper.text()).toContain('alert body')
  })

  it('slot header overrides prop header', () => {
    // Arrange
    const wrapper = mount(() => (
      <Alert header="prop header">{{ header: () => 'slot header' }}</Alert>
    ))

    // Assert
    expect(wrapper.text()).not.toContain('prop header')
    expect(wrapper.text()).toContain('slot header')
  })

  it('is not dismissible by unless dismissible prop is set to true', () => {
    // Arrange
    const wrapper = mount(() => (
      <Alert dismissible={false} header="header">
        body
      </Alert>
    ))

    // Assert
    expect(wrapper.find('.vex-alert-close').exists()).toBe(false)
  })

  it('it emits dismiss event when dismiss button is clicked', async () => {
    // Arrange
    let count = 1
    const onDismiss = () => count++
    const wrapper = mount(() => (
      <Alert onDismiss={onDismiss} dismissible header="header">
        body
      </Alert>
    ))

    // Act
    const dismissBtn = wrapper.find('.vex-alert-close')
    await dismissBtn.trigger('click')

    // Assert
    expect(count).toBe(2)
  })

  it('has proper aria attributes', () => {
    // Arrange
    const wrapper = mount(() => <Alert header="header">body</Alert>)

    // Act
    const content = wrapper.find('.vex-alert-content')
    const header = wrapper.find('.vex-alert-header')
    const alert = wrapper.find('.vex-alert')

    // Assert
    expect(alert.attributes()['aria-labelledby']).toBe(header.attributes().id)
    expect(alert.attributes()['aria-describedby']).toBe(content.attributes().id)
  })
})
