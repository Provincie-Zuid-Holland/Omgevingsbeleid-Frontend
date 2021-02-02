import './commands'

// Gather Local Storage
// We use this to keep logged in
let LOCAL_STORAGE_MEMORY = {}
const localStoragePath = './cypress/support/localStorage.json'

Cypress.Commands.add('saveLocalStorage', () => {
    Object.keys(localStorage).forEach((key) => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })

    cy.writeFile(localStoragePath, LOCAL_STORAGE_MEMORY)
})

Cypress.Commands.add('restoreLocalStorage', () => {
    cy.readFile(localStoragePath).then((savedLocalStorage) => {
        Object.keys(savedLocalStorage).forEach((key) => {
            localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
        })
    })
})

const getSubUrl = (url, apiVersion) => url.slice(url.indexOf(`/` + apiVersion))

// Gather XHR responses
const XHR_DATA = []
const XHRDataPath = './cypress/fixtures/login.json'

const login = () => {
    cy.visit('/login')

    cy.get('#aan-de-slag-close-popup', { timeout: 10000 }).click()

    cy.get('#form-field-login-email')
        .type(Cypress.env('USERNAME'))
        .should('have.value', Cypress.env('USERNAME'))

    cy.get('#form-field-login-password')
        .type(Cypress.env('PASSWORD'))
        .should('have.value', Cypress.env('PASSWORD'))

    // POST login info
    cy.get('#form-field-login-submit').click()
}

beforeEach(() => {
    cy.restoreLocalStorage()

    const recordAPI = Cypress.env('RECORD')
    const apiVersion = Cypress.env('API_VERSION')

    cy.server({
        // Here we handle all requests passing through Cypress' server
        onResponse: (response) => {
            if (recordAPI) {
                const url = getSubUrl(response.url, apiVersion)
                const method = response.method
                const data = response.response.body
                // We push a new entry into the XHR_DATA array
                XHR_DATA.push({ url, method, data })
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

    // If the recordAPI environment variable is false we implement the fixtures
    if (!recordAPI) {
        cy.fixture('login').then((data) => {
            data.forEach((request) => {
                cy.route({
                    method: request.method,
                    url: request.url,
                    response: request.data,
                })
            })
        })
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

    cy.readFile(localStoragePath).then((savedLocalStorage) => {
        const accessTokenProperty = Cypress.env('ACCESS_TOKEN')
        if (!savedLocalStorage[accessTokenProperty]) {
            login()
        }
    })
})

afterEach(() => {
    cy.saveLocalStorage()
})

before(() => {
    // Clean out local storage
    cy.writeFile(localStoragePath, {})
})

after(() => {
    const recordAPI = Cypress.env('RECORD')

    // In record mode, save gathered XHR data to local JSON file
    if (recordAPI) {
        cy.writeFile(XHRDataPath, XHR_DATA)
    }

    // Clean out local storage
    cy.writeFile(localStoragePath, {})
})
