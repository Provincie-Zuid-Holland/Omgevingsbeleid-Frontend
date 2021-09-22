import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import "@testing-library/jest-dom"
import React from "react"

import MuteerDashboard from "./MuteerDashboard"

describe("MuteerDashboard", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <MuteerDashboard {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getAllByText("Mijn beleid")
        expect(element).toBeTruthy()
    })
})
