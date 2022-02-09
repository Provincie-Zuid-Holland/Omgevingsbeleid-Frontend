import axios from 'axios'
import { ChangeEvent, forwardRef, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useDebounce } from 'react-use'

import { getLookupData, getSuggestData } from '@/api/axiosLocatieserver'

/**
 * Class that renders the LeafletSearchInput component that shows a input field in which a user can search werkgebieden on a map.
 */

interface LeafletSearchInputProps {
    mapPanTo: (lng: number, lat: number, type: string) => void
}

const LeafletSearchInput = forwardRef<
    HTMLInputElement,
    LeafletSearchInputProps
>(({ mapPanTo }, ref) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [queryData, setQueryData] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    const suggestList = useRef(null)

    /**
     * Function to set the state of the searchQuery and use the value parameter in the locatieServerSuggestQuery function.
     */
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value

        setSearchQuery(value)
    }

    /**
     * Debounce location lookup
     */
    useDebounce(() => locatieServerSuggestQuery(searchQuery), 300, [
        searchQuery,
    ])

    /**
     * Function to import the API axiosLocatieServer and then get the lookupData through an API get request. Then the lookupData is used further in the function.
     */
    const locatieServerLookupQuery = (id: string, naam: string) => {
        getLookupData(id)
            .then(data => {
                setQueryData([])
                setSearchQuery(naam)

                const latLng = data.centroide_ll
                    .split('(')[1]
                    .split(')')[0]
                    .split(' ')
                const lat = parseFloat(latLng[0]).toFixed(20)
                const lng = parseFloat(latLng[1]).toFixed(20)

                mapPanTo(parseFloat(lng), parseFloat(lat), data.type)
                setShowSuggestions(false)
            })
            .catch(() => {
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    /**
     * Function to get the suggested query value input from user, import the axiosLocatieserver API and then use the get API to set queryData.
     */
    const locatieServerSuggestQuery = (value: string) => {
        if (value === '') {
            return setQueryData([])
        }

        getSuggestData(value)
            .then(data => {
                setQueryData(data.response.docs)
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled -', err.message)
                } else {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }

    /**
     * Function that selects the next/previous queryData.
     */
    const selectQueryDataItem = (nextOrPrevious: 'next' | 'previous') => {
        const currentIndex =
            document.activeElement?.getAttribute('data-index') || '1'

        let newIndex

        switch (nextOrPrevious) {
            case 'next':
                if (parseInt(currentIndex) === queryData.length) {
                    return
                }
                newIndex = parseInt(currentIndex) + 1
                break
            case 'previous':
                if (parseInt(currentIndex) === 1) {
                    typeof ref !== 'function' && ref?.current?.select()
                    return
                }
                newIndex = parseInt(currentIndex) - 1
                break
            default:
                newIndex = 1
        }

        const result = document.querySelectorAll(
            `[data-index='${newIndex}']`
        )[0] as HTMLLIElement
        result.focus()
    }

    return (
        <>
            <input
                className="w-64 h-8 px-5 py-3 text-sm leading-tight text-gray-700 border-none rounded-sm appearance-none focus:outline-none"
                type="text"
                ref={ref}
                placeholder="Zoeken op de kaart"
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
                value={searchQuery}
                onKeyDown={e => {
                    if (e.key === 'ArrowDown' && queryData.length > 0) {
                        const result = document.querySelectorAll(
                            `[data-index='1']`
                        )[0] as HTMLLIElement
                        result.focus()
                    }
                }}
            />
            {showSuggestions && queryData.length > 0 ? (
                <ul
                    id="searchQueryResults"
                    className="absolute top-0 w-56 mt-8 bg-white border-t border-gray-300 rounded-b-sm shadow"
                    ref={suggestList}>
                    {queryData.map((item: any, index) => (
                        <li
                            tabIndex={0}
                            className={`px-5 hover:underline hover:bg-gray-100 focus:underline focus:bg-gray-100 focus:ring`}
                            key={index}
                            data-index={index + 1}
                            onClick={() =>
                                locatieServerLookupQuery(
                                    item.id,
                                    item.weergavenaam
                                )
                            }
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    locatieServerLookupQuery(
                                        item.id,
                                        item.weergavenaam
                                    )
                                } else if (e.key === 'ArrowDown') {
                                    selectQueryDataItem('next')
                                } else if (e.key === 'ArrowUp') {
                                    selectQueryDataItem('previous')
                                }
                            }}>
                            <span
                                className={`w-full block text-sm text-gray-700 ${
                                    index === queryData.length - 1
                                        ? 'pt-2 pb-4'
                                        : 'border-b border-gray-300 py-2'
                                }`}>
                                {item.weergavenaam}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    )
})

export default LeafletSearchInput
