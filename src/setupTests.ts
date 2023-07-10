/* eslint-disable prefer-rest-params */
import matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

import { server } from './mocks/server'

expect.extend(matchers)

// https://stackoverflow.com/questions/54382414/fixing-react-leaflet-testing-error-cannot-read-property-layeradd-of-null/54384719#54384719
const createElementNSOrig = global.document.createElementNS
//@ts-ignore
global.document.createElementNS = function (
    namespaceURI: string,
    qualifiedName: string
) {
    if (
        namespaceURI === 'http://www.w3.org/2000/svg' &&
        qualifiedName === 'svg'
    ) {
        //@ts-ignore
        const element = createElementNSOrig.apply(this, arguments) as any
        element.createSVGRect = function () {}
        return element
    }
    //@ts-ignore
    return createElementNSOrig.apply(this, arguments)
}

// Mock IntersectionObserver
class IntersectionObserver {
    observe = vi.fn()
    disconnect = vi.fn()
    unobserve = vi.fn()
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

    window.matchMedia = query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
