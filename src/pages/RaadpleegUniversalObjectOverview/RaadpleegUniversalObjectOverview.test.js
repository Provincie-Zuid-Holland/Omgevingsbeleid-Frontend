import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import allDimensies from "./../../constants/dimensies"
import { QueryClient, QueryClientProvider } from "react-query"

import RaadpleegUniversalObjectOverview from "./RaadpleegUniversalObjectOverview"
import { MemoryRouter } from "react-router-dom"

const queryClient = new QueryClient()

describe("RaadpleegUniversalObjectOverview", () => {
    const defaultProps = {
        dataModel: allDimensies.BELEIDSKEUZES,
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <RaadpleegUniversalObjectOverview {...props} />
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Beleidskeuzes")
        expect(element).toBeTruthy()
    })
})
