import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import BannerEnvironment from "./BannerEnvironment"
import { getEnvironmentText } from "./BannerEnvironment"

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

    const environment = process.env.REACT_APP_API_ENV
    const environmentText = getEnvironmentText(environment)

    it("Component renders", () => {
        setup()
        const element = screen.getByText(environmentText)
        expect(element).toBeTruthy()
    })
})
