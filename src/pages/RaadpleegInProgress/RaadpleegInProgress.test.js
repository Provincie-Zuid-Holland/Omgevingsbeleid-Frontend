import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import React from "react"

import RaadpleegInProgress from "./RaadpleegInProgress"

const queryClient = new QueryClient()

describe("RaadpleegInProgress", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RaadpleegInProgress {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("In bewerking")
        expect(element).toBeTruthy()
    })
})
