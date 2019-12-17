import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Import API
import axios from './../../API/axios'

// Import Data Model
import dataModel from './../../App/dataModel'

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

    console.log(props.item.type)
    const overzichtURL = dataModel[props.item.type].variables.Overzicht_Slug

    return (
        <li className="border-b border-gray-300 py-5" key={props.item.UUID}>
            <Link
                to={`/detail/${overzichtURL}/${props.item.ID}#${props.searchQuery}`}
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
                    {props.item.type}
                </span>
                {content.Omschrijving.setInnerHTML ? (
                    <p
                        className="mt-2 text-gray-700 text-sm"
                        dangerouslySetInnerHTML={content.Omschrijving.content}
                    ></p>
                ) : (
                    <p className="mt-2 text-gray-700 text-sm">
                        {content.Omschrijving.content}
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
        let filterArray = []
        let mainFilterObject = {}

        searchResults.forEach((item, index) => {
            console.log(item.type)
            // REFACTOR MIJ, IK SMEEK JE
            if (item.type === 'Belangen') {
                item.type = 'Belang'
            }
            if (item.type === 'Opgaven') {
                item.type = 'Opgave'
            }
            if (item.type === 'Ambities') {
                item.type = 'Ambitie'
            }
            if (item.type === 'Beleidsregels') {
                item.type = 'BeleidsRegel'
            }
            if (item.type === 'Doelen') {
                item.type = 'Doel'
            }
            if (item.type === 'Beleidsrelaties') {
                item.type = 'BeleidsRelatie'
            }
            if (item.type === "Thema's") {
                item.type = 'Thema'
            }
            console.log(item.type)
            const filterObject = {
                name: item.type,
                checked: true,
                count: 1,
            }
            if (!filterArray.includes(item.type)) {
                filterArray.push(item.type)
                mainFilterObject[item.type] = filterObject
            } else {
                mainFilterObject[item.type].count++
            }
        })

        mainFilterObject.filterArray = filterArray

        this.setState(
            {
                onPageFilters: mainFilterObject,
            },
            () => console.log(this.state)
        )
    }

    componentDidMount() {
        const urlParams = this.props.location.search
        const searchParams = new URLSearchParams(urlParams)
        const searchQuery = searchParams.get('query')
        const searchFiltersOnly = searchParams.get('only')

        this.setState(
            {
                searchQuery: searchQuery,
            },
            () => console.log(this.state.searchQuery)
        )

        if (!urlParams || urlParams.length === 0) {
            return
        }
        axios
            .get(`/search` + urlParams)
            .then(res => {
                const searchResults = res.data
                searchResults.forEach(item => console.log(item.type))
                console.log('searchResults:')
                console.log(searchResults)
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
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="container mx-auto flex px-6 pb-8 mt-12">
                <div className="w-1/4">
                    <ButtonBackToPage
                        terugNaar="startpagina"
                        url={`/?query=${this.state.searchQuery}`}
                    />
                    <h2 className="mt-6 text-l font-serif block text-gray-700">
                        Filteren
                    </h2>
                    <ul className="mt-4">
                        {this.state.onPageFilters.filterArray &&
                        this.state.onPageFilters.filterArray.length > 0
                            ? this.state.onPageFilters.filterArray.map(
                                  (item, index) => (
                                      <li className="mt-1 text-gray-700 text-sm">
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
                        Zoekresultaten voor "{this.state.searchQuery}"
                    </span>
                    <ul>
                        {this.state.dataLoaded ? (
                            // this.state.searchResults.length > 0 ? (
                            this.state.searchResults &&
                            this.state.searchResults.length > 0 ? (
                                this.state.searchResults.map((item, index) => {
                                    if (
                                        this.state.onPageFilters[item.type]
                                            .checked
                                    ) {
                                        return (
                                            <SearchResultItem
                                                searchQuery={
                                                    this.state.searchQuery
                                                }
                                                item={item}
                                                key={item.UUID}
                                            />
                                        )
                                    } else {
                                        return null
                                    }
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
