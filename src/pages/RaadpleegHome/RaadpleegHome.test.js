import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter } from "react-router-dom"
import GraphContext from "./../../App/GraphContext"

import RaadpleegHome from "./RaadpleegHome"

describe("RaadpleegHome", () => {
    const defaultProps = {}
    const setGraphIsOpenMock = jest.fn()

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
                    <RaadpleegHome {...props} />
                </GraphContext.Provider>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Omgevingsbeleid")
        expect(element).toBeTruthy()
    })

    it("Scrolls to the designated section on a click", () => {
        setup()

        const texts = [
            { text: "Hoe is het beleid opgebouwd?", selector: "span" },
            { text: "Beleid op de kaart", selector: "span" },
            { text: "Liever zoeken op de kaart? Dat kan!", selector: "span" },
            { text: "Liever zoeken op de tekst? Dat kan!", selector: "span" },
        ]
        texts.forEach((item) => {
            const scrollMock = jest.fn()
            window.scrollTo = scrollMock
            const element = screen.getByText(item.text, {
                selector: item.selector,
            })
            fireEvent.click(element)
            expect(scrollMock).toHaveBeenCalled()
        })
    })

    it("User can open te map", () => {
        setup()

        const element = screen.getByText("Netwerkvisualisatie van het beleid", {
            selector: "span",
        })
        fireEvent.click(element)
        expect(setGraphIsOpenMock).toHaveBeenCalled()
    })
})
