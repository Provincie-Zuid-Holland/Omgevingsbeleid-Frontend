import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import TableOfContents from "./TableOfContents"

describe("TableOfContents", () => {
    const defaultProps = { display: "block" }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<TableOfContents {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Op deze pagina")
        expect(element).toBeTruthy()
    })
})
