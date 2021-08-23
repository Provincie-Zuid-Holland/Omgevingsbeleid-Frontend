import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import Werkingsgebied from "./Werkingsgebied"

describe("Werkingsgebied", () => {
    const defaultProps = {
        fullscreenLeafletViewer: false,
        werkingsGebiedUUID: "86689750-475C-4067-9170-4FD906B83BED",
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<Werkingsgebied {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Werkingsgebied")
        expect(element).toBeTruthy()
    })
})
