import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { MemoryRouter } from "react-router-dom"

import SearchBarPopupItem from "./SearchBarPopupItem"
import { searchBarFilters } from "./../../constants/searchBarFilters"

describe("SearchBarPopupItem", () => {
    const setSearchBarPopupOpenMock = jest.fn()
    const selectSearchQueryInputMock = jest.fn()
    const defaultProps = {
        searchQuery: "searchQuery",
        dataIndex: 0,
        setSearchBarPopupOpen: setSearchBarPopupOpenMock,
        selectSearchQueryInput: selectSearchQueryInputMock,
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
        }
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <SearchBarPopupItem {...props} />
            </MemoryRouter>
        )
    }

    const setupMultiple = (customProps, customPropsSecond) => {
        const props = { ...defaultProps, ...customProps }
        const propsSecond = {
            searchQuery: "searchQuery",
            filter: false,
            amountOfFilterItems: 2,
            dataIndex: 0,
            setSearchBarPopupOpen: setSearchBarPopupOpenMock,
            selectSearchQueryInput: selectSearchQueryInputMock,
            filterItem: searchBarFilters[0],
        }
        const propsThird = {
            ...propsSecond,
            filterItem: searchBarFilters[1],
            dataIndex: 1,
        }
        render(
            <MemoryRouter>
                <SearchBarPopupItem {...props} />
                <SearchBarPopupItem {...propsSecond} />
                <SearchBarPopupItem {...propsThird} />
            </MemoryRouter>
        )
    }

    it("Component renders with filter false", () => {
        setup()
        const element = screen.getByText(defaultProps.searchQuery)
        expect(element).toBeTruthy()
    })

    it("Component renders with filter true", () => {
        setup({ filter: true })
        const element = screen.getByText(defaultProps.searchQuery)
        expect(element).toBeTruthy()
    })

    it("Clicking on an item will close the searchBarPopup", () => {
        setup({ filter: true })
        const element = screen.getByText(defaultProps.searchQuery)
        expect(element).toBeTruthy()
        fireEvent.click(element)
        expect(setSearchBarPopupOpenMock).toHaveBeenCalledTimes(1)
    })

    it("User can navigate with arrow between the items", () => {
        setupMultiple()

        const firstElement = screen
            .getByText(defaultProps.searchQuery)
            .closest("a")
        expect(firstElement).toBeTruthy()

        const secondElement = screen
            .getByText(searchBarFilters[0].name)
            .closest("a")
        expect(secondElement).toBeTruthy()

        const thirdElement = screen
            .getByText(searchBarFilters[1].name)
            .closest("a")
        expect(thirdElement).toBeTruthy()

        firstElement.focus()
        expect(firstElement).toHaveFocus()

        // Use Arrow Down key to navigate to the second item
        expect(secondElement).not.toHaveFocus()
        arrowEvent("down", firstElement)
        expect(secondElement).toHaveFocus()

        // Use Arrow Down key to navigate to the third item
        arrowEvent("down", secondElement)
        expect(thirdElement).toHaveFocus()

        // thirdElement should be the last item, assert on this
        arrowEvent("down", thirdElement)
        expect(thirdElement).toHaveFocus()

        // Go back down
        arrowEvent("up", thirdElement)
        expect(secondElement).toHaveFocus()

        arrowEvent("up", secondElement)
        expect(firstElement).toHaveFocus()

        // We have now arrived at the first item
        // When the user moves the arrow up it should select the searchQuery input
        arrowEvent("up", firstElement)
        expect(selectSearchQueryInputMock).toHaveBeenCalledTimes(1)
        expect(firstElement).toHaveFocus()
    })

    it("Returns event when data-index is not valid", () => {
        setup({ dataIndex: null })
        const element = screen.getByText(defaultProps.searchQuery)
        expect(element).toBeTruthy()
        arrowEvent("down", element)
    })
})
