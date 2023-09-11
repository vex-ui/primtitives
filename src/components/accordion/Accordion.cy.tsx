import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '.'
import { mount } from 'cypress/vue'

describe('Accordion', () => {
  const BaseAccordion = () => (
    <Accordion class="test-accordion">
      <AccordionItem class="test-item">
        {{
          default: ({ expanded }: { expanded: boolean }) => (
            <>
              <AccordionTrigger class="test-trigger">trigger</AccordionTrigger>
              {expanded && <AccordionContent class="test-content">content</AccordionContent>}
            </>
          ),
        }}
      </AccordionItem>
    </Accordion>
  )

  it('renders correctly', () => {
    mount(BaseAccordion)
    cy.get('.test-trigger').click()

    cy.get('.test-trigger')
      .invoke('attr', 'id')
      .then((id) => {
        cy.get('.test-trigger').should('have.attr', 'aria-expanded', 'true')
        cy.get('.test-content').should('have.attr', 'aria-labelledby', id)
      })

    cy.get('.test-content')
      .invoke('attr', 'id')
      .then((id) => {
        cy.get('.test-content').should('have.attr', 'role', 'region')
        cy.get('.test-trigger').should('have.attr', 'aria-controls', id)
      })
  })

  it('has correct aria attributes', () => {
    mount(BaseAccordion)

    cy.get('.test-accordion').should('exist')
    cy.get('.test-item').should('exist')
    cy.get('.test-trigger').should('exist')
    cy.get('.test-content').should('not.exist')
  })

  it('shows/hides the content when clicked', () => {
    mount(BaseAccordion)

    cy.get('.test-content').should('not.exist')
    cy.get('.test-trigger').click()
    cy.get('.test-content').should('exist').should('have.text', 'content')
  })

  it('sets the correct aria attributes when expanded/collapsed', () => {
    mount(BaseAccordion)
    cy.get('.test-trigger').as('trigger')

    cy.get('@trigger').should('have.attr', 'aria-expanded', 'false')
    cy.get('@trigger').click()
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'true')
  })

  it('supports single expansion', () => {
    mount(() => (
      <Accordion class="test-accordion">
        {[1, 2, 3].map((i) => (
          <AccordionItem class="test-item">
            {{
              default: ({ expanded }: { expanded: boolean }) => (
                <>
                  <AccordionTrigger class={`test-trigger-${i}`}>trigger {i}</AccordionTrigger>
                  <AccordionContent v-show={expanded} class={`test-content-${i}`}>
                    content {i}
                  </AccordionContent>
                </>
              ),
            }}
          </AccordionItem>
        ))}
      </Accordion>
    ))

    cy.get('.test-trigger-1').as('trigger-1').should('have.attr', 'aria-expanded', 'false')
    cy.get('.test-trigger-2').as('trigger-2').should('have.attr', 'aria-expanded', 'false')
    cy.get('.test-trigger-3').as('trigger-3').should('have.attr', 'aria-expanded', 'false')

    cy.get('.test-content-1').should('not.be.visible')
    cy.get('.test-content-2').should('not.be.visible')
    cy.get('.test-content-3').should('not.be.visible')

    //===

    cy.get('@trigger-1').click()

    cy.get('@trigger-1').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-2').should('have.attr', 'aria-expanded', 'false')
    cy.get('@trigger-3').should('have.attr', 'aria-expanded', 'false')

    cy.get('.test-content-1').should('be.visible')
    cy.get('.test-content-2').should('not.be.visible')
    cy.get('.test-content-3').should('not.be.visible')

    //===

    cy.get('@trigger-2').click()

    cy.get('@trigger-1').should('have.attr', 'aria-expanded', 'false')
    cy.get('@trigger-2').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-3').should('have.attr', 'aria-expanded', 'false')

    cy.get('.test-content-1').should('not.be.visible')
    cy.get('.test-content-2').should('be.visible')
    cy.get('.test-content-3').should('not.be.visible')

    //===

    cy.get('@trigger-3').click()

    cy.get('@trigger-1').should('have.attr', 'aria-expanded', 'false')
    cy.get('@trigger-2').should('have.attr', 'aria-expanded', 'false')
    cy.get('@trigger-3').should('have.attr', 'aria-expanded', 'true')

    cy.get('.test-content-1').should('not.be.visible')
    cy.get('.test-content-2').should('not.be.visible')
    cy.get('.test-content-3').should('be.visible')
  })

  it('supports multi expansion', () => {
    mount(() => (
      <Accordion class="test-accordion" multiple>
        {[1, 2, 3].map((i) => (
          <AccordionItem class="test-item">
            {{
              default: ({ expanded }: { expanded: boolean }) => (
                <>
                  <AccordionTrigger class={`test-trigger-${i}`}>trigger {i}</AccordionTrigger>
                  <AccordionContent v-show={expanded} class={`test-content-${i}`}>
                    content {i}
                  </AccordionContent>
                </>
              ),
            }}
          </AccordionItem>
        ))}
      </Accordion>
    ))

    cy.get('.test-trigger-1').as('trigger-1').should('have.attr', 'aria-expanded', 'false')
    cy.get('.test-trigger-2').as('trigger-2').should('have.attr', 'aria-expanded', 'false')
    cy.get('.test-trigger-3').as('trigger-3').should('have.attr', 'aria-expanded', 'false')

    cy.get('.test-content-1').should('not.be.visible')
    cy.get('.test-content-2').should('not.be.visible')
    cy.get('.test-content-3').should('not.be.visible')

    //===

    cy.get('@trigger-1').click()

    cy.get('@trigger-1').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-2').should('have.attr', 'aria-expanded', 'false')
    cy.get('@trigger-3').should('have.attr', 'aria-expanded', 'false')

    cy.get('.test-content-1').should('be.visible')
    cy.get('.test-content-2').should('not.be.visible')
    cy.get('.test-content-3').should('not.be.visible')

    //===

    cy.get('@trigger-2').click()

    cy.get('@trigger-1').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-2').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-3').should('have.attr', 'aria-expanded', 'false')

    cy.get('.test-content-1').should('be.visible')
    cy.get('.test-content-2').should('be.visible')
    cy.get('.test-content-3').should('not.be.visible')

    //===

    cy.get('@trigger-3').click()

    cy.get('@trigger-1').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-2').should('have.attr', 'aria-expanded', 'true')
    cy.get('@trigger-3').should('have.attr', 'aria-expanded', 'true')

    cy.get('.test-content-1').should('be.visible')
    cy.get('.test-content-2').should('be.visible')
    cy.get('.test-content-3').should('be.visible')
  })
})
