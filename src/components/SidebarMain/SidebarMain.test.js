import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import React from "react"

import SidebarMain from "./SidebarMain"

describe("SidebarMain", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <SidebarMain {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText(
            "In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid."
        )
        expect(element).toBeTruthy()
    })
})
