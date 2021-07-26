import {
    render,
    waitForElementToBeRemoved,
    screen,
    fireEvent,
} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import MuteerUniversalObjectDetailWithStatuses from "./MuteerUniversalObjectDetailWithStatuses"

import allDimensies from "./../../constants/dimensies"
import { MemoryRouter, Route } from "react-router-dom"

describe("MuteerUniversalObjectDetailWithStatuses", () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
    }

    const setup = (customProps) => {
        const path = `/muteer/beleidskeuzes/:single`
        const initialEntries = `/muteer/beleidskeuzes/728`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <MuteerUniversalObjectDetailWithStatuses {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it("Component renders", async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.queryByRole("img"))
        const header = screen.getByText("Bovenregionaal warmtenetwerk")
        expect(header).toBeTruthy()
    })
})
