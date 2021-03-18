import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'url-search-params-polyfill'
import DOMPurify from 'dompurify'

import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import API
import axios from './../../API/axios'

// Import Data Model
import allDimensieConstants from './../../constants/dimensies'

// Import Components
import LoaderContent from './../../components/LoaderContent'

function getExcerpt(text) {
    if (!text) {
        return ''
    } else if (text.length > 250) {
        return text.substring(0, 250) + '...'
    } else {
        return text
    }
}

function getDimensieConstant(type) {
    switch (type) {
        case 'Ambities':
            return allDimensieConstants.AMBITIES
        case 'Belangen':
            return allDimensieConstants.BELANGEN
        case 'Beleidsbeslissingen':
            return allDimensieConstants.BELEIDSBESLISSINGEN
        case 'BeleidsRegels':
            return allDimensieConstants.BELEIDSREGELS
        case 'Doelen':
            return allDimensieConstants.DOELEN
        case 'Maatregelen':
            return allDimensieConstants.MAATREGELEN
        case 'Opgaven':
            return allDimensieConstants.OPGAVEN
        case 'Themas':
            return allDimensieConstants.THEMAS
        case 'Verordeningen':
            return allDimensieConstants.VERORDENINGSARTIKEL
        case 'Artikel':
            return allDimensieConstants.VERORDENINGSARTIKEL
        default:
            throw new Error(
                `Whoops! Het type '${type}' kan niet binnen de allDimensieConstants gevonden worden.`
            )
    }
}

function SearchResultItem({ item, searchQuery }) {
    function getContent() {
        const params = new URLSearchParams(
            document.location.search.substring(1)
        )

        // Get everything past the '=' of '?query=artikel'
        const query = params.get('query')

        const omschrijving = item.Omschrijving
            ? getExcerpt(item.Omschrijving)
            : ''

        const markedOmschrijving = omschrijving.replace(
            new RegExp(query, 'g'),
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

    let type = item.Type
    if (type === 'Beleidsregels') {
        type = 'BeleidsRegels'
    }

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
        <li className="py-5 border-b border-gray-300" key={item.UUID}>
            <Link
                className="group"
                to={
                    item.Type === 'Verordeningen'
                        ? `/detail/verordeningen/1/${item.UUID}?hoofdstuk=${
                              item.positionInStructure[0] !== undefined
                                  ? item.positionInStructure[0]
                                  : 'null'
                          }&nest_1=${
                              item.positionInStructure[1] !== undefined
                                  ? item.positionInStructure[1]
                                  : 'null'
                          }&nest_2=${
                              item.positionInStructure[2] !== undefined
                                  ? item.positionInStructure[2]
                                  : 'null'
                          }&nest_3=${
                              item.positionInStructure[3] !== undefined
                                  ? item.positionInStructure[3]
                                  : 'null'
                          }#${searchQuery}`
                        : `/detail/${overzichtURL}/${item.UUID}#${searchQuery}`
                }
            >
                <span
                    className="block text-sm text-gray-600"
                    data-test="search-result-type"
                >
                    {titleSingular}
                </span>
                <h2 className="block text-lg font-semibold text-primary group-hover:underline">
                    {content.Titel}
                </h2>
                <Omschrijving content={content} titleSingular={titleSingular} />
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
                {' ' + titleSingular.toLowerCase()}
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
        this.getAndSetVigerendeVerordeningenStructuur = this.getAndSetVigerendeVerordeningenStructuur.bind(
            this
        )
        this.generateVerordeningsPosition = this.generateVerordeningsPosition.bind(
            this
        )
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

    generateVerordeningsPosition(UUIDToFind) {
        if (!this.state.vigerendeVerordeningsStructuur) return []

        // Curren structure of vigerende verordeningsstructure
        const vigerendeVerordeningsStructuurChildren = this.state
            .vigerendeVerordeningsStructuur.Structuur.Children

        // Used to push in the indexes to traverse to the UUIDToFind
        let indexPathToUUID = []

        // Used to push the current index while traversing into the right index of indexPathToUUID. We increase/decrease on every nested level change.
        let indexTraversed = 0

        // Becomes true when we've found the UUIDToFind
        let pathFound = false

        // Func to recursively traverse through the children and find the UUID in the properties
        function traverseChildren(children) {
            if (pathFound) return

            // Returns foundIndex() of the UUIDToFind with the objects in the children array
            const indexOfUUIDInArray = findUUIDInArray(children)

            // For each child in the array we first check if the UUID exists in the childs, else we traverse one level to the children of each child and check recrusively from there
            if (indexOfUUIDInArray !== -1) {
                indexPathToUUID[indexTraversed] = indexOfUUIDInArray
                pathFound = true
            } else {
                children.forEach((child, childIndex) => {
                    // If item has no children OR pathFound equals true -> Return
                    if (
                        !child.Children ||
                        child.Children.length === 0 ||
                        pathFound
                    )
                        return

                    // Else push childIndex into indexPathToUUID,
                    indexPathToUUID[indexTraversed] = childIndex

                    // Increase indexTraversed because in the traverseChildren() call we traverse on level down
                    indexTraversed++
                    traverseChildren(child.Children)

                    // It is possible that we found the Path to the UUID in the traverseChildren() call above. If that is the case we want to return
                    if (pathFound) return

                    // Else we are done traversing through the children, we replace the item on the current indexPathToUUID index with a null value and then decrease the indexTraversed again
                    indexPathToUUID.splice(indexTraversed, 1, null)
                    indexTraversed--
                })
            }
        }

        // Find and return index of 'item.UUID === UUIDToFind', else returns -1
        function findUUIDInArray(children) {
            const indexOfUUID = children.findIndex(
                (item) => item.UUID === UUIDToFind
            )
            return indexOfUUID
        }

        // Initialize function
        traverseChildren(vigerendeVerordeningsStructuurChildren)

        // Return the found array with the path to the UUID
        return indexPathToUUID
    }

    addVerordeningsPositionToSearchResults(searchResults) {
        // We map over the searchResults. If the item is of the type 'Verordeningen' we find the position of the UUID in the verordeningenStructure
        // Else we return the original item
        const newSearchResults = searchResults.map((item) => {
            if (item.Type === 'Verordeningen') {
                const positionInStructure = this.generateVerordeningsPosition(
                    item.UUID
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

        if (searchFiltersOnly === 'beleidskeuzes') {
            searchFiltersOnly = 'beleidsbeslissingen'
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
                            e.Type !== 'Doelen' &&
                            e.Type !== 'Themas' &&
                            e.Type !== 'Belangen'
                    )
                    .filter(
                        (e) =>
                            (e.Type === 'Maatregelen' &&
                                e.Status !== 'Vigerend') ||
                            e.Type !== 'Maatregelen'
                    )

                this.setInitialOnPageFilters(searchResults)

                // The 'Verordenings' objects are placed in a structure, but we need to check what position exactly so we can link towards the correct 'Verordening' including the parameters to set the verordeningsobject as active in the view. e.g.:
                // /detail/verordeningen/102?hoofdstuk=0&nest_1=0&nest_2=0&nest_3=null
                const searchResultsWithVerordeningsPositions = this.addVerordeningsPositionToSearchResults(
                    searchResults
                )

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

                const searchResultsWithVerordeningsPositions = this.addVerordeningsPositionToSearchResults(
                    searchResults
                )

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
            geoSearchQuery: latLng.replace('-', ' '),
        })

        // Get werkingsgebieden
        import('./../../API/axiosGeoJSON').then((api) => {
            const [pointA, pointB] = searchGeoQuery.split(' ')
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
                .get('/verordeningstructuur')
                .then((res) => {
                    const vigerendeVerordening = res.data.find(
                        (item) => item.Status === 'Vigerend'
                    )
                    if (vigerendeVerordening) {
                        return vigerendeVerordening
                    } else if (res.data.length > 0) {
                        return res.data[0]
                    } else {
                        throw new Error('No data from API')
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
        const searchQuery = searchParams.get('query')
        const searchFiltersOnly = searchParams.get('only')
        const searchGeoQuery = searchParams.get('geoQuery')
        const latLng = searchParams.get('LatLng')

        if (!urlParams || urlParams.length === 0) {
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
        if (this.props.location.search !== prevProps.location.search) {
            this.setState(
                {
                    dataLoaded: false,
                },
                this.getSearchResults()
            )
        }
    }

    render() {
        // Beleidskeuzes
        // Ambities
        // Opgaven
        // Maatregelen
        // Verordening
        // Beleidsregels

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
        let [filterIsActive, amountOfFilters] = checkForActiveFilter(
            onPageFilters
        )

        const filters = [
            'Beleidsbeslissingen',
            'Ambities',
            'Opgaven',
            'Maatregelen',
            'Verordeningen',
            'BeleidsRegels',
        ].filter((e) => onPageFilters[e])

        return (
            <div className="container flex px-6 pb-8 mx-auto mt-12">
                <div className="w-1/4">
                    <Link
                        to={
                            this.state.searchQuery
                                ? `/?query=${this.state.searchQuery}`
                                : `/`
                        }
                        className={`text-gray-600 hover:text-gray-700 text-sm mb-4 inline-block group`}
                        id="button-back-to-previous-page"
                    >
                        <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
                        <span>Startpagina</span>
                    </Link>

                    {this.state.dataLoaded &&
                    this.state.searchFiltersOnly === null ? (
                        <React.Fragment>
                            <h2 className="block text-lg font-semibold text-primary group-hover:underline">
                                Filteren
                            </h2>
                            <ul id="filter-search-results" className="mt-4">
                                {onPageFilters.filterArray &&
                                onPageFilters.filterArray.length > 0
                                    ? filters.map((filter) => (
                                          <FilterItem
                                              key={filter}
                                              count={
                                                  onPageFilters[filter].count
                                              }
                                              handleFilter={this.handleFilter}
                                              checked={
                                                  !onPageFilters[filter].checked
                                              }
                                              item={filter}
                                          />
                                      ))
                                    : null}
                            </ul>
                        </React.Fragment>
                    ) : null}
                </div>

                <div className="w-2/4">
                    <span className="block text-xl font-bold opacity-25 text-primary-super-dark">
                        {this.state.searchQuery
                            ? `Zoekresultaten voor "${this.state.searchQuery}"`
                            : null}
                        {this.state.geoSearchQuery
                            ? `Zoekresultaten voor coördinaten "${this.state.geoSearchQuery}"`
                            : null}
                    </span>
                    <ul id="search-results">
                        {this.state.dataLoaded ? (
                            this.state.searchResults &&
                            this.state.searchResults.length > 0 ? (
                                this.state.searchResults.map((item, index) => {
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
                                                searchQuery={
                                                    this.state.urlParams
                                                }
                                                item={item}
                                                key={item.UUID}
                                            />
                                        )
                                    }
                                    return null
                                })
                            ) : (
                                <span className="block mt-8 text-sm italic text-gray-600">
                                    Geen resultaten
                                </span>
                            )
                        ) : (
                            <LoaderContent />
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}

const FilterItem = ({ handleFilter, checked, item, count }) => {
    const dimensieContants = getDimensieConstant(item)
    const titleSingular = dimensieContants.TITLE_SINGULAR

    const itemTitle =
        item === 'Beleidsbeslissingen'
            ? 'Beleidskeuzes'
            : item === 'Verordeningen'
            ? 'Artikelen'
            : item === 'Opgaven'
            ? 'Beleidsdoelen'
            : item

    return (
        <li key={item} className="mt-1 text-sm text-gray-700">
            <label
                className="cursor-pointer select-none"
                id={`filter-for-${titleSingular}`}
            >
                <input
                    className="mr-2 leading-tight"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleFilter(e)}
                    name={item}
                />
                <span>
                    {itemTitle} ({count})
                </span>
            </label>
        </li>
    )
}

export default RaadpleegZoekResultatenOverzicht
