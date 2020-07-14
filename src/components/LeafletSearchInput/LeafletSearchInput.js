import React, { Component } from 'react'
import axios from 'axios'
import { debounce } from './../../functions'
import { toast } from 'react-toastify'

class LeafletSearchInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchQuery: '',
            dataLoading: false,
            focusedEl: null,
            queryData: [],
        }
        this.handleChange = this.handleChange.bind(this)
        this.selectQueryDataItem = this.selectQueryDataItem.bind(this)
        this.locatieServerSuggestQuery = debounce(
            this.locatieServerSuggestQuery.bind(this),
            300
        )
        this.suggestList = React.createRef()
    }

    handleChange(e) {
        const value = e.target.value
        this.setState(
            {
                searchQuery: value,
            },
            () => {
                this.locatieServerSuggestQuery(value)
            }
        )
    }

    locatieServerSuggestCancel() {
        import('./../../API/axiosLocatieserver').then((api) => {
            api.cancelRequest()
        })
    }

    locatieServerLookupQuery(id, naam) {
        import('./../../API/axiosLocatieserver').then((api) => {
            api.getLookupData(id)
                .then((data) => {
                    this.setState({
                        queryData: [],
                        searchQuery: naam,
                    })
                    const latLng = data.centroide_ll
                        .split('(')[1]
                        .split(')')[0]
                        .split(' ')
                    const lat = parseFloat(latLng[0]).toFixed(20)
                    const lng = parseFloat(latLng[1]).toFixed(20)
                    this.props.mapPanTo(lng, lat, data.type)
                })
                .catch((err) => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        })
    }

    locatieServerSuggestQuery(value) {
        if (value === '') {
            this.setState({
                queryData: [],
            })
            return
        }

        import('./../../API/axiosLocatieserver').then((api) => {
            this.setState({
                dataLoading: true,
            })
            const that = this
            api.getSuggestData(value)
                .then((data) => {
                    that.setState({
                        queryData: data.response.docs,
                        dataLoading: false,
                    })
                })
                .catch((err) => {
                    that.setState({
                        dataLoading: false,
                    })
                    if (axios.isCancel(err)) {
                        console.log('Request canceled -', err.message)
                    } else {
                        console.log(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    }
                })
        })
    }

    selectQueryDataItem(nextOrPrevious) {
        const currentIndex = document.activeElement.getAttribute('data-index')

        let newIndex
        switch (nextOrPrevious) {
            case 'next':
                if (parseInt(currentIndex) === this.state.queryData.length) {
                    return
                }
                newIndex = parseInt(currentIndex) + 1
                break
            case 'previous':
                if (parseInt(currentIndex) === 1) {
                    this.props.reference.current.select()
                    return
                }
                newIndex = parseInt(currentIndex) - 1
                break
            default:
                newIndex = 1
        }
        document.querySelectorAll(`[data-index='${newIndex}']`)[0].focus()
    }

    render() {
        return (
            <React.Fragment>
                <input
                    className="w-64 h-10 px-5 py-3 ml-3 text-sm leading-tight text-gray-700 rounded appearance-none focus:outline-none"
                    type="text"
                    ref={this.props.reference}
                    placeholder="Zoeken op de kaart"
                    onChange={this.handleChange}
                    value={this.state.searchQuery}
                    onKeyDown={(e) => {
                        if (
                            e.keyCode === 40 &&
                            this.state.queryData.length > 0
                        ) {
                            // Arrow down
                            document
                                .querySelectorAll(`[data-index='1']`)[0]
                                .focus()
                        }
                    }}
                />
                {this.state.queryData.length > 0 ? (
                    <ul
                        id="searchQueryResults"
                        className="absolute top-0 w-56 mt-10 bg-white border-t border-gray-300 rounded-b shadow ml-15"
                        ref={this.suggestList}
                    >
                        {this.state.queryData.map((item, index) => {
                            return (
                                <li
                                    tabIndex="0"
                                    className={`px-5 hover:underline hover:bg-gray-100 focus:underline focus:bg-gray-100 focus:shadow-outline`}
                                    key={index}
                                    data-index={index + 1}
                                    onClick={() =>
                                        this.locatieServerLookupQuery(
                                            item.id,
                                            item.weergavenaam
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                            // Enter keyCode
                                            this.locatieServerLookupQuery(
                                                item.id,
                                                item.weergavenaam
                                            )
                                        } else if (e.keyCode === 40) {
                                            // Arrow down
                                            this.selectQueryDataItem('next')
                                        } else if (e.keyCode === 38) {
                                            // Arrow up
                                            this.selectQueryDataItem('previous')
                                        }
                                    }}
                                >
                                    <span
                                        className={`w-full block text-sm text-gray-700 ${
                                            index ===
                                            this.state.queryData.length - 1
                                                ? 'pt-2 pb-4'
                                                : 'border-b border-gray-300 py-2'
                                        }`}
                                    >
                                        {item.weergavenaam}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                ) : null}
            </React.Fragment>
        )
    }
}

export default LeafletSearchInput
