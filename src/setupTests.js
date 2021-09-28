// src/setupTests.js
import { server } from "./mocks/server.js"
import { baseURL } from "./API/axios"

// Establish API mocking before all tests.
beforeAll(() => {
    server.listen()
    console.log(baseURL)
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
