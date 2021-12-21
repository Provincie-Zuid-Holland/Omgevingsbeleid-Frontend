import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import RaadpleegDigiToegankelijkheid from "./RaadpleegDigiToegankelijkheid"
import { MemoryRouter } from "react-router-dom"

describe("RaadpleegDigiToegankelijkheid", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegDigiToegankelijkheid {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Toegankelijkheidsverklaring")
        expect(element).toBeTruthy()
    })
})
