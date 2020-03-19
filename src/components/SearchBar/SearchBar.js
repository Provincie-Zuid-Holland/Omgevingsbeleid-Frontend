import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SearchBarPopupItem(props) {
    function selectQueryDataItem(nextOrPrevious, arrayLength) {
        const currentIndex = document.activeElement.getAttribute('data-index')

        let newIndex
        switch (nextOrPrevious) {
            case 'next':
                if (parseInt(currentIndex) === arrayLength) {
                    return
                }
                newIndex = parseInt(currentIndex) + 1
                break
            case 'previous':
                if (parseInt(currentIndex) === 0) {
                    document.getElementById('search-query').select()
                    return
                }
                newIndex = parseInt(currentIndex) - 1
                break
            default:
                newIndex = 1
        }
        document.querySelectorAll(`[data-index='${newIndex}']`)[0].focus()
    }

    return (
        <li
            key={props.index}
            // tabIndex="0"
            className={`relative`}
        >
            <Link
                className={`px-5 w-full relative inline-block hover:underline hover:bg-gray-100 focus:underline focus:bg-gray-100 focus:shadow-outline cursor-pointer ${
                    props.filter ? 'py-1' : 'py-2'
                }`}
                to={`/zoekresultaten?query=${props.value}${
                    props.filterQuery ? `&only=${props.filterQuery}` : ''
                }`}
                onKeyDown={e => {
                    if (e.keyCode === 40) {
                        // Arrow down
                        selectQueryDataItem('next', props.arrayLength)
                    } else if (e.keyCode === 38) {
                        // Arrow up
                        selectQueryDataItem('previous', props.arrayLength)
                    }
                }}
                data-index={props.dataIndex}
            >
                {props.filter ? (
                    <span className="pl-4 text-xs">
                        In
                        <span className="text-yellow-600">
                            {' '}
                            {props.filterQuery}
                        </span>
                    </span>
                ) : (
                    <React.Fragment>
                        <span className="inline-block search-preview">
                            {props.value}
                        </span>
                        <span className="absolute right-0 text-gray-500 text-xs top-0 mt-2 mr-3">
                            Zoeken in categorie
                        </span>
                    </React.Fragment>
                )}
            </Link>
        </li>
    )
}

function SearchBarPopup(props) {
    // {
    //     name: 'beleidsrelaties',
    // },
    const filters = [
        {
            name: 'ambities',
        },
        {
            name: 'beleidsregels',
        },
        {
            name: 'doelen',
        },
        {
            name: 'belangen',
        },
        {
            name: 'maatregelen',
        },
        {
            name: 'themas',
        },
        {
            name: 'opgaven',
        },
        {
            name: 'verordeningen',
        },
        {
            name: 'beleidsbeslissingen',
        },
    ]

    return (
        <ul
            className="bg-white rounded-b absolute top-0 mt-10 border border-gray-300 shadow w-full text-gray-700 text-sm"
            id="main-search-result-container"
        >
            <SearchBarPopupItem
                dataIndex={0}
                key={0}
                value={props.searchInput}
            />
            {filters.map((item, index) => (
                <SearchBarPopupItem
                    value={props.searchInput}
                    filterQuery={item.name}
                    key={item.name}
                    dataIndex={index + 1}
                    index={item.name}
                    filter={true}
                    arrayLength={filters.length}
                />
            ))}
        </ul>
    )
}

class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInput: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        const urlParams = this.props.location.search
        const searchParams = new URLSearchParams(urlParams)
        const searchQuery = searchParams.get('query')

        if (searchQuery && searchQuery !== 'null') {
            this.setState(
                {
                    searchInput: searchQuery,
                },
                () => console.log(this.state.searchInput)
            )
        }
    }

    handleChange(e) {
        const name = e.target.name
        const value = e.target.value
        this.setState({
            [name]: value,
        })
    }
    render() {
        return (
            <div className="w-full block relative">
                <input
                    className="appearance-none w-full block text-gray-700 border border-gray-300 rounded py-3 pl-4 pr-12 leading-tight focus:outline-none hover:border-gray-400 focus:border-gray-400 shadow text-sm"
                    name="searchInput"
                    onChange={this.handleChange}
                    autoComplete="off"
                    id="search-query"
                    type="text"
                    value={this.state.searchInput}
                    placeholder="Zoeken op artikelnummer, etc."
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            // Enter
                            this.props.history.push(
                                `/zoekresultaten?query=${this.state.searchInput}`
                            )
                        } else if (
                            e.keyCode === 40 &&
                            this.state.searchInput.length > 0
                        ) {
                            // Arrow Down
                            document
                                .querySelectorAll(`[data-index='0']`)[0]
                                .focus()
                        }
                    }}
                />
                <FontAwesomeIcon
                    className="absolute right-0 top-0 mr-4 mt-4 text-gray-600 text-sm"
                    icon={faSearch}
                />
                {this.state.searchInput.length > 0 ? (
                    <SearchBarPopup searchInput={this.state.searchInput} />
                ) : null}
            </div>
        )
    }
}

export default withRouter(SearchBar)
