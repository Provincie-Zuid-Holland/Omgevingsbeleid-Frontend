import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter } from "react-router-dom"

import NavigationPopupMenu from "./NavigationPopupMenu"

describe("NavigationPopupMenu", () => {
    const setIsOpenMock = jest.fn()
    const defaultProps = {
        showBanner: false,
        isOpen: true,
        setIsOpen: setIsOpenMock,
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <NavigationPopupMenu {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Omgevingsvisie")
        expect(element).toBeTruthy()
    })
})
