import allDimensies from './../../../src/constants/dimensies'

const getSubUrl = (url, apiVersion) => url.slice(url.indexOf(`/` + apiVersion))

// Create array with detail pages to map through to create the routes
const dimensies = [
    {
        slug: 'ambities',
        dataModel: allDimensies.AMBITIES,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
    },
    {
        slug: 'doelen',
        dataModel: allDimensies.DOELEN,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSBESLISSINGEN,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
    },
    {
        slug: 'opgaven',
        dataModel: allDimensies.OPGAVEN,
    },
]

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

    dimensies.forEach((dimensie, index) => {
        if (index > 0) return

        const overzichtSlug = dimensie.dataModel.SLUG_OVERZICHT
        const titelEnkelvoud = dimensie.dataModel.TITEL_ENKELVOUD.toLowerCase()
        const titelMeervoud = dimensie.dataModel.TITEL_MEERVOUD.toLowerCase()
        const apiEndpoint = dimensie.dataModel.API_ENDPOINT
        const crudProperties = dimensie.dataModel.CRUD_PROPERTIES

        it(`User can create a new '${titelEnkelvoud}'`, () => {
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
                    // for (let i = 0, length = data.length; i < length; i++) {
                    //     cy.route(data[i].method, data[i].url, data[i].data)
                    // }
                })
            }

            // Give alliasses to routes so we can wait on them
            cy.server().route('POST', `/v0.1/${apiEndpoint}`).as('POSTdimensie')
            cy.server()
                .route('GET', `/v0.1/${apiEndpoint}`)
                .as('dimensieGetAll')
            cy.server()
                .route('GET', `/v0.1/${apiEndpoint}/**`)
                .as('getDimensieLineage')
            cy.server()
                .route('GET', `/v0.1/${apiEndpoint}/version/**`)
                .as('getDimensieVersion')

            // Click on element to go to the overview page
            cy.get(`#sidebar-href-${titelMeervoud}`).click()

            cy.wait(`@dimensieGetAll`).its('status').should('be', 200)

            // Click on element to go to the CRUD page to create a new object
            cy.get(`#object-add-new-${overzichtSlug.toLowerCase()}`).click()

            // Fill in the test values for every property
            Object.keys(crudProperties).forEach((key) => {
                const testValue = crudProperties[key].testValue
                const type = crudProperties[key].type
                cy.get(`#form-field-${titelEnkelvoud}-${key.toLowerCase()}`).as(
                    'element'
                )

                switch (type) {
                    case 'text input' || 'date input':
                        cy.get(`@element`)
                            .type(testValue)
                            .should('have.value', testValue)
                        break
                    case 'select':
                        cy.get(`@element`)
                            .select(testValue)
                            .should('have.value', testValue)
                        break
                    case 'radio input':
                        cy.get(`@element`)
                            .get(
                                `form-field-${titelEnkelvoud}-${key.toLowerCase()}-${option}`
                            )
                            .click(testValue)
                            .should('have.value', testValue)
                        break
                    default:
                        break
                }
            })

            // Submit form
            cy.get(`#form-submit`).click()

            cy.wait(`@POSTdimensie`).its('status').should('be', 200)
        })
    })
})
