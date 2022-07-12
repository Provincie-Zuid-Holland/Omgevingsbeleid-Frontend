import { Transition } from '@headlessui/react'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { Selection } from 'd3'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useClickAway } from 'react-use'

import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import { getFilteredData } from '@/utils/networkGraph'

/**
 * A search bar where the user can search through and select the graph nodes
 * @param {object} props
 * @param {string} props.searchQuery - State of the search query for the input
 * @param {function} props.setSearchQuery - Set state function of the search query for the input
 * @param {array|null} props.data - Contains the data for the graph
 * @param {object} props.filters - Contains the current active filters
 * @param {object|null} props.clickedNode - Contains the active clicked node if there is one
 * @param {object} props.handleNodeClick - Function that handles a click on a node and sets it active
 * @param {object} props.svgElement - Contains the current D3 Container
 */

interface NetworkGraphSearchBarProps {
    searchQuery: string
    setSearchQuery: (value: string) => void
    data?: any
    filters?: any
    clickedNode?: any
    handleNodeClick: (
        clickedEl: any,
        svgElement: Selection<SVGElement | null, unknown, null, undefined>,
        links: any,
        refresh?: any
    ) => void
    svgElement: Selection<SVGElement | null, unknown, null, undefined>
}

const NetworkGraphSearchBar = ({
    searchQuery,
    setSearchQuery,
    data,
    filters,
    clickedNode,
    handleNodeClick,
    svgElement,
}: NetworkGraphSearchBarProps) => {
    const [filteredData, setFilteredData] = useState<any>(null)
    const [links, setLinks] = useState<any>(null)
    const [searchResultsOpen, setSearchResultsOpen] = useState(true)
    const innerContainer = useRef(null)

    useClickAway(innerContainer, () => {
        setSearchResultsOpen(false)
    })

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 40 && searchQuery.length > 0) {
            // Arrow Down key
            e.preventDefault()

            const el = document.querySelectorAll(
                `[data-index='1']`
            )[0] as HTMLLIElement
            el.focus()
        } else if (e.keyCode === 27) {
            // Escape key
            setSearchResultsOpen(false)
        }
    }

    /** Iniate filtered data and links in local state */
    useEffect(() => {
        if (!filters || !data) return
        const [links, nodes] = getFilteredData(data, filters)

        setFilteredData(nodes)
        setLinks(links)
    }, [filters, data])

    /** Close the search results when there is a clicked node */
    useEffect(() => {
        if (clickedNode) setSearchResultsOpen(false)
    }, [clickedNode])

    return (
        <div ref={innerContainer}>
            <div className="relative z-20">
                <input
                    autoComplete="off"
                    onKeyDown={handleKeyDown}
                    disabled={clickedNode}
                    className={`block w-full pl-10 pr-24 md:pr-4 pt-2 pb-1 leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none hover:border-gray-300 focus:border-gray-400 ${
                        searchQuery !== '' && searchResultsOpen
                            ? 'rounded-b-none'
                            : ''
                    }`}
                    id="network-graph-search-query"
                    placeholder="Zoek op beleid"
                    type="text"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    onFocus={() => setSearchResultsOpen(true)}
                    onClick={() => setSearchResultsOpen(true)}
                />
                <div
                    className={`absolute top-0 left-0 flex items-center justify-between w-full h-full px-4 pointer-events-none`}>
                    <MagnifyingGlass className="mr-2 text-gray-800" />
                    <div
                        className={`pt-1 text-sm text-gray-700 underline select-none ${
                            clickedNode
                                ? ''
                                : 'cursor-pointer pointer-events-auto'
                        }`}
                        onClick={() =>
                            setSearchResultsOpen(!searchResultsOpen)
                        }>
                        {searchResultsOpen && searchQuery.length > 0 ? (
                            <span>Verberg resultaten</span>
                        ) : searchQuery.length > 0 ? (
                            <span>Toon resultaten</span>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="relative">
                <NetworkGraphSearchBarResults
                    show={searchQuery !== '' && searchResultsOpen}
                    handleNodeClick={handleNodeClick}
                    searchQuery={searchQuery}
                    filteredData={filteredData}
                    links={links}
                    svgElement={svgElement}
                />
            </div>
        </div>
    )
}

/**
 * A list of search results for the current search query
 * @param {object} props
 * @param {boolean} props.show - Indicates if we show the results
 * @param {object} props.filteredData - The data, filtered by the current search query
 * @param {object} props.searchQuery - Current search query
 * @param {array} props.links - Links between the nodes
 * @param {object} props.handleNodeClick - Function that handles a click on a node and sets it active
 * @param {object} props.svgElement - Contains the current D3 Container
 */

interface NetworkGraphSearchBarResultsProps {
    show?: boolean
    filteredData?: any
    searchQuery: string
    links?: any
    handleNodeClick: (
        clickedEl: any,
        svgElement: Selection<SVGElement | null, unknown, null, undefined>,
        links: any,
        refresh?: any
    ) => void
    svgElement: Selection<SVGElement | null, unknown, null, undefined>
}

const NetworkGraphSearchBarResults = ({
    show,
    filteredData,
    searchQuery,
    links,
    handleNodeClick,
    svgElement,
}: NetworkGraphSearchBarResultsProps) => {
    if (!filteredData) return null

    const filterBasedOnSearchQuery = (e: any) =>
        e.Titel?.toLowerCase()?.includes(searchQuery.toLowerCase())

    return (
        <Transition
            show={show}
            enter="transition ease-out duration-150 transform"
            enterFrom="opacity-0 -translate-y-3"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-0 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-3">
            <ul
                className="absolute top-0 left-0 z-10 w-full overflow-hidden overflow-y-auto bg-white border border-t-0 border-gray-200 rounded-b-md"
                style={{ maxHeight: '400px' }}>
                {filteredData
                    .filter(filterBasedOnSearchQuery)
                    .map((searchResultItem: any, index: number) => (
                        <NetworkGraphSearchBarResultItem
                            key={searchResultItem.UUID}
                            handleClick={() =>
                                handleNodeClick(
                                    searchResultItem,
                                    svgElement,
                                    links,
                                    true
                                )
                            }
                            searchResultItem={searchResultItem}
                            amountOfFilterItems={
                                filteredData.filter(filterBasedOnSearchQuery)
                                    .length
                            }
                            searchResultItemIndex={index}
                        />
                    ))}
            </ul>
        </Transition>
    )
}

/**
 * A search result item displaying the title and the type
 * @param {object} props
 * @param {object} props.handleClick - Function that handles a click on a node and sets it active
 * @param {object} props.searchResultItem - Search result item (contains the node object)
 * @param {number} props.amountOfFilterItems - Total amount of search result items
 * @param {object} props.searchResultItemIndex - Index of current search result item
 */

interface NetworkGraphSearchBarResultItemProps {
    handleClick: () => void
    searchResultItem: any
    amountOfFilterItems: number
    searchResultItemIndex: number
}

const NetworkGraphSearchBarResultItem = ({
    handleClick,
    searchResultItem,
    amountOfFilterItems,
    searchResultItemIndex,
}: NetworkGraphSearchBarResultItemProps) => {
    const selectSearchQueryInput = () => {
        const searchQueryInput = document.getElementById(
            'network-graph-search-query'
        ) as HTMLInputElement
        if (!searchQueryInput) return
        searchQueryInput.select()
    }

    /**
     * Function to handle the up and down key navigation
     * @param {string} type - Contains the type 'previous' or 'next'
     */
    const focusItem = (type: 'previous' | 'next') => {
        const currentIndex = parseInt(
            document.activeElement?.getAttribute('data-index') || ''
        )
        const isLastItem = currentIndex === amountOfFilterItems
        const isFirstItem = currentIndex === 1

        const focusNewItem = (index: number) =>
            (
                document.querySelector(
                    `[data-index='${index}']`
                ) as HTMLInputElement
            )?.focus()

        if (type === 'next' && isLastItem) {
            return
        } else if (type === 'next' && !isLastItem) {
            focusNewItem(currentIndex + 1)
        } else if (type === 'previous' && isFirstItem) {
            selectSearchQueryInput()
        } else if (type === 'previous' && !isFirstItem) {
            focusNewItem(currentIndex - 1)
        }
    }

    /**
     * Function to handle the key down event
     * Handlers for key up, key down and the enter key
     * @param {object} e - Event
     */
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 40) {
            // Arrow down
            e.preventDefault()
            focusItem('next')
        } else if (e.keyCode === 38) {
            // Arrow up
            e.preventDefault()
            focusItem('previous')
        } else if (e.keyCode === 13) {
            // Enter key
            handleClick()
        }
    }

    const singularType =
        networkGraphConnectionProperties[
            searchResultItem.Type as keyof typeof networkGraphConnectionProperties
        ]?.singular

    return (
        <li
            tabIndex={0}
            className={`px-4 w-full relative hover:bg-gray-50 focus:bg-gray-50 focus:ring focus:rounded cursor-pointer py-2 flex justify-between`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            data-index={searchResultItemIndex + 1}>
            <span className="pr-4">{searchResultItem.Titel}</span>
            <span className="text-gray-600">{singularType}</span>
        </li>
    )
}

export default NetworkGraphSearchBar
