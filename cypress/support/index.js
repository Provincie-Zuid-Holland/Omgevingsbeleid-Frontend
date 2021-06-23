import './commands'

const login = () => {
    cy.visit('/login')

    cy.get('#aan-de-slag-close-popup', { timeout: 10000 }).click()

    cy.get('#form-field-login-email')
        .type(Cypress.env('USERNAME'))
        .should('have.value', Cypress.env('USERNAME'))

    cy.get('#form-field-login-password')
        .type(Cypress.env('PASSWORD'))
        .should('have.value', Cypress.env('PASSWORD'))

    cy.get('#form-field-login-submit').click()
    cy.contains('Mijn beleid', { timeout: 10000 }).should('exist')
}

beforeEach(() => {
    login()
})
