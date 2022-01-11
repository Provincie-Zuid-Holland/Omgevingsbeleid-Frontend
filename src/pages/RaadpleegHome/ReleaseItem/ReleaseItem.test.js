import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import ReleaseItem from "./ReleaseItem"

describe("ReleaseItem", () => {
    const defaultProps = {
        date: "01-01-2030",
        releaseNumber: "01",
        releaseNotes: ["Note 1"],
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<ReleaseItem {...props} />)
    }

    it("Component renders and displays information", () => {
        setup()

        const date = screen.getByText("01-01-2030")
        expect(date).toBeTruthy()

        const releaseNumber = screen.getByText("Release 01")
        expect(releaseNumber).toBeTruthy()

        const releaseNote = screen.getByText("Note 1")
        expect(releaseNote).toBeTruthy()
    })
})
