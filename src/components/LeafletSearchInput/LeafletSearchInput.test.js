import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import LeafletSearchInput from "./LeafletSearchInput"

describe("LeafletSearchInput", () => {
    const selectMock = jest.fn()
    const mapPanToMock = jest.fn()
    const defaultProps = {
        mapPanTo: mapPanToMock,
        reference: {
            current: {
                select: selectMock,
            },
        },
    }

    const arrowEvent = (type, element) => {
        if (type === "down") {
            fireEvent.keyDown(element, {
                key: "ArrowDown",
                code: "ArrowDown",
                keyCode: 40,
            })
        } else if (type === "up") {
            fireEvent.keyDown(element, {
                key: "ArrowUp",
                code: "ArrowUp",
                keyCode: 38,
            })
        } else if (type === "enter") {
            fireEvent.keyDown(element, {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
            })
        }
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletSearchInput {...props} />)
    }

    it("Component renders", () => {
        setup()
        const element = screen.getByPlaceholderText("Zoeken op de kaart")
        expect(element).toBeTruthy()
    })

    it("User can type a search query", async () => {
        setup()
        const searchInput = screen.getByPlaceholderText("Zoeken op de kaart")

        fireEvent.change(searchInput, { target: { value: "Den Haag" } })
        expect(searchInput.value).toBe("Den Haag")

        // Displays a suggestion
        await waitFor(() => screen.findByText("Gemeente 's-Gravenhage"))

        // User can navigate through the suggestions with the up & down arrow keys
        const firstSuggestion = await screen
            .queryByText("Gemeente 's-Gravenhage")
            .closest("li")
        const secondSuggestion = await screen
            .queryByText("Haag, Deurne")
            .closest("li")

        searchInput.focus()
        arrowEvent("down", searchInput)
        expect(firstSuggestion).toHaveFocus()

        arrowEvent("down", firstSuggestion)
        expect(secondSuggestion).toHaveFocus()

        arrowEvent("enter", secondSuggestion)
        expect(secondSuggestion).toHaveFocus()

        arrowEvent("up", secondSuggestion)
        expect(firstSuggestion).toHaveFocus()

        // User can select a suggestion
        fireEvent.click(firstSuggestion)
    })
})
