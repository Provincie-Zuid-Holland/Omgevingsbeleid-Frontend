// src/setupTests.js
import { server } from './mocks/server'

// https://stackoverflow.com/questions/54382414/fixing-react-leaflet-testing-error-cannot-read-property-layeradd-of-null/54384719#54384719
const createElementNSOrig = global.document.createElementNS
global.document.createElementNS = function (namespaceURI, qualifiedName) {
    if (
        namespaceURI === 'http://www.w3.org/2000/svg' &&
        qualifiedName === 'svg'
    ) {
        const element = createElementNSOrig.apply(this, arguments)
        element.createSVGRect = function () {}
        return element
    }
    return createElementNSOrig.apply(this, arguments)
}

const createMockMediaMatcher = matches => qs => ({
    matches: matches[qs] ?? false,
    addListener: () => {},
    removeListener: () => {},
})

// Mock IntersectionObserver
class IntersectionObserver {
    observe = jest.fn()
    disconnect = jest.fn()
    unobserve = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
})

Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
})

// Establish API mocking before all tests.
beforeAll(() => {
    server.listen()

    window.matchMedia = createMockMediaMatcher({
        '(min-width: 500px)': true,
        '(min-width: 1000px)': false,
    })
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
