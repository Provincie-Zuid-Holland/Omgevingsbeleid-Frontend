import React, { Component } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import "url-search-params-polyfill"
import DOMPurify from "dompurify"

// Import API
import axios from "./../../API/axios"

// Import Data Model
import allDimensieConstants from "./../../constants/dimensies"

// Import Utils
import generateVerordeningsPosition from "./../../utils/generateVerordeningsPosition"

// Import Components
// import LoaderContent from "./../../components/LoaderContent"
import LoaderCard from "./../../components/LoaderCard"
import Container from "./../../components/Container"
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"
import SearchBar from "./../../components/SearchBar"
import Footer from "./../../components/Footer"

function getExcerpt(text) {
    if (!text) {
        return ""
    } else if (text.length > 250) {
        return text.substring(0, 250) + "..."
    } else {
        return text
    }
}

function getDimensieConstant(type) {
    switch (type) {
        case "ambities":
            return allDimensieConstants.AMBITIES
        case "belangen":
            return allDimensieConstants.BELANGEN
        case "beleidskeuzes":
            return allDimensieConstants.BELEIDSKEUZES
        case "beleidsregels":
            return allDimensieConstants.BELEIDSREGELS
        case "beleidsprestaties":
            return allDimensieConstants.BELEIDSPRESTATIES
        case "maatregelen":
            return allDimensieConstants.MAATREGELEN
        case "beleidsdoelen":
            return allDimensieConstants.BELEIDSDOELEN
        case "themas":
            return allDimensieConstants.THEMAS
        case "verordeningen":
            return allDimensieConstants.VERORDENINGSARTIKEL
        case "artikel":
            return allDimensieConstants.VERORDENINGSARTIKEL
        default:
            throw new Error(
                `Oh no! The type '${type}' could not be found within allDimensieConstants...`
            )
    }
}

function SearchResultItem({ item, searchQuery, index }) {
    function getContent() {
        const params = new URLSearchParams(
            document.location.search.substring(1)
        )

        // Get everything past the '=' of '?query=artikel'
        const query = params.get("query")

        const omschrijving = item.Omschrijving
            ? getExcerpt(item.Omschrijving)
            : ""

        const markedOmschrijving = omschrijving.replace(
            new RegExp(query, "g"),
            `<mark class="marked-red">${query}</mark>`
        )

        return {
            setInnerHTML: true,
            content: {
                __html: markedOmschrijving,
            },
        }
    }

    const content = {
        Titel: item.Titel,
        Omschrijving: getContent(),
    }

    const type = item.Type
    const dimensieContants = getDimensieConstant(type)
    const overzichtURL = dimensieContants.SLUG_OVERVIEW
    const titleSingular = dimensieContants.TITLE_SINGULAR

    // Fallback for verordeningsitems that have not been found in the vigerende structure
    if (
        (item &&
            item.positionInStructure &&
            item.positionInStructure[0] === null) ||
        (item &&
            item.positionInStructure &&
            item.positionInStructure.length === 0)
    ) {
        return null
    }

    return (
        <li
            className={`py-4 md:pr-8 transition-colors duration-100 ease-in bg-white border-gray-300 group`}
            key={item.UUID}
        >
            <Link
                className="group"
                to={
                    item.Type === "Verordeningen"
                        ? `/detail/verordeningen/1/${item.UUID}?hoofdstuk=${
                              item.positionInStructure[0] !== undefined
                                  ? item.positionInStructure[0]
                                  : "null"
                          }&nest_1=${
                              item.positionInStructure[1] !== undefined
                                  ? item.positionInStructure[1]
                                  : "null"
                          }&nest_2=${
                              item.positionInStructure[2] !== undefined
                                  ? item.positionInStructure[2]
                                  : "null"
                          }&nest_3=${
                              item.positionInStructure[3] !== undefined
                                  ? item.positionInStructure[3]
                                  : "null"
                          }#${searchQuery}`
                        : `/detail/${overzichtURL}/${item.UUID}#${searchQuery}`
                }
            >
                <span
                    className="block text-sm opacity-75 text-pzh-blue"
                    data-test="search-result-type"
                >
                    {titleSingular}
                </span>
                <h2 className="block mt-1 text-lg font-bold group-hover:text-pzh-green text-pzh-blue group-hover:underline">
                    {content.Titel}
                </h2>
                {content.Omschrijving.setInnerHTML ? (
                    <p
                        className="mt-2"
                        dangerouslySetInnerHTML={content.Omschrijving.content}
                    ></p>
                ) : content.Omschrijving.content &&
                  content.Omschrijving.content.length > 0 ? (
                    <p className="mt-2">{content.Omschrijving.content}</p>
                ) : (
                    <p className="mt-2 italic">
                        Er is nog geen omschrijving voor deze
                        {" " + titleSingular.toLowerCase()}
                    </p>
                )}
            </Link>
        </li>
    )
}

const Omschrijving = ({ content, titleSingular }) => {
    if (content.Omschrijving.setInnerHTML) {
        const cleanHTML = DOMPurify.sanitize(
            content.Omschrijving.content.__html
        )

        return (
            <p
                className="mt-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
            ></p>
        )
    } else if (
        content.Omschrijving.content &&
        content.Omschrijving.content.length > 0
    ) {
        return (
            <p className="mt-2 text-gray-700">{content.Omschrijving.content}</p>
        )
    } else {
        return (
            <p className="mt-2 italic text-gray-700">
                Er is nog geen omschrijving voor deze
                {" " + titleSingular.toLowerCase()}
            </p>
        )
    }
}

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

const SearchFilterSection = ({
    loaded,
    searchFiltersOnly,
    onPageFilters,
    filters,
    handleFilter,
}) => {
    const searchFilterCategories = {
        Omgevingsvisie: ["ambities", "beleidsdoelen", "beleidskeuzes"],
        Omgevingsprogramma: ["maatregelen"],
        Uitvoering: ["Beleidsregels"],
    }

    if (!loaded) {
        return (
            <div className="col-span-6 pr-24 mt-0 md:col-span-2 md:mt-4">
                <LoaderCard height="100" />
            </div>
        )
    }

    return (
        <div className="col-span-6 mt-0 md:col-span-2 md:mt-4">
            {searchFiltersOnly === null &&
            onPageFilters?.filterArray?.length > 0
                ? Object.keys(searchFilterCategories)
                      .filter((category) =>
                          filters.some((filter) =>
                              searchFilterCategories[category].includes(filter)
                          )
                      )
                      .map((category) => (
                          <div>
                              <span className="mt-2 font-bold text-pzh-blue">
                                  {category}
                              </span>
                              <ul id="filter-search-results" className="mb-4">
                                  {filters
                                      .filter((filterCategory) =>
                                          searchFilterCategories[
                                              category
                                          ].includes(filterCategory)
                                      )
                                      .map((filter) => (
                                          <FilterItem
                                              key={filter}
                                              count={
                                                  onPageFilters[filter].count
                                              }
                                              handleFilter={handleFilter}
                                              checked={
                                                  !onPageFilters[filter].checked
                                              }
                                              item={filter}
                                          />
                                      ))}
                              </ul>
                          </div>
                      ))
                : null}
        </div>
    )
}

const FilterItem = ({ handleFilter, checked, item, count }) => {
    const dimensieContants = getDimensieConstant(item)
    const titleSingular = dimensieContants.TITLE_SINGULAR
    const capitilizeFirstCharacter = (string) =>
        titleSingular.charAt(0).toUpperCase() + titleSingular.slice(1)
    const getItemTitle = (item) => {
        return item === "Verordeningen"
            ? "Artikelen"
            : capitilizeFirstCharacter(item)
    }
    const itemTitle = getItemTitle(item)

    return (
        <li key={item} className="mt-1 text-pzh-blue-dark">
            <label
                className="flex items-center cursor-pointer select-none"
                id={`filter-for-${titleSingular}`}
            >
                <input
                    className="mr-2 leading-tight w-3a h-3a text-pzh-green form-checkbox"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleFilter(e)}
                    name={item}
                />
                <Text type="span" className="pt-1">
                    {itemTitle} ({count})
                </Text>
            </label>
        </li>
    )
}

export default RaadpleegZoekResultatenOverzicht
