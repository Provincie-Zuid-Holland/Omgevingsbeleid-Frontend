import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Route } from "react-router-dom"
import "@testing-library/jest-dom"
import React from "react"

import BackButton from "./BackButton"

describe("BackButton", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                {/* <Route path={path}> */}
                <BackButton {...props} />
                {/* </Route> */}
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Terug")
        expect(element).toBeTruthy()
    })
})
