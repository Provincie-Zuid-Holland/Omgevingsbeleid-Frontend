import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter, Route } from "react-router-dom"

import RaadpleegObjectDetail from "./RaadpleegObjectDetail"

import allDimensies from "../../constants/dimensies"
import { beleidskeuzes } from "../../mocks/data/beleidskeuzes"

describe("RaadpleegObjectDetail", () => {
    const mockBeleidskeuze = beleidskeuzes[0]
    const defaultProps = {
        dataModel: allDimensies.BELEIDSKEUZES,
    }

    window.scrollTo = jest.fn()

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/detail/beleidskeuzes/:id`
        const initialEntries = `/detail/beleidskeuzes/${mockBeleidskeuze.UUID}`
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <RaadpleegObjectDetail {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it("Component renders", async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.queryByRole("img"))
        const element = screen.getByText("Beleidskeuze")
        expect(element).toBeTruthy()
    })

    it("Component displays correct properties", async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.queryByRole("img"))

        const title = screen.getByText(mockBeleidskeuze.Titel)
        expect(title).toBeTruthy()
    })
})
