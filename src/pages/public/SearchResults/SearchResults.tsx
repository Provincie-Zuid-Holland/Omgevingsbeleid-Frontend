import 'url-search-params-polyfill'

import { Heading } from '@pzh-ui/components'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useMedia } from 'react-use'

import { getSearch } from '@/api/fetchers'
import { GetSearch200ResultsItem } from '@/api/fetchers.schemas'
import Container from '@/components/Container/Container'
import { LoaderCard } from '@/components/Loader'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'
import SearchFilterSection from '@/components/SearchFilterSection'
import SearchResultItem from '@/components/SearchResultItem'
import useSearchFilterStore from '@/hooks/useSearchFilterStore'
import useSearchParam from '@/hooks/useSearchParam'
import handleError from '@/utils/handleError'

const SearchResults = () => {
    const initializeFilters = useSearchFilterStore(
        state => state.initializeFilters
    )
    const filterState = useSearchFilterStore(state => state.filterState)
    const [searchResults, setSearchResults] = useState<
        GetSearch200ResultsItem[]
    >([])
    const [searchResultsTotal, setSearchResultsTotal] = useState(0)
    const [dataLoaded, setDataLoaded] = useState(false)
    const [initializedQuery, setInitializedQuery] = useState<null | string>(
        null
    )
    const { get, set, remove } = useSearchParam()
    const [paramTextQuery, paramOnly, filter] = get(['query', 'only', 'filter'])
    const isMobile = useMedia('(max-width: 768px)')

    useEffect(() => {
        if (initializedQuery !== null && initializedQuery === paramTextQuery)
            return

        const textualSearchQuery = async () => {
            if (!paramTextQuery) {
                setDataLoaded(true)
                return
            }

            try {
                const { results, total = 0 } = await getSearch({
                    query: paramTextQuery,
                    limit: 20,
                    ...(paramOnly && { only: paramOnly }),
                })
                initializeFilters(results || [], false, filter)
                setSearchResults(results || [])
                setSearchResultsTotal(total)
                setDataLoaded(true)
            } catch (error) {
                let message = 'Unknown Error'
                if (error instanceof Error) message = error.message
                handleError(message)
                setDataLoaded(true)
            }
        }

        setDataLoaded(false)
        textualSearchQuery()
        setInitializedQuery(paramTextQuery)
    }, [paramTextQuery, paramOnly, initializeFilters, filter, initializedQuery])

    const filteredSearchResults = useMemo(() => {
        const acceptedTypes = [
            'ambities',
            'beleidsdoelen',
            'beleidskeuzes',
            'maatregelen',
            'Beleidsregels',
        ]
        /**
         * By default none of the filters are active, if so return all
         * If there is one or more filter checked return the checked
         */
        return searchResults.filter(item => {
            const filterIsActive = Object.keys(filterState).some(
                filter => filterState[filter].checked
            )

            if (!item.Type) {
                return false
            } else if (!acceptedTypes.includes(item.Type)) {
                return false
            } else if (filterIsActive && filterState[item.Type]?.checked) {
                return true
            } else if (!filterIsActive) {
                return true
            } else {
                return false
            }
        })
    }, [searchResults, filterState])

    useEffect(() => {
        const checkedFilters = Object.keys(filterState).filter(
            key => filterState[key].checked
        )

        if (checkedFilters.length) {
            set('filter', checkedFilters)
        } else {
            remove('filter')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterState])

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Zoekresultaten</title>
            </Helmet>
            <Container
                className="z-10 md:sticky bg-pzh-blue"
                style={isMobile ? {} : { height: 96 + 'px', top: '96px' }}>
                <div className="flex items-center col-span-6 md:col-span-2">
                    <Heading
                        level="1"
                        className="relative mt-4 font-bold text-white md:mt-2"
                        color="text-white">
                        Zoeken
                    </Heading>
                </div>
                <div className="flex items-center w-full col-span-6 mt-2 mb-4 md:mt-0 md:mb-0 md:w-auto md:col-span-4">
                    <SearchBar />
                </div>
            </Container>
            <Container className="pb-16 mt-4">
                <SearchFilterSection
                    searchResults={searchResults}
                    loaded={dataLoaded}
                />

                <div className={`col-span-6 md:col-span-4`}>
                    {dataLoaded && searchResults.length > 0 ? (
                        <>
                            <ul id="search-results" className="mb-4">
                                {filteredSearchResults.map(item => (
                                    <SearchResultItem
                                        searchQuery={null}
                                        item={item}
                                        key={item.UUID}
                                    />
                                ))}
                            </ul>
                            {paramTextQuery && (
                                <Pagination
                                    setSearchResults={setSearchResults}
                                    searchResults={searchResults}
                                    limit={20}
                                    total={searchResultsTotal}
                                />
                            )}
                        </>
                    ) : dataLoaded && searchResults.length === 0 ? (
                        <h2 className="block mt-8 text-pzh-gray-600">
                            Geen resultaten
                        </h2>
                    ) : !dataLoaded ? (
                        <div className="mt-4">
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                        </div>
                    ) : null}
                </div>
            </Container>
        </>
    )
}

export default SearchResults
