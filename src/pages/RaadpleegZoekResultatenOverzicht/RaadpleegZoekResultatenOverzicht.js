import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import axios from './../../API/axios'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'

function SearchResultItem(props) {
    function getContent(propertyName) {
        if (props.item.highlight[propertyName] === undefined) {
            return {
                setInnerHTML: false,
                content: props.item[propertyName],
            }
        } else {
            return {
                setInnerHTML: true,
                content: {
                    __html: props.item.highlight[propertyName],
                },
            }
        }
    }

    const content = {
        Titel: getContent('Titel'),
        Omschrijving: getContent('Omschrijving'),
    }

    return (
        <li className="border-b border-gray-300 py-5" key={props.item.UUID}>
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
        console.log('this.props.location.query:')
        const urlParams = this.props.location.search
        const searchParams = new URLSearchParams(urlParams)
        const searchQuery = searchParams.get('query')
        const searchFiltersOnly = searchParams.get('only')

        this.setState({
            searchQuery: searchQuery,
        })

        if (!urlParams || urlParams.length === 0) {
            return
        }
        axios
            .get(`/search` + urlParams)
            .then(res => {
                const searchResults = res.data
                this.setInitialOnPageFilters(searchResults)
                this.setState({
                    searchFiltersOnly: searchFiltersOnly,
                    searchResults: searchResults,
                    dataLoaded: true,
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="container mx-auto flex px-6 pb-8 mt-12">
                <div className="w-1/4">
                    <ButtonBackToPage terugNaar="startpagina" url="/" />
                    <h2 className="mt-6 text-l font-serif block">Filteren</h2>
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
                                                  {item}(
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
                            this.state.searchResults.map((item, index) => {
                                if (
                                    this.state.onPageFilters[item.type].checked
                                ) {
                                    return (
                                        <SearchResultItem
                                            item={item}
                                            key={item.UUID}
                                        />
                                    )
                                } else {
                                    return null
                                }
                            })
                        ) : (
                            <span className="text-gray-700 italic py-5">
                                Geen resultaten
                            </span>
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(RaadpleegZoekResultatenOverzicht)
