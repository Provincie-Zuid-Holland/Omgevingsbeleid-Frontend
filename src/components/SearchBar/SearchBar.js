import React, { Component } from 'react'
import { withRouter, useLocation, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'url-search-params-polyfill'

function SearchBarPopupItem({
    index,
    value,
    filterQuery,
    filter,
    arrayLength,
    dataIndex,
    setSearchBarPopupOpen,
}) {
    function selectQueryDataItem(nextOrPrevious, arrayLength) {
        const currentIndex = document.activeElement.getAttribute('data-index')

        let newIndex
        switch (nextOrPrevious) {
            case 'next':
                if (parseInt(currentIndex) === arrayLength) {
                    return
                }
                newIndex = parseInt(currentIndex) + 1
                break
            case 'previous':
                if (parseInt(currentIndex) === 0) {
                    document.getElementById('search-query').select()
                    return
                }
                newIndex = parseInt(currentIndex) - 1
                break
            default:
                newIndex = 1
        }
        document.querySelectorAll(`[data-index='${newIndex}']`)[0].focus()
    }

    return (
        <li key={index} className={`relative`}>
            <Link
                className={`px-5 w-full relative inline-block hover:bg-gray-50 focus:bg-gray-50 focus:shadow-outline cursor-pointer py-2`}
                to={`/zoekresultaten?query=${value}${
                    filterQuery ? `&only=${filterQuery}` : ''
                }`}
                onClick={() => setSearchBarPopupOpen(false)}
                onKeyDown={(e) => {
                    if (e.keyCode === 40) {
                        // Arrow down
                        selectQueryDataItem('next', arrayLength)
                    } else if (e.keyCode === 38) {
                        // Arrow up
                        selectQueryDataItem('previous', arrayLength)
                    }
                }}
                data-index={dataIndex}
            >
                {filter ? (
                    <span className="pl-4 text-sm">
                        In
                        <span className="text-yellow-500"> {filterQuery}</span>
                    </span>
                ) : (
                    <React.Fragment>
                        <span className="inline-block search-preview">
                            {value}
                        </span>
                        <span className="absolute top-0 right-0 mt-3 mr-3 text-xs text-gray-500">
                            Zoeken in categorie
                        </span>
                    </React.Fragment>
                )}
            </Link>
        </li>
    )
}

function SearchBarPopup({ searchInput, setSearchBarPopupOpen }) {
    const filters = [
        {
            name: 'ambities',
        },
        {
            name: 'beleidsregels',
        },
        {
            name: 'doelen',
        },
        {
            name: 'belangen',
        },
        {
            name: 'maatregelen',
        },
        {
            name: 'themas',
        },
        {
            name: 'opgaven',
        },
        {
            name: 'verordeningen',
        },
        {
            name: 'beleidsbeslissingen',
        },
    ]

    return (
        <ul
            className="absolute top-0 w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-b shadow"
            id="main-search-result-container"
        >
            <SearchBarPopupItem dataIndex={0} key={0} value={searchInput} />
            {filters.map((item, index) => (
                <SearchBarPopupItem
                    value={searchInput}
                    filterQuery={item.name}
                    key={item.name}
                    dataIndex={index + 1}
                    index={item.name}
                    filter={true}
                    setSearchBarPopupOpen={setSearchBarPopupOpen}
                    arrayLength={filters.length}
                />
            ))}
        </ul>
    )
}

const SearchBar = ({ width, compInNavigation }) => {
    const location = useLocation()
    const history = useHistory()

    const [searchQuery, setSearchQuery] = React.useState('')
    const [searchBarPopupOpen, setSearchBarPopupOpen] = React.useState(true)

    const node = React.useRef()

    React.useEffect(() => {
        // Close searchBarPopup
        function closeOnEscape(e) {
            if (e.key === 'Escape') {
                setSearchBarPopupOpen(false)
            }
        }
        document.addEventListener('keydown', closeOnEscape)

        const handleClick = (e) => {
            if (node.current.contains(e.target)) {
                // inside click
                return
            }
            // outside click
            setSearchBarPopupOpen(false)
        }
        document.addEventListener('mousedown', handleClick)

        if (!compInNavigation) {
            const urlParams = location.search
            const searchParams = new URLSearchParams(urlParams)
            const searchQuery = searchParams.get('query')
            if (searchQuery) {
                setSearchQuery(searchQuery)
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [])

    return (
        <div
            ref={node}
            className={`relative block ${width ? width : 'w-full'}`}
        >
            <input
                className={`block w-full pr-10 form-input sm:text-sm sm:leading-5 ${
                    searchQuery.length > 0 && searchBarPopupOpen
                        ? 'rounded-b-none'
                        : ''
                }`}
                name="searchInput"
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (!searchBarPopupOpen) {
                        setSearchBarPopupOpen(true)
                    }
                }}
                onClick={() => setSearchBarPopupOpen(true)}
                autoComplete="off"
                id="search-query"
                type="text"
                value={searchQuery}
                placeholder="Zoeken op artikelnummer, etc."
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        // Enter
                        setSearchBarPopupOpen(false)
                        history.push(`/zoekresultaten?query=${searchQuery}`)
                    } else if (e.keyCode === 40 && searchQuery.length > 0) {
                        // Arrow Down
                        document.querySelectorAll(`[data-index='0']`)[0].focus()
                    }
                }}
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                    className="ml-2 text-gray-400"
                    icon={faSearch}
                />
            </div>
            {searchQuery.length > 0 && searchBarPopupOpen ? (
                <SearchBarPopup
                    setSearchBarPopupOpen={setSearchBarPopupOpen}
                    searchInput={searchQuery}
                />
            ) : null}
        </div>
    )
}

export default withRouter(SearchBar)
