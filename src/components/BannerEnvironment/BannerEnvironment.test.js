import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import BannerEnvironment from "./BannerEnvironment"

describe("BannerEnvironment", () => {
    const hideBannerLocalStorageMock = jest.fn()
    const defaultProps = {
        hideBannerLocalStorage: hideBannerLocalStorageMock,
        userIsInMuteerEnvironment: true,
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<BannerEnvironment {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Ontwikkelomgeving")
        expect(element).toBeTruthy()
    })
})
