import { render, screen } from "@testing-library/react"
import nlLocale from "date-fns/locale/nl"
import { format } from "date-fns"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter } from "react-router-dom"

import { beleidskeuzes } from "./../../../mocks/data/beleidskeuzes"
import RevisieListItem from "./RevisieListItem"

describe("RevisieListItem", () => {
    const dataObject = beleidskeuzes[0]
    dataObject.uiStatus = "Test status"

    const defaultProps = {
        item: { ...dataObject },
        currentUUID: "89154DA3-2E98-4685-AA9D-A3FB8B9BB596",
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RevisieListItem {...props} />
            </MemoryRouter>
        )
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByText(
            "Test status (Er is nog geen begin geldigheid)"
        )
        expect(element).toBeTruthy()
    })

    it("Displays the correct date", () => {
        const startDate = new Date()
        const customProps = {
            item: { ...dataObject, Begin_Geldigheid: startDate },
        }

        setup(customProps)
        const dateText = format(startDate, "d MMM yyyy", {
            locale: nlLocale,
        })
        const element = screen.getByText(`Test status (${dateText})`)
        expect(element).toBeTruthy()
    })
})