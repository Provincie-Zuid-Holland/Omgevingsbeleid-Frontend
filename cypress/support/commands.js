Cypress.Commands.add('fillInFormField', ({ type, idOfElement, testValue }) => {
    switch (type) {
        case 'hidden':
            // Value of property is automatically generated
            return
        case 'react select':
            cy.get(idOfElement, { timeout: 10000 })
                .click()
                .type(testValue + '{enter}')

            return
        case 'date input':
            cy.get(idOfElement, { timeout: 10000 })
                .type(testValue)
                .should('have.value', testValue)
            break
        case 'text input':
            cy.get(idOfElement, { timeout: 10000 })
                .type(testValue)
                .should('have.value', testValue)
            break
        case 'select':
            cy.get(idOfElement, { timeout: 10000 })
                .select(testValue)
                .should('have.value', testValue)
            break
        case 'werkingsgebied':
            cy.get(idOfElement, { timeout: 10000 }).click()

            cy.get('#form-field-werkingsgebied-zoekbalk').type(
                'Provincie Zuid-Holland'
            )

            cy.get('.werkingsgebied-container div', {
                timeout: 10000,
            })
                .first()
                .click()

            cy.get('#selected-werkingsgebied').should('exist')

            break
        case 'radio input':
            cy.get(idOfElement, { timeout: 10000 })
                .get('[type="radio"]')
                .check(testValue)
                .should('be.checked')
            break
        case 'rich text editor':
            cy.get(idOfElement, { timeout: 10000 })
                .type('{selectall}' + testValue)
                .contains(testValue)
                .should('exist')
            break
        default:
            cy.log('Default break')
            break
    }
})
