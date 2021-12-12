import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter } from "react-router-dom"

import SearchSection from "./SearchSection"

describe("SearchSection", () => {
    const setup = () => {
        render(
            <MemoryRouter>
                <SearchSection />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Naar welk onderwerp bent u opzoek?")
        expect(element).toBeTruthy()
    })
})
