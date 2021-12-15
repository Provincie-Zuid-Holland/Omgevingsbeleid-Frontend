import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import Breadcrumbs from "./Breadcrumbs"

describe("Breadcrumbs", () => {
    const defaultProps = {
        paths: [
            { name: "Home", path: "/" },
            { name: "Another page", path: "/" },
            {
                name: "Digitale toegankelijkheid",
                path: "/digi-toegankelijkheid",
            },
        ],
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<Breadcrumbs {...props} />)
    }

    it("Component renders", () => {
        setup()

        const firstEl = screen.getByText("Home")
        expect(firstEl).toBeTruthy()

        const secondEl = screen.getByText("Another page")
        expect(secondEl).toBeTruthy()

        const thirdEl = screen.getByText("Digitale toegankelijkheid")
        expect(thirdEl).toBeTruthy()
    })
})
