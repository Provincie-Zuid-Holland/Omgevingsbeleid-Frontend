import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import Foutpagina from "../pages/Foutpagina"
import { MemoryRouter } from "react-router-dom"

const Child = () => {
    throw new Error()
}

const App = () => {
    return (
        <MemoryRouter>
            <ErrorBoundary FallbackComponent={Foutpagina}>
                <Child />
            </ErrorBoundary>
        </MemoryRouter>
    )
}

describe("Error Boundary", () => {
    beforeEach(() => {
        render(<App />)
    })

    it("should trigger the Error Boundary when an error occurs", () => {
        expect(screen.getByTestId(`errorboundary`)).toBeVisible
    })
})
