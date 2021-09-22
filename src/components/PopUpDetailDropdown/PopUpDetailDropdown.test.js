import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import "@testing-library/jest-dom"
import React from "react"

import PopUpDetailDropdown from "./PopUpDetailDropdown"
import { beleidskeuzes } from "./../../mocks/data/beleidskeuzes"

describe("PopUpDetailDropdown", () => {
    const setDataObjectMock = jest.fn()
    const toggleDropdownMock = jest.fn()
    const toggleStatusPopupMock = jest.fn()
    const toggleModulesPopupMock = jest.fn()

    const defaultProps = {
        slug: "slug",
        titleSingular: "titleSingular",
        raadpleegLink: `/detail/slug/01`,
        dataObject: beleidskeuzes[0],
        setDataObject: setDataObjectMock,
        openState: true,
        toggleDropdown: toggleDropdownMock,
        toggleStatusPopup: toggleStatusPopupMock,
        toggleModulesPopup: toggleModulesPopupMock,
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <div>
                    <PopUpDetailDropdown {...props} />
                    <div>Element outside</div>
                </div>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Status aanpassen")
        expect(element).toBeTruthy()
    })

    it("User can change the status", () => {
        setup()
        const status = screen.getByText("Status aanpassen")
        fireEvent.click(status)
        expect(toggleDropdownMock).toHaveBeenCalledTimes(1)
        expect(toggleStatusPopupMock).toHaveBeenCalledTimes(1)
    })

    it("User can close the dropdown by clicking outside", () => {
        document.addEventListener = jest
            .fn()
            .mockImplementationOnce((event, callback) => {
                callback(event)
            })
        setup()
        const elementOutside = screen.getByText("Element outside")
        fireEvent.click(elementOutside)
        expect(document.addEventListener).toHaveBeenCalledTimes(1)
        expect(toggleDropdownMock).toHaveBeenCalledTimes(1)
    })
})
