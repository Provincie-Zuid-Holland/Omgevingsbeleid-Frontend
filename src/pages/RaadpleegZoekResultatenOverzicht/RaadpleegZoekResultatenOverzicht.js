import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'url-search-params-polyfill'

// Import API
import axios from './../../API/axios'

// Import Data Model
// import dataModel from './../../App/dataModel'
import allDimensieConstants from './../../constants/dimensies'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import LoaderContent from './../../components/LoaderContent'

function getExcerpt(text) {
    if (text.length > 250) {
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
    function getContent(propertyName) {
        console.log(item)
        console.log(searchQuery)

        // Get everything past the '=' of '?query=artikel'
        const query = searchQuery.slice(
            searchQuery.indexOf('=') + 1,
            searchQuery.length
        )

        const omschrijving = getExcerpt(item.Omschrijving)

        return {
            setInnerHTML: true,
            content: {
                __html: omschrijving.replace(
                    new RegExp(query, 'g'),
                    `<span class="search-highlight">${query}</span>`
                ),
            },
        }
    }

    const content = {
        Titel: item.Titel,
        Omschrijving: getContent('Omschrijving'),
    }

    let type = item.Type
    if (type === 'Beleidsregels') {
        type = 'BeleidsRegels'
    }

    const dimensieContants = getDimensieConstant(type)
    const overzichtURL = dimensieContants.SLUG_OVERZICHT
    const titelEnkelvoud = dimensieContants.TITEL_ENKELVOUD

    return (
        <li className="py-5 border-b border-gray-300" key={item.UUID}>
            <Link
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
                <h2 className="block font-serif text-gray-800 text-l">
                    {content.Titel}
                </h2>
                <span className="block text-sm italic text-gray-600">
                    {titelEnkelvoud}
                </span>
                {content.Omschrijving.setInnerHTML ? (
                    <p
                        className="mt-2 text-sm text-gray-700"
                        dangerouslySetInnerHTML={content.Omschrijving.content}
                    ></p>
                ) : content.Omschrijving.content &&
                  content.Omschrijving.content.length > 0 ? (
                    <p className="mt-2 text-sm text-gray-700">
                        {content.Omschrijving.content}
                    </p>
                ) : (
                    <p className="mt-2 text-sm italic text-gray-700">
                        Er is nog geen omschrijving voor deze
                        {' ' + titelEnkelvoud.toLowerCase()}
                    </p>
                )}
            </Link>
        </li>
    )
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
    }

    handleFilter(e, index) {
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

        searchResults.forEach(item => {
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
        // Curren structure of vigerende verordeningsstructure
        const vigerendeVerordeningsStructuur = this.state
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
                item => item.UUID === UUIDToFind
            )
            return indexOfUUID
        }

        // Initialize function
        traverseChildren(vigerendeVerordeningsStructuur)

        // Return the found array with the path to the UUID
        return indexPathToUUID
    }

    addVerordeningsPositionToSearchResults(searchResults) {
        // We map over the searchResults. If the item is of the type 'Verordeningen' we find the position of the UUID in the verordeningenStructure
        // Else we return the original item
        const newSearchResults = searchResults.map(item => {
            if (item.Type === 'Verordeningen') {
                // getPositionOfElement(item.UUID.toLowerCase())
                const positionInStructure = this.generateVerordeningsPosition(
                    item.UUID.toLowerCase()
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

        axios
            .get(
                `/search?query=${searchQuery}&limit=10${
                    searchFiltersOnly ? `&only=${searchFiltersOnly}` : ``
                }`
            )
            .then(res => {
                const searchResults = res.data
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
            .catch(err => {
                this.setState(
                    {
                        dataLoaded: true,
                    },
                    () => {
                        console.log(err)
                        toast('Er is iets mis gegaan')
                    }
                )
            })
    }

    getBeleidOpBasisVanWerkingsgebieden(werkingsgebiedenArray) {
        axios
            .get(`/search/geo?query=${werkingsgebiedenArray}`)
            .then(res => {
                const searchResults = res.data
                this.setInitialOnPageFilters(searchResults)
                this.setState(
                    {
                        searchFiltersOnly: null,
                        searchResults: searchResults,
                        dataLoaded: true,
                    },
                    () => console.log(this.state)
                )
            })
            .catch(err => {
                this.setState(
                    {
                        dataLoaded: true,
                    },
                    () => toast('Er is iets mis gegaan')
                )
            })
    }

    getSearchGeoQuery(searchGeoQuery, latLng) {
        this.setState({
            geoSearchQuery: latLng.replace('-', ' '),
        })

        import('./../../API/axiosGeoJSON').then(api => {
            api.getWerkingsGebieden(searchGeoQuery)
                .then(data => {
                    console.log(data)
                    const WerkingsgebiedenUUIDS = data.map(
                        item => item.properties.UUID
                    )
                    this.getBeleidOpBasisVanWerkingsgebieden(
                        WerkingsgebiedenUUIDS
                    )
                })
                .catch(function(err) {
                    console.log(err)
                })
        })
    }

    async getAndSetVigerendeVerordeningenStructuur() {
        try {
            const data = await axios
                .get('/verordeningstructuur')
                .then(res => res.data.find(item => item.Status === 'Vigerend'))
            this.setState(
                {
                    vigerendeVerordeningsStructuur: data,
                },
                () => {
                    console.log(this.state)
                    return data
                }
            )
        } catch {
            toast('Er is iets mis gegaan')
        }
    }

    componentDidMount() {
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

    render() {
        console.log(this.state)

        return (
            <div className="container flex px-6 pb-8 mx-auto mt-12">
                <div className="w-1/4">
                    <ButtonBackToPage
                        terugNaar="startpagina"
                        url={
                            this.state.searchQuery
                                ? `/?query=${this.state.searchQuery}`
                                : `/`
                        }
                    />
                    <h2 className="block mt-6 font-serif text-gray-700 text-l">
                        Filteren
                    </h2>
                    <ul className="mt-4">
                        {this.state.onPageFilters.filterArray &&
                        this.state.onPageFilters.filterArray.length > 0
                            ? this.state.onPageFilters.filterArray.map(
                                  (item, index) => (
                                      <li
                                          key={item}
                                          className="mt-1 text-sm text-gray-700"
                                      >
                                          <label className="cursor-pointer select-none">
                                              <input
                                                  className="mr-2 leading-tight"
                                                  type="checkbox"
                                                  checked={
                                                      this.state.onPageFilters[
                                                          item
                                                      ].checked
                                                  }
                                                  onChange={e =>
                                                      this.handleFilter(
                                                          e,
                                                          index
                                                      )
                                                  }
                                                  name={item}
                                              />
                                              <span>
                                                  {item} (
                                                  {
                                                      this.state.onPageFilters[
                                                          item
                                                      ].count
                                                  }
                                                  )
                                              </span>
                                          </label>
                                      </li>
                                  )
                              )
                            : null}
                    </ul>
                </div>

                <div className="w-2/4">
                    <span className="text-sm text-gray-600">
                        Zoekresultaten voor
                        {this.state.searchQuery
                            ? ` "${this.state.searchQuery}"`
                            : null}
                        {this.state.geoSearchQuery
                            ? ` coördinaten "${this.state.geoSearchQuery}"`
                            : null}
                    </span>
                    <ul>
                        {this.state.dataLoaded ? (
                            // this.state.searchResults.length > 0 ? (
                            this.state.searchResults &&
                            this.state.searchResults.length > 0 ? (
                                this.state.searchResults.map((item, index) => {
                                    if (
                                        this.state.onPageFilters[item.Type]
                                            .checked
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

export default RaadpleegZoekResultatenOverzicht
