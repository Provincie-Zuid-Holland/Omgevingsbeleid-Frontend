import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import LoaderSpinner from "./LoaderSpinner"

describe("LoaderSpinner", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSpinner {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByRole("img", { hidden: true })
        expect(element).toBeTruthy()
    })
})
