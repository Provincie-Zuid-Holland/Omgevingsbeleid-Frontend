import { useEffect, useState } from "react"
import "url-search-params-polyfill"
import { useSearchParam } from "react-use"

import axios from "./../../API/axios"
import { getWerkingsGebieden } from "./../../API/axiosGeoJSON"

import LoaderCard from "./../../components/LoaderCard"
import SearchBar from "./../../components/SearchBar"

import useSearchResultFilters from "./useSearchResultFilters"
import SearchFilterSection from "./SearchFilterSection"
import SearchResultItem from "./SearchResultItem"
import Pagination from "./Pagination"

const RaadpleegSearchResults = () => {
    const [searchResults, setSearchResults] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false)

    const paramTextQuery = useSearchParam("query")
    const paramOnly = useSearchParam("only")
    const paramGeoQuery = useSearchParam("geoQuery")

    const { onPageFilters, setOnPageFilters } = useSearchResultFilters()

    useEffect(() => {
        const textualSearchQuery = async () => {
            if (!paramTextQuery) {
                setDataLoaded(true)
                return
            }

            try {
                const searchResults = await axios
                    .get(
                        `/search?query=${paramTextQuery}&limit=20${
                            paramOnly ? `&only=${paramOnly}` : ``
                        }`
                    )
                    .then((res) => res.data)
                setSearchResults(searchResults)
                setOnPageFilters({
                    type: "initFilters",
                    searchResultItems: searchResults,
                })
                setDataLoaded(true)
            } catch (error) {
                let message = "Unknown Error"
                if (error instanceof Error) message = error.message
                console.log(message)
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
                const [pointA, pointB] = paramGeoQuery.split(" ")
                const werkingsgebieden = await getWerkingsGebieden(
                    pointA,
                    pointB
                )

                const werkingsgebiedenUUIDS = werkingsgebieden.map(
                    (item) => item.properties.UUID
                )

                if (werkingsgebiedenUUIDS.length === 0) return

                const searchResults = await axios
                    .get(`/search/geo?query=${werkingsgebiedenUUIDS}`)
                    .then((res) => res.data)

                setOnPageFilters({
                    type: "initFilters",
                    searchResultItems: searchResults,
                })
                setDataLoaded(true)
                setSearchResults(searchResults)
            } catch (error) {
                let message = "Unknown Error"
                if (error instanceof Error) message = error.message
                console.error(message)
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
            <div
                className={`pzh-container grid grid-cols-6 gap-x-10 gap-y-0 pr-4 mx-auto bg-pzh-blue-light`}
                style={{ height: 96 + "px", marginTop: "-60px" }}
            >
                <div className="flex items-center col-span-2">
                    <h1
                        style={{
                            hyphens: "manual",
                            fontSize: "2.4rem",
                            lineHeight: "2.8rem",
                        }}
                        className={`break-words relative mt-2 font-bold text-white`}
                    >
                        Zoeken
                    </h1>
                </div>
                <div className="flex items-center col-span-4">
                    <SearchBar
                        componentInNavbar={false}
                        className="rounded-sm"
                    />
                </div>
            </div>
            <div
                className={`pzh-container grid grid-cols-6 gap-x-10 gap-y-0 pr-4 mx-auto mt-4 pb-16`}
            >
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
                                    .filter((item) => {
                                        const filterIsActive = Object.keys(
                                            onPageFilters.filterState
                                        ).some(
                                            (filter) =>
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
                                    .map((item) => (
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
            </div>
        </>
    )
}

export default RaadpleegSearchResults
