import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import RaadpleegObjectDetailNewVersionNotification from "./RaadpleegObjectDetailNewVersionNotification"
import { MemoryRouter } from "react-router-dom"

describe("RaadpleegObjectDetailNewVersionNotification", () => {
    const defaultProps = {
        titleSingular: "Maatregel",
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegObjectDetailNewVersionNotification {...props} />
            </MemoryRouter>
        )
    }

    it("isNewWithNoEffectiveVersionPresent", () => {
        setup({
            dataObject: {
                Effective_Version: null,
                Latest_Status: "Ontwerp GS Concept",
                Latest_Version: "3306234E-8EC5-4384-A189-31417B242933",
                Status: "Ontwerp GS Concept",
                UUID: "3306234E-8EC5-4384-A189-31417B242933",
            },
        })
        const element = screen.getByText(
            "Op dit moment is dit beleid nog niet vigerend en nog in ontwerp"
        )
        expect(element).toBeTruthy()
    })

    it("isValidButNewPublicDraftAvailable", () => {
        setup({
            dataObject: {
                Status: "Vigerend",
                UUID: "7C9E979C-BB57-492C-A34D-CA69021DA913",
                Latest_Version: "AC2A5388-42CF-496C-8197-9235BB351B0E",
                Latest_Status: "Ontwerp GS",
                Effective_Version: "7C9E979C-BB57-492C-A34D-CA69021DA913",
            },
        })
        const element = screen.getByText("bekijk deze versie hier")
        expect(element).toBeTruthy()
    })

    it("isValidAndArchived", () => {
        setup({
            dataObject: {
                Status: "Ontwerp GS",
                UUID: "AC2A5388-42CF-496C-8197-9235BB351B0E",
                Latest_Version: "AC2A5388-42CF-496C-8197-9235BB351B0E",
                Latest_Status: "Ontwerp GS",
                Effective_Version: "7C9E979C-BB57-492C-A34D-CA69021DA913",
            },
        })
        const element = screen.getByText("bekijk hier de vigerende versie")
        expect(element).toBeTruthy()
    })

    it("isNewWithEffectiveVersionPresent", () => {
        setup({
            dataObject: {
                Status: "Ontwerp GS",
                UUID: "AC2A5388-42CF-496C-8197-9235BB351B0E",
                Latest_Version: "AC2A5388-42CF-496C-8197-9235BB351B0E",
                Latest_Status: "Ontwerp GS",
                Effective_Version: "7C9E979C-BB57-492C-A34D-CA69021DA913",
            },
        })
        const element = screen.getByText("bekijk hier de vigerende versie")
        expect(element).toBeTruthy()
    })

    it("isValidWithNoNewerVersionsAvailable", async () => {
        const { container } = render(
            <MemoryRouter>
                <RaadpleegObjectDetailNewVersionNotification
                    dataObject={{
                        Effective_Version:
                            "A1A7EF8C-D88C-4305-AEB6-E1D5C9EA75F6",
                        Latest_Status: "Vigerend",
                        Latest_Version: "A1A7EF8C-D88C-4305-AEB6-E1D5C9EA75F6",
                        Status: "Vigerend",
                        UUID: "A1A7EF8C-D88C-4305-AEB6-E1D5C9EA75F6",
                    }}
                    {...defaultProps}
                />
            </MemoryRouter>
        )
        // Check if component returns Null
        await waitFor(() => {
            expect(container.childElementCount).toEqual(0)
        })
    })
})
