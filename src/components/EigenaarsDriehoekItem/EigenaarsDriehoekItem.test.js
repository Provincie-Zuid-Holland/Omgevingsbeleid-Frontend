import { render, screen } from "@testing-library/react"
import React from "react"
import EigenaarsDriehoekItem from "./EigenaarsDriehoekItem"

describe("EigenaarsDriehoekItem", () => {
    it("should render", () => {
        render(
            <EigenaarsDriehoekItem
                owner={{ Gebruikersnaam: "Opdrachtgever_test" }}
            />
        )

        const opdrachtgever = screen.getByText("Opdrachtgever_test")
        expect(opdrachtgever).toBeTruthy()
    })
})
