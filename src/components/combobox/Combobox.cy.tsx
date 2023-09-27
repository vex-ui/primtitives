import { defineComponent } from 'vue'
import { ComboboxDropdown, ComboboxOption, ComboboxTrigger, ComboboxListbox } from './Combobox'
import { useCombobox } from './ComboboxContext'
import { mount } from 'cypress/vue'

describe('Combobox', () => {
  const Combobox = defineComponent({
    setup(p, { slots }) {
      const { isDropdownVisible } = useCombobox()
      return () => (
        <>
          <ComboboxTrigger></ComboboxTrigger>
          <ComboboxDropdown>
            <ComboboxListbox v-show={isDropdownVisible.value}>
              <ComboboxOption value="item 1">item 1</ComboboxOption>
              <ComboboxOption value="item 2">item 2</ComboboxOption>
              <ComboboxOption value="item 3">item 3</ComboboxOption>
            </ComboboxListbox>
          </ComboboxDropdown>
        </>
      )
    },
  })

  const component = Combobox

  beforeEach(() => {
    mount(component)
  })

  it('renders without crashing', () => {
    cy.get('[role=combobox]').should('exist')
  })

  it('has correct aria attributes', () => {
    cy.get('[role=combobox]').as('combobox')
    cy.get('[role=listbox]').as('listbox')

    cy.get('@listbox').invoke('attr', 'id').should('have.length.above', 0)
    cy.get('@combobox').invoke('attr', 'id').should('have.length.above', 0)

    cy.get('@listbox')
      .invoke('attr', 'id')
      .then((listboxID) => {
        cy.get('@combobox').should('have.attr', 'aria-controls', listboxID)
      })

    cy.get('@combobox')
      .invoke('attr', 'id')
      .then((comboboxID) => {
        cy.get('@listbox').should('have.attr', 'aria-labelledby', comboboxID)
      })
  })
})
