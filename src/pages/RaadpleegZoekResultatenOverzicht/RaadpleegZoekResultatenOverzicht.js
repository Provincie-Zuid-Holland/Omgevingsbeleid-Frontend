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

function getExcerpt(object) {
    if (object.trim) {
        let newObject = object
        newObject.content = newObject.content.substring(0, 250) + '...'
        return newObject
    } else {
        return object
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

function SearchResultItem(props) {
    function getContent(propertyName) {
        if (
            (props.item.highlight === undefined ||
                props.item.highlight[propertyName] === undefined) &&
            props.item[propertyName] !== undefined
        ) {
            return {
                setInnerHTML: false,
                content: props.item[propertyName],
                trim:
                    props.item[propertyName] &&
                    props.item[propertyName].length > 250,
            }
        } else if (props.item[propertyName] !== undefined) {
            return {
                setInnerHTML: true,
                content: {
                    __html: props.item.highlight[propertyName],
                },
            }
        } else {
            if (props.item.type === 'Beleidsbeslissingen') {
                return {
                    setInnerHTML: false,
                    content: props.item.Omschrijving_Keuze,
                    trim:
                        props.item.Omschrijving_Keuze &&
                        props.item.Omschrijving_Keuze.length > 250,
                }
            } else {
                return {
                    setInnerHTML: false,
                    content: props.item.Omschrijving,
                    trim:
                        props.item.Omschrijving &&
                        props.item.Omschrijving.length > 250,
                }
            }
        }
    }

    const content = {
        Titel: getContent('Titel'),
        Omschrijving: getExcerpt(getContent('Omschrijving')),
    }

    let type = props.item.Type
    if (type === 'Beleidsregels') {
        type = 'BeleidsRegels'
    }

    const dimensieContants = getDimensieConstant(type)
    const overzichtURL = dimensieContants.SLUG_OVERZICHT
    const titelEnkelvoud = dimensieContants.TITEL_ENKELVOUD

    return (
        <li className="border-b border-gray-300 py-5" key={props.item.UUID}>
            <Link
                to={`/detail/${overzichtURL}/${props.item.UUID}#${props.searchQuery}`}
            >
                {content.Titel.setInnerHTML ? (
                    <h2
                        className="text-l font-serif block text-gray-800"
                        dangerouslySetInnerHTML={content.Titel.content}
                    ></h2>
                ) : (
                    <h2 className="text-l font-serif block text-gray-800">
                        {content.Titel.content}
                    </h2>
                )}
                <span className="block text-gray-600 text-sm italic">
                    {titelEnkelvoud}
                </span>
                {content.Omschrijving.setInnerHTML ? (
                    <p
                        className="mt-2 text-gray-700 text-sm"
                        dangerouslySetInnerHTML={content.Omschrijving.content}
                    ></p>
                ) : content.Omschrijving.content &&
                  content.Omschrijving.content.length > 0 ? (
                    <p className="mt-2 text-gray-700 text-sm">
                        {content.Omschrijving.content}
                    </p>
                ) : (
                    <p className="mt-2 text-gray-700 text-sm italic">
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

    // function generateVerordeningsPositions(searchResults) {
    //     // Array where we push in the nested positions
    //     // We reset this on every iteration over the Hoofdstukken
    //     let nestedPositions = []
    //     let positionFound = false
    //     // We increase the positionFoundIndex for each level we traverse
    //     // We use this to write in the array on the correct index
    //     let positionFoundIndex = 0

    //     function getPositionOfElement(UUIDToFind) {
    //         const hoofdstukkenInStructure = vigerendeVerordeningsStructuur.Structuur.Children

    //         hoofdstukkenInStructure.forEach((hoofdstuk, hoofdstukIndex) => {

    //             // If the chapter doesn't have any children, or we already found the position we return
    //             if (!hoofdstuk.Children || positionFound) return

    //             // We reset the array on each Hoofdstuk
    //             nestedPositions = []
    //             nestedPositions[0] = hoofdstukIndex

    //             const returnedValue = recursiveCheckForUUIDInChildren(hoofdstuk.Children, UUIDToFind)
    //             console.log(returnedValue)
    //             if (returnedValue) {
    //                 console.log("array")
    //                 console.log(returnedValue)
    //                 return returnedValue
    //             }
    //         })
    //     }

    //     function recursiveCheckForUUIDInChildren(children, UUIDToFind) {

    //         // We have traversed one level down, so we increase the positionFoundIndex
    //         positionFoundIndex++

    //         // If the UUID of the verordeningenObject is in the current Children array
    //         if (children.find((item, itemIndex) => {
    //             return item.UUID === UUIDToFind
    //         })) {
    //             console.log("FOUND!")
    //             console.log(nestedPositions)
    //             positionFound = true
    //             return nestedPositions
    //         } else {

    //             let returnedRecursiveValue = null

    //             // Else we loop over each of the children elements and check if they have Children elements (I know, I'm getting dizzy too...)
    //             // If so we call this function on the child.Children
    //             children.forEach((child, childIndex) => {
    //                 // Push the position
    //                 nestedPositions[positionFoundIndex] = childIndex

    //                 if (child.Children) {
    //                     returnedRecursiveValue = recursiveCheckForUUIDInChildren(child.Children, UUIDToFind)
    //                 }
    //             })

    //             if (returnedRecursiveValue) {
    //                 return returnedRecursiveValue
    //             }

    //             // We have gone through all the children and the children of the children
    //             // So we go back up a level by decreasing the index:
    //             positionFoundIndex--
    //         }
    //     }

    //     return searchResults.map(item => {
    //         if (item.Type === 'Verordeningen') {
    //             item.positionInStructure = getPositionOfElement(item.UUID.toLowerCase())
    //         } else {
    //             return item
    //         }
    //     })
    // }

    generateVerordeningsPositions(searchResults) {
        // Array where we push in the nested positions
        // We reset this on every iteration over the Hoofdstukken
        let nestedPositionsArray = []

        function getPositionOfElement(UUID) {
            console.log(UUID)
            const hoofdstukkenInStructure = this.state
                .vigerendeVerordeningsStructuur.Structuur.Children

            hoofdstukkenInStructure.map((hoofdstuk, index) => {
                nestedPositionsArray = []
                nestedPositionsArray.push(index)

                // if (hoofdstuk.Children)
            })
        }

        function recursiveCheckForUUIDInChildren(children) {
            children.find()
        }

        return searchResults.map(item => {
            if (item.Type === 'Verordeningen') {
                item.positionInStructure = getPositionOfElement(item.UUID)
            } else {
                return item
            }
        })
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
                // const searchResultsWithVerordeningsPositions = this.generateVerordeningsPositions(
                //     searchResults
                // )

                this.setState(
                    {
                        searchFiltersOnly: searchFiltersOnly,
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
        return (
            <div className="container mx-auto flex px-6 pb-8 mt-12">
                <div className="w-1/4">
                    <ButtonBackToPage
                        terugNaar="startpagina"
                        url={
                            this.state.searchQuery
                                ? `/?query=${this.state.searchQuery}`
                                : `/`
                        }
                    />
                    <h2 className="mt-6 text-l font-serif block text-gray-700">
                        Filteren
                    </h2>
                    <ul className="mt-4">
                        {this.state.onPageFilters.filterArray &&
                        this.state.onPageFilters.filterArray.length > 0
                            ? this.state.onPageFilters.filterArray.map(
                                  (item, index) => (
                                      <li
                                          key={item}
                                          className="mt-1 text-gray-700 text-sm"
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
                    <span className="text-gray-600 text-sm">
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
                                <span className="italic text-gray-600 text-sm mt-8 block">
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

const vigerendeVerordeningsStructuur = {
    Titel: 'Swens nieuwe VStr',
    Structuur: {
        Children: [
            {
                UUID: '676e59ec-72b8-4240-98a3-bf5e653743af',
                Children: [
                    {
                        UUID: 'afbb9184-6a3b-4618-af3a-c876cd16fa5d',
                        Children: [],
                    },
                    {
                        UUID: 'd0d1b8b3-bc54-4c41-8e25-419d57dae385',
                        Children: [
                            {
                                UUID: '5e2bf9a3-3fb5-4d59-830e-e6c487364f65',
                                Children: [],
                            },
                            {
                                UUID: 'e392b200-d9ad-44d8-8cdd-48058c3a104b',
                                Children: [],
                            },
                        ],
                    },
                    {
                        UUID: '5a0e4322-fb20-45ee-9c2d-99e785ebb5b5',
                        Children: [],
                    },
                ],
            },
            {
                UUID: '9dd7547c-7c2b-4398-b911-6bc4f13f6a2e',
                Children: [
                    {
                        UUID: '8e8478c4-c5ce-44bb-a1bf-93fcaef2e05b',
                        Children: [
                            {
                                UUID: '0fdad997-1c5f-4c30-9aa1-fecd78ae5c8a',
                                Children: [
                                    {
                                        UUID:
                                            '83747815-69c9-4444-b697-8eae563e43ba',
                                        Children: [],
                                    },
                                    {
                                        UUID:
                                            'dd601eba-bd39-47f2-aefa-8ab2e92993f2',
                                        Children: [],
                                    },
                                    {
                                        UUID:
                                            '98c34274-b8a9-4f72-95b0-f4a752ef6669',
                                        Children: [],
                                    },
                                ],
                            },
                            {
                                UUID: 'cf416a58-3f1b-46c3-bdf4-4eddaf2d4d62',
                                Children: [],
                            },
                            {
                                UUID: 'd9aaf2b8-59fa-4aac-9d54-2435d2c611fc',
                                Children: [],
                            },
                            {
                                UUID: '7dc546a1-d32e-4d38-9bdd-bbb968a48618',
                                Children: [
                                    {
                                        UUID:
                                            '5722bedd-5c94-4b4f-b303-b3c9532093cb',
                                        Children: [],
                                    },
                                    {
                                        UUID:
                                            '64eefa32-51b3-428e-b4c4-50111b23dc0b',
                                        Children: [],
                                    },
                                ],
                            },
                            {
                                UUID: 'd3ddf2f0-99bc-41ec-8eb2-6d85262c88e1',
                                Children: [],
                            },
                            {
                                UUID: '15a9e2ff-3bcb-4b93-b490-0c185dacb72f',
                                Children: [],
                            },
                        ],
                    },
                    {
                        UUID: '0baeee04-7759-4c16-9e1c-309cdba84382',
                        Children: [],
                    },
                ],
            },
        ],
    },
    Begin_Geldigheid: '1992-01-01T00:00:00',
    Eind_Geldigheid: '2099-01-01T00:00:00',
    Status: 'Concept',
}

const test = {
    Structuur: {
        Children: [
            { UUID: '6e7a1e01-bac9-4388-8cbe-0f57487ba343', Children: [] },
            {
                UUID: '9d8f694e-babf-41ed-9d7d-4a7cfed61254',
                Children: [
                    {
                        UUID: 'c6f8e553-02a6-4dc3-ac2d-cb8c64a4fb53',
                        Children: [
                            {
                                UUID: '6b4eefa5-c165-46da-b5f9-4970720d1b3a',
                                Children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
}

export default RaadpleegZoekResultatenOverzicht
