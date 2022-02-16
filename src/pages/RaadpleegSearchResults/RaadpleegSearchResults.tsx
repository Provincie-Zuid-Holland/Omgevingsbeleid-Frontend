import { useEffect, useState } from 'react'
import 'url-search-params-polyfill'

import { getWerkingsGebieden } from '@/api/axiosGeoJSON'
import { getSearch } from '@/api/fetchers'
import { GetSearch200Item } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import Container from '@/components/Container/Container'
import Footer from '@/components/Footer'
import Heading from '@/components/Heading'
import { LoaderCard } from '@/components/Loader'
import SearchBar from '@/components/SearchBar'
import SearchResultItem from '@/components/SearchResultItem'
import useSearchResultFilters from '@/hooks/useSearchResultFilters'
import handleError from '@/utils/handleError'

import Pagination from './Pagination'
import SearchFilterSection from './SearchFilterSection'

const RaadpleegSearchResults = () => {
    const [searchResults, setSearchResults] = useState<GetSearch200Item[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)

    const location = document.location.toString()
    const searchParams = new URL(location).searchParams
    const paramTextQuery = searchParams.get('query')
    const paramOnly = searchParams.get('only')
    const paramGeoQuery = searchParams.get('geoQuery')

    const { onPageFilters, setOnPageFilters } = useSearchResultFilters()

    useEffect(() => {
        const textualSearchQuery = async () => {
            if (!paramTextQuery) {
                setDataLoaded(true)
                return
            }

            try {
                const searchResults = await getSearch({
                    query: paramTextQuery,
                    limit: 20,
                    ...(paramOnly && { only: paramOnly }),
                })
                setSearchResults(searchResults)
                setOnPageFilters({
                    type: 'initFilters',
                    searchResultItems: searchResults,
                })
                setDataLoaded(true)
            } catch (error) {
                let message = 'Unknown Error'
                if (error instanceof Error) message = error.message
                handleError(message)
                setDataLoaded(true)
            }
        }

        /**
         * Gets the intersecting werkingsgebieden based on the x & y from the leaflet map
         * Then queries the beleid that is connected to these werkingsgebieden
         */
        const geoSearchQuery = async () => {
            if (!paramGeoQuery) {
                setDataLoaded(true)
                return
            }

            try {
                // Get point A and Point B from the URL Parameter
                const [pointA, pointB] = paramGeoQuery.split(' ')
                const werkingsgebieden = await getWerkingsGebieden(
                    pointA,
                    pointB
                )
                const werkingsgebiedenUUIDS = werkingsgebieden.map(
                    (item: any) => item.properties.UUID
                )

                if (werkingsgebiedenUUIDS.length === 0) return

                const searchResults: GetSearch200Item[] = await axios
                    .get(`/search/geo?query=${werkingsgebiedenUUIDS}`)
                    .then(res => res.data)

                setOnPageFilters({
                    type: 'initFilters',
                    searchResultItems: searchResults,
                })
                setDataLoaded(true)
                setSearchResults(searchResults)
            } catch (error) {
                let message = 'Unknown Error'
                if (error instanceof Error) message = error.message
                handleError(message)
                setDataLoaded(true)
            }
        }

        const initialize = () => {
            setDataLoaded(false)
            if (paramTextQuery) {
                // There is a text query
                textualSearchQuery()
            } else if (paramGeoQuery) {
                // There is a geo query
                geoSearchQuery()
            } else {
                setDataLoaded(true)
            }
        }

        initialize()
    }, [paramGeoQuery, paramTextQuery, setOnPageFilters, paramOnly])

    return (
        <>
            <Container
                className="bg-pzh-blue-light"
                style={{ height: 96 + 'px' }}>
                <div className="flex items-center col-span-2">
                    <Heading
                        level="1"
                        className="relative mt-2 font-bold text-white"
                        color="text-white">
                        Zoeken
                    </Heading>
                </div>
                <div className="flex items-center col-span-4">
                    <SearchBar className="rounded-sm" />
                </div>
            </Container>
            <Container className="pb-16 mt-4">
                <SearchFilterSection
                    loaded={dataLoaded}
                    onPageFilters={onPageFilters}
                    setOnPageFilters={setOnPageFilters}
                />

                <div className={`col-span-6 md:col-span-4`}>
                    {dataLoaded && searchResults.length > 0 ? (
                        <>
                            <ul id="search-results" className="mb-4">
                                {searchResults
                                    /**
                                     * By default none of the filters are active, if so return all
                                     * If there is one or more filter checked return the checked
                                     */
                                    .filter(item => {
                                        const filterIsActive = Object.keys(
                                            onPageFilters.filterState
                                        ).some(
                                            filter =>
                                                onPageFilters.filterState[
                                                    filter
                                                ].checked
                                        )

                                        if (!item.Type) {
                                            return false
                                        } else if (
                                            filterIsActive &&
                                            onPageFilters.filterState[item.Type]
                                                ?.checked
                                        ) {
                                            return true
                                        } else if (!filterIsActive) {
                                            return true
                                        } else {
                                            return false
                                        }
                                    })
                                    .map(item => (
                                        <SearchResultItem
                                            searchQuery={null}
                                            item={item}
                                            key={item.UUID}
                                        />
                                    ))}
                            </ul>
                            {paramTextQuery ? (
                                <Pagination
                                    setOnPageFilters={setOnPageFilters}
                                    setSearchResults={setSearchResults}
                                    searchResults={searchResults}
                                />
                            ) : null}
                        </>
                    ) : dataLoaded && searchResults.length === 0 ? (
                        <span className="block mt-8 text-sm italic text-gray-600">
                            Geen resultaten
                        </span>
                    ) : !dataLoaded ? (
                        <div className="mt-4">
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                        </div>
                    ) : null}
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default RaadpleegSearchResults
