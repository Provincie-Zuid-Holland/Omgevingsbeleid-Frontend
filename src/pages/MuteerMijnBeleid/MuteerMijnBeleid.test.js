import {
    render,
    waitForElementToBeRemoved,
    screen,
} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import "@testing-library/jest-dom"
import React from "react"

import MuteerMijnBeleid from "./MuteerMijnBeleid"

describe("MuteerMijnBeleid", () => {
    const defaultProps = {
        authUser: {
            UUID: "0000-0000-0000-0000",
        },
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <MuteerMijnBeleid {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getAllByText("Mijn beleid")
        expect(element).toBeTruthy()
    })
})
