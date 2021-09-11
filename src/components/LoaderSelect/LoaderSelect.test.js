import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import LoaderSelect from "./LoaderSelect"

describe("LoaderSelect", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSelect {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByRole("img")
        expect(element).toBeTruthy()
    })
})