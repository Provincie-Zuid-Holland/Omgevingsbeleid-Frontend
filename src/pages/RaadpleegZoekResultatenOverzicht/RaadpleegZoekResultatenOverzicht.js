import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

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

        if (searchQuery) {
            this.getSearchNormaleQuery(searchQuery, searchFiltersOnly)
        } else if (searchGeoQuery) {
            this.getSearchGeoQuery(searchGeoQuery, latLng)
        }
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
                            ? `"${this.state.searchQuery}"`
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

export default RaadpleegZoekResultatenOverzicht
