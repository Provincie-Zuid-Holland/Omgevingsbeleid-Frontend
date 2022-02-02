import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import Pagination from "./Pagination"

describe("Pagination", () => {
    const setSearchResultsMock = jest.fn()
    const defaultProps = {
        searchResults: [],
        setSearchResults: setSearchResultsMock,
    }

    const setup = (customProps) => {
        const props = customProps
            ? { ...defaultProps, ...customProps }
            : defaultProps
        render(<Pagination {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Meer resultaten Laden")
        expect(element).toBeTruthy()
    })
})
