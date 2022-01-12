import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter, Route } from "react-router-dom"
import React from "react"

import RaadpleegObjectDetailSidebar from "./RaadpleegObjectDetailSidebar"

describe("RaadpleegObjectDetailSidebar", () => {
    const defaultProps = {
        dataObject: {
            Status: "In bewerking",
        },
    }

    const setup = (customProps) => {
        const path = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`
        const initialEntries = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`

        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <RaadpleegObjectDetailSidebar {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Type")
        expect(element).toBeTruthy()
    })
})
