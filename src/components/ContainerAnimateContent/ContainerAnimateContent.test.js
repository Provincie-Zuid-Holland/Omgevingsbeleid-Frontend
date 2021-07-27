import { render, screen } from "@testing-library/react"
import React from "react"
import ContainerAnimateContent from "./ContainerAnimateContent"

describe("ContainerAnimateContent", () => {
    it("should render", () => {
        render(
            <ContainerAnimateContent>
                <div>Test div</div>
            </ContainerAnimateContent>
        )

        const title = screen.getByText("Test div")
        expect(title).toBeTruthy()
    })
})
