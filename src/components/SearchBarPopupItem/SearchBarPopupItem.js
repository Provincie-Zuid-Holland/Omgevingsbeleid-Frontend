import React from "react"
import { Link } from "react-router-dom"

/**
 * @param {string} searchQuery - The value from the search input
 * @param {undefined|object} filterItem - If filterItem is not undefined the popupItem is used to search in a specific type (e.g. Search in Beleidskeuzes)
 * @param {number} amountOfFilterItems - Length of all the filter items
 * @param {number} dataIndex - Index of the item. The normal searchQuery has an index of 0, and the index of the filterItems will be index + 1.
 * @param {function} setSearchBarPopupOpen - Function to open and close the searchBarPopup
 * @returns Searchbar suggestions. Can display the searchQuery or can display an item to search in a specific object type.
 */
function SearchBarPopupItem({
    searchQuery,
    filterItem,
    amountOfFilterItems,
    dataIndex,
    setSearchBarPopupOpen,
    selectSearchQueryInput,
}) {
    /**
     *
     * @param {string} type - Contains the type 'previous' or 'next'
     */
    const focusItem = (type) => {
        const currentIndex = parseInt(
            document.activeElement.getAttribute("data-index")
        )
        const isLastItem = currentIndex === amountOfFilterItems
        const isFirstItem = currentIndex === 0

        const focusNewItem = (index) =>
            document.querySelector(`[data-index='${index}']`)?.focus()

        if (type === "next" && isLastItem) {
            return
        } else if (type === "next" && !isLastItem) {
            focusNewItem(currentIndex + 1)
        } else if (type === "previous" && isFirstItem) {
            selectSearchQueryInput()
        } else if (type === "previous" && !isFirstItem) {
            focusNewItem(currentIndex - 1)
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 40) {
            // Arrow down
            e.preventDefault()
            focusItem("next")
        } else if (e.keyCode === 38) {
            // Arrow up
            e.preventDefault()
            focusItem("previous")
        }
    }

    const href = filterItem
        ? `/zoekresultaten?query=${searchQuery}&only=${filterItem.filterQuery}`
        : `/zoekresultaten?query=${searchQuery}`

    return (
        <li className={`relative`}>
            <Link
                className={`px-5 w-full relative inline-block hover:bg-gray-50 focus:bg-gray-50 focus:ring focus:rounded cursor-pointer py-2`}
                to={href}
                onClick={() => {
                    setSearchBarPopupOpen(false)
                }}
                onKeyDown={handleKeyDown}
                data-index={filterItem ? dataIndex + 1 : dataIndex}
            >
                {filterItem ? (
                    <span className="pl-4 text-sm">
                        In
                        <span className="text-pzh-yellow-dark">
                            {" " + filterItem.name}
                        </span>
                    </span>
                ) : (
                    <span className="inline-block search-preview">
                        {searchQuery}
                    </span>
                )}
            </Link>
        </li>
    )
}

export default SearchBarPopupItem
