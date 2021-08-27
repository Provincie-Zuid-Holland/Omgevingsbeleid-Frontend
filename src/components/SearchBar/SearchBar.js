import React from "react"
import { withRouter, useLocation, useHistory } from "react-router-dom"
import { faSearch } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "url-search-params-polyfill"

import useClickOutsideContainer from "./../../utils/useClickOutsideContainer"
import { searchBarFilters } from "./../../constants/searchBarFilters"

import SearchBarPopupItem from "./../SearchBarPopupItem"

/**
 * Displays a search bar which can be used within a component/page.
 *
 * @component
 *
 * @param {string} width - Contains the width of the SearchBar component.
 * @param {string} exactWidth - Contains the exact width of the SearchBar component.
 * @param {boolean} compInNavigation - Used to check if the component is in the navbar.
 * @param {string} placeholder - Contains the placeholder value.
 */
const SearchBar = ({ width, componentInNavbar, placeholder, id }) => {
    const location = useLocation()
    const history = useHistory()

    const [searchQuery, setSearchQuery] = React.useState("")
    const [searchBarPopupOpen, setSearchBarPopupOpen] = React.useState(true)

    const searchBarRef = React.useRef()
    useClickOutsideContainer(searchBarRef, () => {
        setSearchBarPopupOpen(false)
    })

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            // Enter key
            setSearchBarPopupOpen(false)
            history.push(`/zoekresultaten?query=${searchQuery}`)
        } else if (e.key === "Escape") {
            // Escape key
            setSearchBarPopupOpen(false)
        } else if (e.keyCode === 40 && searchQuery.length > 0) {
            // Arrow Down key
            e.preventDefault()
            document.querySelectorAll(`[data-index='0']`)[0].focus()
        }
    }

    const selectSearchQueryInput = () => {
        const searchQueryInput = document.getElementById("search-query")
        if (!searchQueryInput) return
        searchQueryInput.select()
    }

    React.useEffect(() => {
        // If the component is on the Raadpleeg homepage (not in the navbar)
        if (!componentInNavbar) {
            const urlParams = location.search
            const searchParams = new URLSearchParams(urlParams)
            const searchQuery = searchParams.get("query")
            if (searchQuery) {
                setSearchQuery(searchQuery)
            }
        }
    }, [componentInNavbar, location])

    return (
        <div
            ref={searchBarRef}
            className={`relative block ${width ? width : "w-full"}`}
        >
            <input
                className={`block w-full pr-10 bg-gray-50 rounded-full appearance-none px-3 py-1 border hover:border-gray-300 border-gray-200 transition-colors ease-in duration-100`}
                name="searchInput"
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (!searchBarPopupOpen) {
                        setSearchBarPopupOpen(true)
                    }
                }}
                onClick={() => setSearchBarPopupOpen(true)}
                autoComplete="off"
                id={id ? id : "search-query"}
                type="text"
                value={searchQuery}
                placeholder={
                    placeholder ? placeholder : "Zoeken op artikelnummer, etc."
                }
                onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FontAwesomeIcon
                    className="ml-2 text-gray-500"
                    icon={faSearch}
                />
            </div>
            {searchQuery.length > 0 && searchBarPopupOpen ? (
                <div
                    className="absolute top-0 z-10 w-full px-5"
                    id="main-search-result-container"
                >
                    <ul className="text-base bg-white border border-gray-300 rounded-b shadow">
                        {/* Displays the searchQuery*/}
                        <SearchBarPopupItem
                            selectSearchQueryInput={selectSearchQueryInput}
                            setSearchBarPopupOpen={setSearchBarPopupOpen}
                            dataIndex={0}
                            key={0}
                            searchQuery={searchQuery}
                        />
                        {/* Display the 'Search in ${type}'*/}
                        {searchBarFilters.map((filterItem, index) => (
                            <SearchBarPopupItem
                                selectSearchQueryInput={selectSearchQueryInput}
                                searchQuery={searchQuery}
                                key={filterItem.name}
                                dataIndex={index}
                                filterItem={filterItem}
                                setSearchBarPopupOpen={setSearchBarPopupOpen}
                                amountOfFilterItems={searchBarFilters.length}
                            />
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}
export default withRouter(SearchBar)
