import { render } from "@testing-library/react"
import React from "react"
import ButtonBackToPage from "./ButtonBackToPage"
import { MemoryRouter } from "react-router-dom"

describe("ButtonBackToPage", () => {
    it("should render", () => {
        const { queryByText } = render(
            <MemoryRouter>
                <ButtonBackToPage
                    terugNaar="pagina"
                    color="bg-red-500"
                    url="/homepage"
                />
            </MemoryRouter>
        )
        expect(queryByText("Terug naar pagina")).toBeTruthy()
    })
})
