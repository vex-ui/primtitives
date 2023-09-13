import { useClickOutside } from '../click-outside'

describe('useClickOutside', () => {
  describe('useClickOutside', () => {
    it('should call the callback when a click happens outside the source element', () => {
      // Trigger a click event on the body or any other element that is not the source element or in the ignore list
      // Check if the callback has been called
      // TODO: implement the test using cypress
      cy.mount(() => {
        
      })
    })

    it('should not call the callback when a click happens inside the source element', () => {
      // Trigger a click event on the source element
      // Check if the callback has not been called
    })

    it('should not call the callback when a click happens on an element in the ignore list', () => {
      // Trigger a click event on an element that is in the ignore list
      // Check if the callback has not been called
    })

    it('should not call the callback when the isActive option is set to false', () => {
      // Set the isActive option to false
      // Trigger a click event outside the source element
      // Check if the callback has not been called
    })

    it('should call the callback when the isActive option is changed from false to true and a click happens outside the source element', () => {
      // Set the isActive option to false
      // Change the isActive option to true
      // Trigger a click event outside the source element
      // Check if the callback has been called
    })

    it('should remove the event listener when the component is unmounted', () => {
      // Mount the component
      // Unmount the component
      // Trigger a click event outside the source element
      // Check if the callback has not been called
    })

    it('should update the source element and still call the callback when a click happens outside the updated source element', () => {
      // Mount the component with an initial source element
      // Trigger a click event outside the initial source element
      // Check if the callback has been called
      // Update the source element to a new element
      // Trigger a click event outside the updated source element
      // Check if the callback has been called
    })

    it('should update the ignore list and not call the callback when a click happens on an element in the updated ignore list', () => {
      // Mount the component with an initial ignore list
      // Trigger a click event on an element in the initial ignore list
      // Check if the callback has not been called
      // Update the ignore list to a new list
      // Trigger a click event on an element in the updated ignore list
      // Check if the callback has not been called
    })

    it('should update the callback function and call the updated callback when a click happens outside the source element', () => {
      // Mount the component with an initial callback function
      // Trigger a click event outside the source element
      // Check if the initial callback has been called
      // Update the callback function to a new function
      // Trigger a click event outside the source element
      // Check if the updated callback has been called
    })

    it('should not throw an error when the callback function is not provided', () => {
      // Mount the component without providing a callback function
      // Trigger a click event outside the source element
      // Check if no error is thrown
    })

    it('should not throw an error when the source element is not provided', () => {
      // Mount the component without providing a source element
      // Trigger a click event outside the source element
      // Check if no error is thrown
    })

    it('should call the callback when a click happens outside the nested source element', () => {
      // Mount the component with a nested source element
      // Trigger a click event outside the nested source element
      // Check if the callback has been called
    })

    it('should not call the callback when a click happens on a nested element in the ignore list', () => {
      // Mount the component with an ignore list that contains nested elements
      // Trigger a click event on a nested element in the ignore list
      // Check if the callback has not been called
    })

    it('should call the asynchronous callback function when a click happens outside the source element', () => {
      // Mount the component with an asynchronous callback function
      // Trigger a click event outside the source element
      // Wait for the asynchronous callback to complete
      // Check if the callback has been called
    })

    it('should call the callback when a click happens outside the source element after it is removed and added back', () => {
      // Mount the component with a source element
      // Trigger a click event outside the source element
      // Check if the callback has been called
      // Remove the source element from the DOM
      // Add the source element back to the DOM
      // Trigger a click event outside the source element
      // Check if the callback has been called
    })

    it('should call the callback when a click happens outside the source element after the ignore list is cleared', () => {
      // Mount the component with an ignore list
      // Trigger a click event on an element in the ignore list
      // Check if the callback has not been called
      // Clear the ignore list
      // Trigger a click event outside the source element
      // Check if the callback has been called
    })
  })
})
