import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import React from "react"

import Navigation from "./Navigation"
import GraphContext from "./../../App/GraphContext"

jest.mock("./../NetworkGraph", () => () => null)

describe("Navigation", () => {
    const setLoginStateMock = jest.fn()
    const setGraphIsOpenMock = jest.fn()
    const defaultProps = {
        setLoginState: setLoginStateMock,
        loggedIn: false,
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <GraphContext.Provider
                    value={{
                        graphIsOpen: false,
                        setGraphIsOpen: setGraphIsOpenMock,
                    }}
                >
                    <Navigation {...props} />
                </GraphContext.Provider>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const search = screen.getByPlaceholderText(
            "Zoek in het omgevingsbeleid"
        )
        expect(search).toBeTruthy()
    })

    it("Toggles the menu", async () => {
        setup()
        const button = screen.getByRole("button")
        expect(button).toBeTruthy()
        fireEvent.click(button)
        const popupTitle = await screen.queryByText("Omgevingsvisie")
        expect(popupTitle).toBeTruthy()
    })
})
