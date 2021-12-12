import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import React from "react"

import RaadpleegInProgress from "./RaadpleegInProgress"

describe("RaadpleegInProgress", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegInProgress {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("In bewerking")
        expect(element).toBeTruthy()
    })
})
