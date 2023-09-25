import { Combobox, ComboboxDropdown, ComboboxOption, ComboboxTrigger } from './Combobox'
import { mount } from 'cypress/vue'

describe('Combobox', () => {
  const component = () => (
    <Combobox>
      <ComboboxTrigger></ComboboxTrigger>
      <ComboboxDropdown>
        <ComboboxOption>item 1</ComboboxOption>
        <ComboboxOption>item 2</ComboboxOption>
        <ComboboxOption>item 3</ComboboxOption>
      </ComboboxDropdown>
    </Combobox>
  )

  beforeEach(() => {
    mount(component)
  })

  it('renders without crashing', () => {
    cy.get('[role=combobox]').should('exist')
  })
})
