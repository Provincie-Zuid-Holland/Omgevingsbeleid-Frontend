import { render } from "@testing-library/react"
import React from "react"
import Foutpagina from "./Foutpagina"

describe("Foutpagina", () => {
    it("should render", () => {
        const component = render(<Foutpagina />)

        expect(component).toBeTruthy()
    })
})
