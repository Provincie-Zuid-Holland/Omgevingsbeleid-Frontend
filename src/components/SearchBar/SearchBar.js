import React from 'react'
import { withRouter, useLocation, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'url-search-params-polyfill'

// The parameter compInNavigation
/**
 * Component that renders the searchBar component.
 *
 * @component
 *
 * @param {string} width - Parameter that is used to set the width of an element within the rendered component.
 * @param {string} exactWidth - Parameter that can be set as a value for the width parameter.
 * @param {boolean} compInNavigation - Parameter that is used in a if statement to set values to certain variables.
 * @param {string} placeholder - Parameter that shows a placeholder in the SearchBar.
 */
const SearchBar = ({
    width,
    exactWidth,
    compInNavigation,
    placeholder,
    id,
}) => {
    const location = useLocation()
    const history = useHistory()

    const [searchQuery, setSearchQuery] = React.useState('')
    const [searchBarPopupOpen, setSearchBarPopupOpen] = React.useState(true)

    const node = React.useRef()

    // After mount & First render
    React.useEffect(() => {
        // Add event listener -> Close searchBarPopup on Escape
        function closeOnEscape(e) {
            if (e.key === 'Escape') {
                setSearchBarPopupOpen(false)
            }
        }
        document.addEventListener('keydown', closeOnEscape)

        // Close searchbar popup on click outside
        const handleClick = (e) => {
            if (node.current.contains(e.target)) {
                // inside click
                return
            }
            // outside click
            setSearchBarPopupOpen(false)
        }
        document.addEventListener('mousedown', handleClick)

        // If the component is on the Raadpleeg homepage (not in the navbar)
        if (!compInNavigation) {
            const urlParams = location.search
            const searchParams = new URLSearchParams(urlParams)
            const searchQuery = searchParams.get('query')
            if (searchQuery) {
                setSearchQuery(searchQuery)
            }
        }

        // Remove event listeners on unmount
        return () => {
            document.removeEventListener('mousedown', handleClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [compInNavigation, location])

    return (
        <div
            ref={node}
            className={`relative block ${
                width && !exactWidth ? width : exactWidth ? '' : 'w-full'
            }`}
            style={
                exactWidth
                    ? {
                          width: exactWidth,
                      }
                    : {}
            }
        >
            <input
                className={`block w-full pr-10 bg-gray-50 rounded-full text-gray-700 appearance-none px-5 py-2 border border-gray-200  sm:text-sm sm:leading-5`}
                name="searchInput"
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (!searchBarPopupOpen) {
                        setSearchBarPopupOpen(true)
                    }
                }}
                onClick={() => setSearchBarPopupOpen(true)}
                autoComplete="off"
                id={id ? id : 'search-query'}
                type="text"
                value={searchQuery}
                placeholder={
                    placeholder ? placeholder : 'Zoeken op artikelnummer, etc.'
                }
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        // Enter
                        setSearchBarPopupOpen(false)
                        history.push(`/zoekresultaten?query=${searchQuery}`)
                    } else if (e.keyCode === 40 && searchQuery.length > 0) {
                        // Arrow Down
                        e.preventDefault()
                        document.querySelectorAll(`[data-index='0']`)[0].focus()
                    }
                }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FontAwesomeIcon
                    className="ml-2 text-gray-500"
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

/**
 * Function to render the SearchBarPopupItem component.
 *
 * @function
 *
 * @param {int} index - Parameter used as the index key for the SearchBarPopupItem.
 * @param {string} value - Parameter that is used as an value for a query that is used within a link in the rendered component
 * @param {string} filterQuery - Parameter that is used to filter the query based on its value.
 * @param {boolean} filter - If this parameter is true, certain elements will be shown.
 * @param {int} arrayLength - Parameter that has the length of the array as value.
 * @param {int} dataIndex - Parameter used as the data-index value of an link tag.
 * @param {boolean} setSearchBarPopupOpen - Parameter that if set to true the SearchBarPopup component will be shown.
 * @param {object} item - Parameter that its value of is used for an element.
 */
function SearchBarPopupItem({
    index,
    value,
    filterQuery,
    filter,
    arrayLength,
    dataIndex,
    setSearchBarPopupOpen,
    item,
}) {
    // Function to handle arrow navigation through the items in the popup
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
                className={`text-gray-700 px-5 w-full relative inline-block hover:bg-gray-50 focus:bg-gray-50 focus:shadow-outline focus:rounded cursor-pointer py-2`}
                to={`/zoekresultaten?query=${value}${
                    filterQuery ? `&only=${filterQuery}` : ''
                }`}
                onClick={() => {
                    setSearchBarPopupOpen(false)
                }}
                onKeyDown={(e) => {
                    if (e.keyCode === 40) {
                        // Arrow down
                        e.preventDefault()
                        selectQueryDataItem('next', arrayLength)
                    } else if (e.keyCode === 38) {
                        // Arrow up
                        e.preventDefault()
                        selectQueryDataItem('previous', arrayLength)
                    }
                }}
                data-index={dataIndex}
            >
                {filter ? (
                    <span className="pl-4 text-sm">
                        In
                        <span className="text-yellow-600"> {item.name}</span>
                    </span>
                ) : (
                    <React.Fragment>
                        <span className="inline-block search-preview">
                            {value}
                        </span>
                    </React.Fragment>
                )}
            </Link>
        </li>
    )
}

/**
 * Function that renders the SearchBarPopup component that is used within other functions.
 *
 * @function
 *
 * @param {string} searchInput - Parameter used to set the value of the SearchBarPopupItem component.
 * @param {boolean} setSearchBarPopupOpen - Parameter used to toggle the SearchBarPopup component by setting it true or false.
 */
function SearchBarPopup({ searchInput, setSearchBarPopupOpen }) {
    const filters = [
        {
            filterQuery: 'beleidskeuzes',
            name: 'beleidskeuzes',
        },
        {
            filterQuery: 'ambities',
            name: 'ambities',
        },
        {
            filterQuery: 'opgaven',
            name: 'beleidsdoelen',
        },
        {
            filterQuery: 'maatregelen',
            name: 'maatregelen',
        },
        {
            filterQuery: 'verordeningen',
            name: 'verordening',
        },
        {
            filterQuery: 'beleidsregels',
            name: 'beleidsregels',
        },
    ]

    return (
        <div
            className="absolute top-0 w-full px-5"
            id="main-search-result-container"
        >
            <ul className="text-sm text-gray-700 bg-white border border-gray-300 rounded-b shadow">
                <SearchBarPopupItem
                    setSearchBarPopupOpen={setSearchBarPopupOpen}
                    dataIndex={0}
                    key={0}
                    value={searchInput}
                />
                {filters.map((item, index) => (
                    <SearchBarPopupItem
                        value={searchInput}
                        filterQuery={item.filterQuery}
                        key={item.name}
                        dataIndex={index + 1}
                        index={item.name}
                        item={item}
                        filter={true}
                        setSearchBarPopupOpen={setSearchBarPopupOpen}
                        arrayLength={filters.length}
                    />
                ))}
            </ul>
        </div>
    )
}

export default withRouter(SearchBar)
