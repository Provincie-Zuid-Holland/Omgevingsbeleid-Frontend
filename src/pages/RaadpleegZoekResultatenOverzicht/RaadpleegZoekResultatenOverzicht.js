import React, { Component } from "react"
import { toast } from "react-toastify"
import "url-search-params-polyfill"

import axios from "./../../API/axios"

import generateVerordeningsPosition from "./../../utils/generateVerordeningsPosition"

import LoaderCard from "./../../components/LoaderCard"
import Container from "./../../components/Container"
import Heading from "./../../components/Heading"
import SearchBar from "./../../components/SearchBar"
import Footer from "./../../components/Footer"

import SearchResultItem from "./SearchResultItem"
import SearchFilterSection from "./SearchFilterSection"
class RaadpleegZoekResultatenOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchQuery: null,
            searchFiltersOnly: null,
            searchResults: null,
            dataLoaded: false,
            onPageFilters: [],
        }
        this.getAndSetVigerendeVerordeningenStructuur =
            this.getAndSetVigerendeVerordeningenStructuur.bind(this)
        this.generateVerordeningsPosition =
            generateVerordeningsPosition.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
    }

    handleFilter(e) {
        const name = e.target.name
        let newOnPageFilters = this.state.onPageFilters
        newOnPageFilters[name].checked = !newOnPageFilters[name].checked
        this.setState({
            onPageFilters: newOnPageFilters,
        })
    }

    setInitialOnPageFilters(searchResults) {
        // In the filterArray we place all the types of objects we received from the API
        let filterArray = []

        // In the mainFilterObject we place the types as properties. On those properties we place the metaData about the object type, e.g. the amount of items we have received in the response. The mainFilterObject will be set in state to display in the UI.
        let mainFilterObject = {}

        searchResults.forEach((item) => {
            // Create filter object with meta info about the filter type
            const filterObject = {
                name: item.Type,
                checked: true,
                count: 1,
            }

            if (!filterArray.includes(item.Type)) {
                // If we map over a new Type we push the Type into the filterArray and initialize the filterObject as a property on the mainFilterObject
                filterArray.push(item.Type)
                mainFilterObject[item.Type] = filterObject
            } else {
                // If it already exists we increase the count of this property
                mainFilterObject[item.Type].count++
            }
        })

        mainFilterObject.filterArray = filterArray

        this.setState({
            onPageFilters: mainFilterObject,
        })
    }

    addVerordeningsPositionToSearchResults(searchResults) {
        // We map over the searchResults. If the item is of the type 'Verordeningen' we find the position of the UUID in the verordeningenStructure
        // Else we return the original item
        const newSearchResults = searchResults.map((item) => {
            if (item.Type === "Verordeningen") {
                const positionInStructure = this.generateVerordeningsPosition(
                    item.UUID,
                    this.state.vigerendeVerordeningsStructuur
                )
                item.positionInStructure = positionInStructure
                return item
            } else {
                return item
            }
        })
        return newSearchResults
    }

    getSearchNormaleQuery(searchQuery, searchFiltersOnly) {
        this.setState({
            searchQuery: searchQuery,
        })

        if (searchFiltersOnly === "beleidskeuzes") {
            searchFiltersOnly = "beleidskeuzes"
        }

        axios
            .get(
                `/search?query=${searchQuery}&limit=10${
                    searchFiltersOnly ? `&only=${searchFiltersOnly}` : ``
                }`
            )
            .then((res) => {
                const searchResults = res.data
                    .filter(
                        (e) =>
                            e.Type !== "Beleidsprestaties" &&
                            e.Type !== "Themas" &&
                            e.Type !== "Belangen"
                    )
                    .filter(
                        (e) =>
                            (e.Type === "Maatregelen" &&
                                e.Status !== "Vigerend") ||
                            e.Type !== "Maatregelen"
                    )

                this.setInitialOnPageFilters(searchResults)

                // The 'Verordenings' objects are placed in a structure, but we need to check what position exactly so we can link towards the correct 'Verordening' including the parameters to set the verordeningsobject as active in the view. e.g.:
                // /detail/verordeningen/102?hoofdstuk=0&nest_1=0&nest_2=0&nest_3=null
                const searchResultsWithVerordeningsPositions =
                    this.addVerordeningsPositionToSearchResults(searchResults)

                this.setState({
                    searchFiltersOnly: searchFiltersOnly,
                    searchResults: searchResultsWithVerordeningsPositions,
                    dataLoaded: true,
                })
            })
            .catch((err) => {
                this.setState(
                    {
                        dataLoaded: true,
                    },
                    () => {
                        console.error(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    }
                )
            })
    }

    getBeleidOpBasisVanWerkingsgebieden(werkingsgebiedenArray) {
        axios
            .get(`/search/geo?query=${werkingsgebiedenArray}`)
            .then((res) => {
                const searchResults = res.data

                // Creates the state to display the filter UI
                this.setInitialOnPageFilters(searchResults)

                const searchResultsWithVerordeningsPositions =
                    this.addVerordeningsPositionToSearchResults(searchResults)

                this.setState({
                    searchFiltersOnly: null,
                    searchResults: searchResultsWithVerordeningsPositions,
                    dataLoaded: true,
                })
            })
            .catch((err) => {
                this.setState({
                    dataLoaded: true,
                })
                console.error(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    // searchGeoQuery parameter is used to get the Werkingsgebieden
    // LatLng is set in state so we can display it in the UI above the results
    getSearchGeoQuery(searchGeoQuery, latLng) {
        this.setState({
            geoSearchQuery: latLng.replace("-", " "),
        })

        // Get werkingsgebieden
        import("./../../API/axiosGeoJSON").then((api) => {
            const [pointA, pointB] = searchGeoQuery.split(" ")
            api.getWerkingsGebieden(pointA, pointB)
                .then((data) => {
                    // Then get for each werkingsgebied the appropriate regulations and policies

                    // Create array containing all the UUIDs we received from the .getWerkingsGebieden Query
                    const WerkingsgebiedenUUIDS = data.map(
                        (item) => item.properties.UUID
                    )
                    if (WerkingsgebiedenUUIDS.length === 0) {
                        this.setState({
                            searchFiltersOnly: null,
                            searchResults: null,
                            dataLoaded: true,
                        })
                    } else {
                        this.getBeleidOpBasisVanWerkingsgebieden(
                            WerkingsgebiedenUUIDS
                        )
                    }
                })
                .catch((err) => {
                    console.error(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        })
    }

    async getAndSetVigerendeVerordeningenStructuur() {
        try {
            const data = await axios
                .get("/verordeningstructuur")
                .then((res) => {
                    const vigerendeVerordening = res.data.find(
                        (item) => item.Status === "Vigerend"
                    )
                    if (vigerendeVerordening) {
                        return vigerendeVerordening
                    } else if (res.data.length > 0) {
                        return res.data[0]
                    } else {
                        throw new Error("No data from API")
                    }
                })
            this.setState(
                {
                    vigerendeVerordeningsStructuur: data,
                },
                () => {
                    return data
                }
            )
        } catch {
            toast(process.env.REACT_APP_ERROR_MSG)
        }
    }

    getSearchResults() {
        const urlParams = this.props.location.search

        const searchParams = new URLSearchParams(urlParams)
        const searchQuery = searchParams.get("query")
        const searchFiltersOnly = searchParams.get("only")
        const searchGeoQuery = searchParams.get("geoQuery")
        const latLng = searchParams.get("LatLng")

        if (!urlParams || urlParams.length === 0) {
            console.log("NO SEARCH QUERY")
            this.setState({ dataLoaded: true })
            return
        }

        this.setState({
            urlParams: urlParams,
        })

        this.getAndSetVigerendeVerordeningenStructuur().then(() => {
            if (searchQuery) {
                this.getSearchNormaleQuery(searchQuery, searchFiltersOnly)
            } else if (searchGeoQuery) {
                this.getSearchGeoQuery(searchGeoQuery, latLng)
            }
        })
    }

    componentDidMount() {
        this.getSearchResults()
    }

    componentDidUpdate(prevProps) {
        // If new search query in URL we get the new results
        if (
            this.props.location.search !== prevProps.location.search &&
            this.props.location.search
        ) {
            this.setState(
                {
                    dataLoaded: false,
                },
                this.getSearchResults()
            )
        }
    }

    render() {
        const checkForActiveFilter = (onPageFilters) => {
            if (!onPageFilters || !onPageFilters.filterArray) return []

            let activeFilter = false
            let amountOfFilters = 0

            onPageFilters.filterArray.forEach((filterType) => {
                if (!onPageFilters[filterType].checked) {
                    activeFilter = true
                    amountOfFilters++
                }
            })

            return [activeFilter, amountOfFilters]
        }

        const onPageFilters = this.state.onPageFilters
        let [filterIsActive, amountOfFilters] =
            checkForActiveFilter(onPageFilters)

        const filters = [
            "beleidskeuzes",
            "ambities",
            "beleidsprestaties",
            "beleidsdoelen",
            "maatregelen",
            "beleidsregels",
        ].filter((e) => onPageFilters[e])

        return (
            <>
                <Container
                    className="bg-pzh-blue-light"
                    style={{ height: 96 + "px" }}
                >
                    <div className="flex items-center col-span-2">
                        <Heading
                            level="1"
                            className="relative mt-2 font-bold text-white"
                            color="text-white"
                        >
                            Zoeken
                        </Heading>
                    </div>
                    <div className="flex items-center col-span-4">
                        <SearchBar className="rounded-sm" />
                    </div>
                </Container>
                <Container className="mt-4">
                    <SearchFilterSection
                        loaded={this.state.dataLoaded}
                        searchFiltersOnly={this.state.searchFiltersOnly}
                        onPageFilters={onPageFilters}
                        filters={filters}
                        handleFilter={this.handleFilter}
                    />

                    <div className="col-span-6 md:col-span-4">
                        <ul id="search-results" className="mb-12 ">
                            {this.state.dataLoaded ? (
                                this.state.searchResults &&
                                this.state.searchResults.length > 0 ? (
                                    this.state.searchResults.map(
                                        (item, index) => {
                                            if (
                                                (filterIsActive &&
                                                    amountOfFilters > 0 &&
                                                    !onPageFilters[item.Type]
                                                        .checked) ||
                                                (!filterIsActive &&
                                                    amountOfFilters === 0)
                                            ) {
                                                return (
                                                    <SearchResultItem
                                                        index={index}
                                                        searchQuery={
                                                            this.state.urlParams
                                                        }
                                                        item={item}
                                                        key={item.UUID}
                                                    />
                                                )
                                            }
                                            return null
                                        }
                                    )
                                ) : (
                                    <span className="block mt-8 text-sm italic text-gray-600">
                                        Geen resultaten
                                    </span>
                                )
                            ) : (
                                <div className="mt-4">
                                    <LoaderCard height="150" />
                                    <LoaderCard height="150" />
                                    <LoaderCard height="150" />
                                </div>
                            )}
                        </ul>
                    </div>
                </Container>
                <Footer />
            </>
        )
    }
}

export default RaadpleegZoekResultatenOverzicht
