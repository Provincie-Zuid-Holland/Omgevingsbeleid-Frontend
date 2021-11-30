import { render } from "@testing-library/react"
import React from "react"
import Foutpagina from "./Foutpagina"
import { MemoryRouter } from "react-router-dom"

describe("Foutpagina", () => {
    it("should render", () => {
        const component = render(
            <MemoryRouter>
                <Foutpagina />
            </MemoryRouter>
        )

        expect(component).toBeTruthy()
    })
})
