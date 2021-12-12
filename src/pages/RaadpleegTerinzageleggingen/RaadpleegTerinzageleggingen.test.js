import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import RaadpleegTerinzageleggingen from "./RaadpleegTerinzageleggingen"
import { MemoryRouter } from "react-router-dom"

describe("RaadpleegTerinzageleggingen", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegTerinzageleggingen {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Terinzageleggingen")
        expect(element).toBeTruthy()
    })
})
