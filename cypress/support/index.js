// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

const getSubUrl = (url, apiVersion) => url.slice(url.indexOf(`/` + apiVersion))

beforeEach(() => {
    const recordAPI = Cypress.env('RECORD')
    const apiVersion = Cypress.env('API_VERSION')
    /** 
    Login before each test
    **/

    // We declare an empty array to gather XHR responses
    const xhrData = []
    after(() => {
        // In record mode, save gathered XHR data to local JSON file
        if (recordAPI) {
            const path = './cypress/fixtures/login.json'
            cy.writeFile(path, xhrData)
        }
    })

    cy.server({
        // Here we handle all requests passing through Cypress' server
        onResponse: (response) => {
            if (recordAPI) {
                const url = getSubUrl(response.url, apiVersion)
                const method = response.method
                const data = response.response.body
                // We push a new entry into the xhrData array
                xhrData.push({ url, method, data })
            }
        },
    })

    // This tells Cypress to hook into any GET request
    if (recordAPI) {
        cy.route({
            method: 'POST',
            url: '*',
        })
        cy.route({
            method: 'GET',
            url: '*',
        })
    }

    if (!recordAPI) {
        cy.log('Go!')
        cy.fixture('login').then((data) => {
            data.forEach((request) => {
                cy.route({
                    method: request.method,
                    url: request.url,
                    response: request.data,
                })
            })
        })
    }

    cy.visit('/login')

    cy.get('#aan-de-slag-close-popup').click()

    cy.get('#form-field-login-email')
        .type('hello@aidenbuis.com')
        .should('have.value', 'hello@aidenbuis.com')

    cy.get('#form-field-login-password')
        .type('L8feCaDGkcVI3OYqjJG0sqe1vfh0UpzsQ5PizcRxmsr7wdMsAQ')
        .should(
            'have.value',
            'L8feCaDGkcVI3OYqjJG0sqe1vfh0UpzsQ5PizcRxmsr7wdMsAQ'
        )

    // Give an alias to request
    cy.server().route('POST', '/v0.1/login').as('login')

    // POST login info
    cy.get('#form-field-login-submit').click()

    // Wait for response.status to be 200
    cy.wait('@login').its('status').should('be', 200)

    cy.url().should('include', '/muteer/dashboard')
})
