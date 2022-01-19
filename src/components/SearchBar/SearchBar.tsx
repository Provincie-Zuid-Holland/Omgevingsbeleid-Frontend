import { faSearch } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useClickAway } from 'react-use'
import 'url-search-params-polyfill'

import { searchBarFilters } from '../../constants/searchBarFilters'
import SearchBarPopupItem from '../SearchBarPopupItem'

interface SearchBarProps {
    placeholder?: string
    id?: string
    className?: string
}

const SearchBar = ({
    placeholder,
    id = 'search-query',
    className = '',
}: SearchBarProps) => {
    const location = useLocation()
    const history = useHistory()

    const [searchQuery, setSearchQuery] = useState('')
    const [searchBarPopupOpen, setSearchBarPopupOpen] = useState(false)

    const searchBarRef = useRef(null)
    useClickAway(searchBarRef, () => {
        setSearchBarPopupOpen(false)
    })

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) {
            // Enter key
            if (searchQuery.length === 0) return
            setSearchBarPopupOpen(false)
            history.push(`/zoekresultaten?query=${searchQuery}`)
        } else if (e.key === 'Escape') {
            // Escape key
            setSearchBarPopupOpen(false)
        } else if (e.keyCode === 40 && searchQuery.length > 0) {
            // Arrow Down key
            e.preventDefault()

            const firstEl = document.querySelectorAll(
                `[data-index='0']`
            )[0] as HTMLInputElement
            firstEl.focus()
        }
    }

    const selectSearchQueryInput = () => {
        const searchQueryInput = document.getElementById(
            'search-query'
        ) as HTMLInputElement
        if (!searchQueryInput) return
        searchQueryInput.select()
    }

    useEffect(() => {
        const urlParams = location.search
        const searchParams = new URLSearchParams(urlParams)
        const searchQuery = searchParams.get('query')
        if (searchQuery) {
            setSearchQuery(searchQuery)
        }
    }, [location])

    return (
        <div
            ref={searchBarRef}
            className={`relative block w-full ${className}`}>
            <input
                className={`block pl-10 w-full bg-gray-50 rounded appearance-none px-3 border hover:border-opacity-40 border-pzh-blue-dark border-opacity-30 transition-colors ease-in duration-100`}
                name="searchInput"
                onChange={e => {
                    setSearchQuery(e.target.value)
                    if (!searchBarPopupOpen) {
                        setSearchBarPopupOpen(true)
                    }
                }}
                onClick={() => setSearchBarPopupOpen(true)}
                autoComplete="off"
                id={id}
                type="text"
                value={searchQuery}
                placeholder={
                    placeholder ? placeholder : 'Zoeken op artikelnummer, etc.'
                }
                onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon
                    style={{ height: '18px', width: '18px' }}
                    className="text-pzh-blue-dark"
                    icon={faSearch}
                />
            </div>
            {searchQuery.length > 0 && searchBarPopupOpen ? (
                <div
                    className="absolute top-0 z-10 w-full px-5"
                    id="main-search-result-container">
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
export default SearchBar