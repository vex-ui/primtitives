import Alert from './Alert.vue'

describe('Alert', () => {
  it('renders', () => {
    cy.mount(Alert, {
      props: {
        header: 'header',
      },
      slots: {
        default: 'content',
      },
    })

    cy.get('.vex-alert-header').should('have.text', 'header')
    cy.get('.vex-alert-content').should('have.text', 'content')
  })

  it('has correct aria attributes', () => {
    cy.mount(Alert, {
      props: {
        header: 'header',
      },
      slots: {
        default: 'content',
      },
    })

    cy.get('.vex-alert-header')
      .invoke('attr', 'id')
      .then((id) => {
        cy.get('.vex-alert').should('have.attr', 'aria-labelledby', id)
      })

    cy.get('.vex-alert-content')
      .invoke('attr', 'id')
      .then((id) => {
        cy.get('.vex-alert').should('have.attr', 'aria-describedby', id)
      })
  })

  it('renders header with header prop', () => {
    cy.mount(Alert, {
      props: {
        header: 'header',
      },
      slots: {
        default: 'content',
      },
    })

    cy.get('.vex-alert-header').should('have.text', 'header')
    cy.get('.vex-alert-content').should('have.text', 'content')
  })

  it('is not dismissible when dismissible prop is set to false', () => {
    cy.mount(Alert, {
      props: {
        header: 'header',
        dismissible: false,
      },
      slots: {
        default: 'content',
      },
    })

    cy.get('.vex-alert-close').should('not.exist')
  })

  it('emits dismiss event when dismiss button is clicked', async () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Alert, {
      props: {
        header: 'header',
        dismissible: true,
        onDismiss: onDismiss,
      },
      slots: {
        default: 'content',
      },
    })

    cy.get('.vex-alert-close').click()
    cy.get('@onDismiss').should('have.been.calledOnce')
  })
})
