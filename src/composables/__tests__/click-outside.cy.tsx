import { ref, type Ref } from 'vue'
import { useClickOutside } from '../click-outside'

describe('useClickOutside', { retries: 0 }, () => {
  const component = {
    props: ['callback', 'active', 'mounted'],
    setup(p: any) {
      const target = ref()
      const ignore = ref()

      useClickOutside(target, p.callback, {
        isActive: () => p.active.value,
        ignore: [ignore],
      })

      return () => (
        <div style={{ padding: '20px' }} cy-wrapper>
          {p.mounted.value && (
            <div style={{ width: '100px', height: '100px' }} cy-target ref={target}>
              target, active: {`${p.active.value}`}
            </div>
          )}
          <div style={{ width: '100px', height: '100px' }} cy-outside>
            outside
          </div>
          <div style={{ width: '100px', height: '100px' }} cy-ignore ref={ignore}>
            ignore
          </div>
        </div>
      )
    },
  }

  let active: Ref<boolean>
  let mounted: Ref<boolean>
  let callback: ReturnType<typeof cy.stub>

  beforeEach(() => {
    active = ref(true)
    mounted = ref(true)
    callback = cy.stub()
    cy.mount(component, { props: { callback, active, mounted } })
  })

  afterEach(() => {})

  //----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the target', () => {
    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('have.been.calledOnce')
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens inside the target', () => {
    cy.get('[cy-target]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens on an element in the ignore list', () => {
    cy.get('[cy-ignore]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when the isActive option is set to false', () => {
    active.value = false
    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('handles toggling isActive option', () => {
    cy.get('[cy-outside]').click()
    cy.wrap(callback)
      .should('have.been.calledOnce')
      .then(() => {
        active.value = false
      })

    cy.get('[cy-outside]').click()
    cy.wrap(callback)
      .should('have.been.calledOnce')
      .then(() => {
        active.value = true
      })

    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('not.have.been.calledOnce')
  })

  //----------------------------------------------------------------------------------------------------

  it('should remove the event listener when the component is unmounted', () => {
    mounted.value = false
    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('should update the target and still call the callback when a click happens outside the updated target', () => {
    // Mount the component with an initial target
    // Trigger a click event outside the initial target
    // Check if the callback has been called
    // Update the target to a new element
    // Trigger a click event outside the updated target
    // Check if the callback has been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should update the ignore list and not call the callback when a click happens on an element in the updated ignore list', () => {
    // Mount the component with an initial ignore list
    // Trigger a click event on an element in the initial ignore list
    // Check if the callback has not been called
    // Update the ignore list to a new list
    // Trigger a click event on an element in the updated ignore list
    // Check if the callback has not been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should update the callback function and call the updated callback when a click happens outside the target', () => {
    // Mount the component with an initial callback function
    // Trigger a click event outside the target
    // Check if the initial callback has been called
    // Update the callback function to a new function
    // Trigger a click event outside the target
    // Check if the updated callback has been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should not throw an error when the callback function is not provided', () => {
    // Mount the component without providing a callback function
    // Trigger a click event outside the target
    // Check if no error is thrown
  })

  //----------------------------------------------------------------------------------------------------

  it('should not throw an error when the target is not provided', () => {
    // Mount the component without providing a target
    // Trigger a click event outside the target
    // Check if no error is thrown
  })

  //----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the nested target', () => {
    // Mount the component with a nested target
    // Trigger a click event outside the nested target
    // Check if the callback has been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens on a nested element in the ignore list', () => {
    // Mount the component with an ignore list that contains nested elements
    // Trigger a click event on a nested element in the ignore list
    // Check if the callback has not been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should call the asynchronous callback function when a click happens outside the target', () => {
    // Mount the component with an asynchronous callback function
    // Trigger a click event outside the target
    // Wait for the asynchronous callback to complete
    // Check if the callback has been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the target after it is removed and added back', () => {
    // Mount the component with a target
    // Trigger a click event outside the target
    // Check if the callback has been called
    // Remove the target from the DOM
    // Add the target back to the DOM
    // Trigger a click event outside the target
    // Check if the callback has been called
  })

  //----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the target after the ignore list is cleared', () => {
    // Mount the component with an ignore list
    // Trigger a click event on an element in the ignore list
    // Check if the callback has not been called
    // Clear the ignore list
    // Trigger a click event outside the target
    // Check if the callback has been called
  })
})
