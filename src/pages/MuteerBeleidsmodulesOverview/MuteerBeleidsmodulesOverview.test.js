import { render, screen } from "@testing-library/react"
import React from "react"
import { MemoryRouter, Route } from "react-router-dom"

import MuteerBeleidsmodulesOverview from "./MuteerBeleidsmodulesOverview"

describe("MuteerBeleidsmodulesOverview", () => {
    const defaultProps = {}

    const path = `/muteer/beleidsmodules/edit/1`
    const initialEntries = `/muteer/beleidsmodules/edit/1`

    it("should render", () => {
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <MuteerBeleidsmodulesOverview {...defaultProps} />)
                </Route>
            </MemoryRouter>
        )
        const text = screen.getByText("Module")
        expect(text).toBeTruthy()
    })
})
