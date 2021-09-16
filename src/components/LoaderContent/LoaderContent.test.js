import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import LoaderContent from "./LoaderContent"

describe("LoaderContent", () => {
    const defaultProps = {}

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderContent {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByRole("img")
        expect(element).toBeTruthy()
    })
})
