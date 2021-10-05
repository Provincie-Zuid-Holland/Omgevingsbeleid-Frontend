import {
    render,
    screen,
    waitForElementToBeRemoved,
    fireEvent,
} from "@testing-library/react"
import { MemoryRouter, Route } from "react-router-dom"
import "@testing-library/jest-dom"
import React from "react"

import { revisionDataObject } from "./../../mocks/data/revisionDataObject"
import { revisionObjects } from "./../../mocks/data/revisionObjects"

import PopUpRevisionContainer from "./PopUpRevisionContainer"

describe("PopUpRevisionContainer", () => {
    const defaultProps = {
        dataObject: revisionDataObject,
        revisionObjects: revisionObjects,
        titleSingular: "Beleidskeuze",
    }

    const path = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`
    const initialEntries = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <div>
                        <PopUpRevisionContainer {...props} />
                        <span>Element outside</span>
                    </div>
                </Route>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText(`4 revisies`)
        expect(element).toBeTruthy()
    })

    it("User can toggle the popup", async () => {
        setup()
        const element = screen.getByText(`4 revisies`)
        fireEvent.click(element)
        const title = await screen.findByText("Vergelijken")
        expect(title).toBeTruthy()
        fireEvent.click(title)
        await waitForElementToBeRemoved(() => screen.queryByText("Vergelijken"))
    })
})
