import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import axios from './../../API/axios'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'

function SearchResultItem(props) {
    console.log(props.item.type)

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
        <li className="border-b border-gray-300 py-6" key={props.item.UUID}>
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
            {content.Omschrijving.setInnerHTML ? (
                <p
                    className="mt-3 text-gray-700 text-sm"
                    dangerouslySetInnerHTML={content.Omschrijving.content}
                >
                    {/* <mark className="bg-yellow-200 text-gray-800">consectetur</mark>{' '}
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. */}
                </p>
            ) : (
                <p className="mt-3 text-gray-700 text-sm">
                    {content.Omschrijving.content}
                    {/* <mark className="bg-yellow-200 text-gray-800">consectetur</mark>{' '}
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. */}
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
        }
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
                console.log(res.data)
                this.setState({
                    searchFiltersOnly: searchFiltersOnly,
                    searchResults: res.data,
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
                        <li className="mt-1 text-gray-700 text-sm">
                            <label className="cursor-pointer select-none">
                                <input
                                    className="mr-2 leading-tight"
                                    type="checkbox"
                                />
                                <span>Visie (9)</span>
                            </label>
                            <ul>
                                <li className="pl-6 mt-1 text-gray-700 text-sm">
                                    <label className="cursor-pointer select-none">
                                        <input
                                            className="mr-2 leading-tight"
                                            type="checkbox"
                                        />
                                        <span>Ambities (1)</span>
                                    </label>
                                </li>
                                <li className="pl-6 mt-1 text-gray-700 text-sm">
                                    <label className="cursor-pointer select-none">
                                        <input
                                            className="mr-2 leading-tight"
                                            type="checkbox"
                                        />
                                        <span>Beleidsopgaven (2)</span>
                                    </label>
                                </li>
                                <li className="pl-6 mt-1 text-gray-700 text-sm">
                                    <label className="cursor-pointer select-none">
                                        <input
                                            className="mr-2 leading-tight"
                                            type="checkbox"
                                        />
                                        <span>Beleidsbeslissingen (6)</span>
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li className="mt-1 text-gray-700 text-sm">
                            <label className="cursor-pointer select-none">
                                <input
                                    className="mr-2 leading-tight"
                                    type="checkbox"
                                />
                                <span>Verordening (4)</span>
                            </label>
                        </li>
                        <li className="mt-1 text-gray-700 text-sm">
                            <label className="cursor-pointer select-none">
                                <input
                                    className="mr-2 leading-tight"
                                    type="checkbox"
                                />
                                <span>Programma (2)</span>
                            </label>
                        </li>
                    </ul>
                </div>

                <div className="w-2/4">
                    <span className="text-gray-600 text-sm">
                        Zoekresultaten voor "{this.state.searchQuery}"
                    </span>
                    <ul>
                        {this.state.dataLoaded
                            ? this.state.searchResults.map((item, index) => (
                                  <SearchResultItem
                                      item={item}
                                      key={item.UUID}
                                  />
                              ))
                            : null}
                    </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(RaadpleegZoekResultatenOverzicht)
