import { FieldInput } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useClickAway } from 'react-use'

import { searchBarFilters } from '@/constants/searchBarFilters'
import useBreakpoint from '@/hooks/useBreakpoint'

import SearchBarPopupItem from '../SearchBarPopupItem'

interface SearchBarProps {
    id?: string
    className?: string
    callBack?: () => void
}

const SearchBar = ({
    id = 'search-query',
    className = '',
    callBack,
}: SearchBarProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { isMobile } = useBreakpoint()

    const [searchQuery, setSearchQuery] = useState('')
    const [searchBarPopupOpen, setSearchBarPopupOpen] = useState(false)

    const searchBarRef = useRef(null)
    useClickAway(searchBarRef, () => {
        setSearchBarPopupOpen(false)
    })

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Enter key
            if (searchQuery.length === 0) return
            setSearchBarPopupOpen(false)
            if (callBack) {
                callBack()
            }
            navigate(`/zoekresultaten?query=${searchQuery}`)
        } else if (e.key === 'Escape') {
            // Escape key
            setSearchBarPopupOpen(false)
        } else if (e.key === 'ArrowDown' && searchQuery.length > 0) {
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
            <FieldInput
                name="searchInput"
                placeholder={
                    isMobile
                        ? 'Zoeken'
                        : 'Zoek binnen het beleid van de provincie Zuid-Holland'
                }
                onChange={e => {
                    setSearchQuery(e.target.value)
                    if (!searchBarPopupOpen) {
                        setSearchBarPopupOpen(true)
                    }
                }}
                onClick={() => setSearchBarPopupOpen(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                id={id}
                value={searchQuery}
                icon={MagnifyingGlass}
            />
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
                            callback={callBack}
                            key={0}
                            searchQuery={searchQuery}
                        />
                        {/* Display the 'Search in ${type}'*/}
                        {searchBarFilters.map((filterItem, index) => (
                            <SearchBarPopupItem
                                callback={callBack}
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
