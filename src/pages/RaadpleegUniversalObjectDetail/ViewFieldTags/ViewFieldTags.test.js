import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import ViewFieldTags from "./ViewFieldTags"

describe("ViewFieldTags", () => {
    const defaultProps = {
        fieldValue: [{ value: "Test one" }, { value: "Test two" }],
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<ViewFieldTags {...props} />)
    }

    it("Component renders", () => {
        setup()
        const itemOne = screen.getByText("Test one")
        expect(itemOne).toBeTruthy()

        const itemTwo = screen.getByText("Test two")
        expect(itemTwo).toBeTruthy()
    })

    it("Component renders null when fieldValue is falsy", () => {
        setup({ fieldValue: null })
        const itemOne = screen.queryByText("Test one")
        expect(itemOne).toBeFalsy()
    })
})
