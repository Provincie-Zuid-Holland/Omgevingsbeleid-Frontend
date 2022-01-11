import {
    render,
    waitForElementToBeRemoved,
    waitFor,
    screen,
} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import RaadpleegZoekResultatenOverzicht from "./RaadpleegZoekResultatenOverzicht"
import { MemoryRouter } from "react-router-dom"

describe("RaadpleegZoekResultatenOverzicht", () => {
    const defaultProps = {
        history: {
            length: 2,
            action: "PUSH",
            location: {
                pathname: "/zoekresultaten",
                search: "?query=Water",
                hash: "",
                key: "8nfj8o",
            },
        },
        location: {
            pathname: "/zoekresultaten",
            search: "?query=Water",
            hash: "",
            key: "8nfj8o",
        },
        match: {
            path: "/zoekresultaten",
            url: "/zoekresultaten",
            isExact: true,
            params: {},
        },
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegZoekResultatenOverzicht {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", async () => {
        setup()

        await waitForElementToBeRemoved(() => screen.queryAllByRole("img"))
        screen.getByText(`Waterveiligheid en wateroverlast`)
    })
})
