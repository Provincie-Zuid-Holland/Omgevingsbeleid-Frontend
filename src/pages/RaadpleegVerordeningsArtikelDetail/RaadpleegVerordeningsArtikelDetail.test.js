import {
    waitForElementToBeRemoved,
    render,
    screen,
    fireEvent,
} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter, Route } from "react-router-dom"

import allDimensies from "./../../constants/dimensies"
import RaadpleegVerordeningsArtikelDetail from "./RaadpleegVerordeningsArtikelDetail"

jest.mock("./../../components/LeafletTinyViewer", () => () =>
    "LeafletTinyViewer"
)

describe("RaadpleegVerordeningsArtikelDetail", () => {
    const defaultProps = {
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        history: {
            length: 8,
            action: "POP",
            location: {
                pathname:
                    "/detail/verordeningen/1/7F7CFF43-DCBD-46DE-A93A-1FDDF4FE921A",
                search: "?hoofdstuk=0&nest_1=0&nest_2=null&nest_3=null",
                hash: "",
                key: "z33z1l",
            },
        },
        location: {
            pathname:
                "/detail/verordeningen/1/7F7CFF43-DCBD-46DE-A93A-1FDDF4FE921A",
            search: "?hoofdstuk=0&nest_1=0&nest_2=null&nest_3=null",
            hash: "",
            key: "z33z1l",
        },
        match: {
            path: "/detail/verordeningen/:lineageID/:objectUUID",
            url: "/detail/verordeningen/1/7F7CFF43-DCBD-46DE-A93A-1FDDF4FE921A",
            isExact: true,
            params: {
                lineageID: "1",
                objectUUID: "7F7CFF43-DCBD-46DE-A93A-1FDDF4FE921A",
            },
        },
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/detail/verordeningen/:lineageID/:objectUUID`
        const initialEntries = `/detail/verordeningen/1/7F7CFF43-DCBD-46DE-A93A-1FDDF4FE921A?hoofdstuk=0&nest_1=0&nest_2=null&nest_3=null`
        window.scrollTo = jest.fn()

        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <RaadpleegVerordeningsArtikelDetail {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText("Terug naar startpagina")
        expect(element).toBeTruthy()
    })

    it("Component displays verordenings artikel", async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.getAllByRole("img"))

        const title = screen.getByText("Begripsbepalingen")
        expect(title).toBeTruthy()
    })
})
