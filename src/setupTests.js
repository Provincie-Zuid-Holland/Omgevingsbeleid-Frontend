// src/setupTests.js
import { server } from "./mocks/server.js"

// https://stackoverflow.com/questions/54382414/fixing-react-leaflet-testing-error-cannot-read-property-layeradd-of-null/54384719#54384719
var createElementNSOrig = global.document.createElementNS
global.document.createElementNS = function (namespaceURI, qualifiedName) {
    if (
        namespaceURI === "http://www.w3.org/2000/svg" &&
        qualifiedName === "svg"
    ) {
        var element = createElementNSOrig.apply(this, arguments)
        element.createSVGRect = function () {}
        return element
    }
    return createElementNSOrig.apply(this, arguments)
}

// Establish API mocking before all tests.
beforeAll(() => {
    server.listen()
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
