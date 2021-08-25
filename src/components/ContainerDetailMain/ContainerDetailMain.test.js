import { render, screen } from "@testing-library/react"
import React from "react"
import ContainerDetailMain from "./ContainerDetailMain"
import { MemoryRouter } from "react-router-dom"

describe("ContainerDetailMain", () => {
    it("should render", () => {
        render(
            <MemoryRouter>
                <ContainerDetailMain
                    dataObject={{ Titel: "Title of object" }}
                    titleSingular={"titel"}
                    pageType={"detail"}
                    dataReceived={true}
                />
            </MemoryRouter>
        )

        const title = screen.getByText("Title of object")
        expect(title).toBeTruthy()
    })
})
