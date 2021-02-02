import allDimensies from '../../../src/constants/dimensies'

const getSubUrl = (url, apiVersion) => url.slice(url.indexOf(`/` + apiVersion))

// The dimension objects we will handle in the CRUD test
const dimensions = [
    allDimensies.MAATREGELEN,
    allDimensies.BELEIDSBESLISSINGEN,
    allDimensies.OPGAVEN,
    allDimensies.AMBITIES,
    allDimensies.BELANGEN,
    allDimensies.BELEIDSREGELS,
    allDimensies.DOELEN,
    allDimensies.THEMAS,
]

beforeEach(() => cy.visit('/muteer/dashboard'))

describe('User can create, read and update the dimensions', () => {
    const apiVersion = Cypress.env('API_VERSION')

    // We declare an empty array to gather XHR responses
    const xhrData = []
    after(() => {
        // In record mode, save gathered XHR data to local JSON file
        if (Cypress.env('RECORD')) {
            const path = './cypress/fixtures/dimensies.json'
            cy.writeFile(path, xhrData)
        }
    })

    dimensions.forEach((dimensie) => {
        const overzichtSlug = dimensie.SLUG_OVERVIEW
        const titleSingular = dimensie.TITLE_SINGULAR.toLowerCase()
        const titelMeervoud = dimensie.TITLE_PLURAL.toLowerCase()
        const crudProperties = dimensie.CRUD_PROPERTIES

        it(`User can create a new '${titleSingular}'`, () => {
            cy.server({
                // Here we handle all requests passing through Cypress' server
                onResponse: (response) => {
                    if (Cypress.env('RECORD')) {
                        const url = getSubUrl(response.url, apiVersion)
                        const method = response.method
                        const data = response.response.body
                        // We push a new entry into the xhrData array
                        xhrData.push({ url, method, data })
                    }
                },
            })

            // This tells Cypress to hook into any GET request
            if (Cypress.env('RECORD')) {
                cy.route({
                    method: 'GET',
                    url: '*',
                })
                cy.route({
                    method: 'POST',
                    url: '*',
                })
            }

            if (!Cypress.env('RECORD')) {
                cy.fixture('dimensies').then((data) => {
                    data.forEach((request) => {
                        cy.route({
                            method: request.method,
                            url: request.url,
                            response: request.data,
                        })
                    })
                })
            }

            // Click on element to go to the overview page
            cy.get(`#sidebar-href-${titelMeervoud.replace(`'`, '')}`, {
                timeout: 10000,
            }).click()

            // Click on element to go to the CRUD page to create a new object
            cy.get(`#object-add-new-${overzichtSlug.toLowerCase()}`, {
                timeout: 10000,
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
        })
    })
})
