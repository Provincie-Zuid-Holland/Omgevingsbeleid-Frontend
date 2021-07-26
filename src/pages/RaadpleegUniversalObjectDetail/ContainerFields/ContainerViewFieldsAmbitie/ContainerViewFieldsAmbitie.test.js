import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import ContainerViewFieldsAmbitie from "./ContainerViewFieldsAmbitie"

describe("ContainerViewFieldsAmbitie", () => {
    const defaultProps = {
        crudObject: { Omschrijving: "Test omschrijving" },
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContainerViewFieldsAmbitie {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Test omschrijving")
        expect(element).toBeTruthy()
    })
})
