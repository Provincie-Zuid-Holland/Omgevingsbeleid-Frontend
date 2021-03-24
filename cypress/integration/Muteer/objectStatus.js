import allDimensies from '../../../src/constants/dimensies'
import statusFlow from '../../../src/constants/beleidskeuzeStatusAanpassen'

// The dimension objects we will handle in the CRUD test
const dimensions = [allDimensies.BELEIDSKEUZES, allDimensies.MAATREGELEN]

describe('Dimension Status', () => {
    dimensions.forEach((dimensie, index) => {
        const titleSingular = dimensie.TITLE_SINGULAR.toLowerCase()
        const titlePlural = dimensie.TITLE_PLURAL.toLowerCase()
        const overzichtSlug = dimensie.SLUG_OVERVIEW
        const titelMeervoud = dimensie.TITLE_PLURAL.toLowerCase()
        const crudProperties = dimensie.CRUD_PROPERTIES

        it(`User can create a new '${titleSingular} with a status of 'Ontwerp GS Concept'`, () => {
            // Click on element to go to the overview page
            cy.get(`#sidebar-href-${titelMeervoud.replace(`'`, '')}`, {
                timeout: 20000,
            }).click()

            // Click on element to go to the CRUD page to create a new object
            cy.get(`#object-add-new-${overzichtSlug.toLowerCase()}`, {
                timeout: 20000,
            }).click()

            // Fill in the test values for every property
            Object.keys(crudProperties).forEach((key) => {
                const testValue = crudProperties[key].testValue
                const type = crudProperties[key].type
                const idOfElement = `#form-field-${titleSingular}-${key.toLowerCase()}`

                // ./commands.js
                cy.fillInFormField({ type, idOfElement, testValue })
            })

            // Submit form
            cy.get(`#form-submit`).click()

            cy.contains('Ontwerp GS Concept')
        })

        it(`User can toggle the popup to edit the status of '${titlePlural}`, () => {
            cy.get('#container-detail-dropdown-dots', {
                timeout: 10000,
            }).click()
            cy.contains('Status aanpassen').click()
            cy.get('#popup-edit-status').should('be.visible')
            cy.contains('Annuleren').click()
            cy.get('#popup-edit-status').should('not.exist')
        })

        it(`User can go through the status flow of '${titlePlural}`, () => {
            Object.keys(statusFlow).forEach((status) => {
                cy.get('#object-status')
                    .invoke('text')
                    .then((currentStatus) => {
                        if (currentStatus === 'Vigerend') return

                        cy.get('#container-detail-dropdown-dots').click()
                        cy.contains('Status aanpassen').click()

                        const possibleNextStatusses = statusFlow[currentStatus]
                        const selectValue = possibleNextStatusses[0]

                        cy.log('CURRENT VALUE')
                        cy.log(currentStatus)

                        cy.log('SELECT')
                        cy.log(selectValue)

                        cy.get('#popup-edit-status select').select(selectValue)
                        cy.contains('Aanpassen').click()

                        cy.get('#popup-edit-status').should('not.exist')

                        cy.contains(
                            `Status succesvol gewijzigd naar ${selectValue}`
                        ).should('exist')

                        cy.wait(250) // Wait till the DOM updates

                        cy.contains(new RegExp(selectValue, 'g'), {
                            timeout: 10000,
                        }).should('exist')
                    })
            })

            cy.visit('/muteer/dashboard')
        })
    })
})
