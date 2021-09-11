import { render, screen, fireEvent, findByText } from "@testing-library/react"
import { MemoryRouter, Route } from "react-router-dom"
import "@testing-library/jest-dom"
import React from "react"

import { beleidsregels } from "./../../mocks/data/beleidsregels"

import MuteerUniversalObjectDetail from "./MuteerUniversalObjectDetail"

describe("MuteerUniversalObjectDetail", () => {
    const defaultProps = {
        dimensieConstants: {
            TITLE_SINGULAR: "Beleidsregel",
            TITLE_SINGULAR_PREFIX: "de",
            TITLE_PLURAL: "Beleidsregels",
            API_ENDPOINT: "beleidsregels",
            SLUG_OVERVIEW: "beleidsregels",
            SLUG_CREATE_NEW: "nieuwe-beleidsregel",
            CRUD_PROPERTIES: {
                Titel: {
                    initValue: null,
                    required: true,
                    requiredMessage: "Vul een titel in",
                    testValue: "Test beleidsregel maandag 19 juli 2021",
                    type: "text input",
                },
                Omschrijving: {
                    initValue: null,
                    required: false,
                    requiredMessage: "",
                    testValue: "Omschrijving",
                    type: "text input",
                },
                Weblink: {
                    initValue: null,
                    required: false,
                    requiredMessage: "",
                    testValue: "Weblink",
                    type: "text input",
                },
                Externe_URL: {
                    initValue: null,
                    required: false,
                    requiredMessage: "",
                    testValue: "Weblink",
                    type: "text input",
                },
                Begin_Geldigheid: {
                    initValue: null,
                    required: true,
                    requiredMessage: "Vul een datum van inwerkingstreding in",
                    testValue: "2021-07-19",
                    type: "date input",
                },
                Eind_Geldigheid: {
                    initValue: null,
                    required: false,
                    requiredMessage: "Vul een datum van uitwerkingstreding in",
                    testValue: "2022-01-19",
                    type: "date input",
                },
            },
        },
        history: {
            length: 14,
            action: "PUSH",
            location: {
                pathname: "/muteer/beleidsregels/1453",
                search: "",
                hash: "",
                key: "xsijfd",
            },
        },
        location: {
            pathname: "/muteer/beleidsregels/1453",
            search: "",
            hash: "",
            key: "xsijfd",
        },
        match: {
            path: "/muteer/beleidsregels/:single",
            url: "/muteer/beleidsregels/1453",
            isExact: true,
            params: { single: "1453" },
        },
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter
                initialEntries={[
                    `/muteer/beleidsregels/${beleidsregels[0].ID}`,
                ]}
            >
                <Route path={"/muteer/beleidsregels/:single"}>
                    <MuteerUniversalObjectDetail {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it("Component renders", async () => {
        setup()
        const element = screen.getByText("Beleidsregel")
        expect(element).toBeTruthy()

        const title = await screen.findByText(beleidsregels[0].Titel)
        expect(title).toBeTruthy()
    })
})