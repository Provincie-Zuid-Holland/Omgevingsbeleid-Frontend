import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from './../../../API/axios'

class ViewFieldBelangen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            belangen: this.props.fieldValue,
            dataLoaded: false,
        }
    }

    componentDidMount() {
        let belangen = this.state.belangen

        const promiseArray = belangen.map((item, index) =>
            axios
                .get(`/belangen/version/${item.UUID}`)
                .then(res => {
                    belangen[index].data = res.data
                    belangen[index].Titel = res.data.Titel
                    belangen[index].Type = res.data.Type
                    belangen[index].ID = res.data.ID
                    this.setState({
                        belangen: belangen,
                    })
                })
                .catch(err => console.log(err))
        )

        Promise.all(promiseArray).then(() => {
            const nationaleBelangen = this.state.belangen.filter(
                item => item.Type === 'Nationaal Belang'
            )
            const wettelijkeTaken = this.state.belangen.filter(
                item => item.Type === 'Wettelijke Taak & Bevoegdheid'
            )
            this.setState({
                dataLoaded: true,
                nationaleBelangen: nationaleBelangen,
                wettelijkeTaken: wettelijkeTaken,
            })
        })
    }

    render() {
        return this.state.dataLoaded ? (
            <div>
                {this.state.nationaleBelangen &&
                this.state.nationaleBelangen.length > 0 ? (
                    <div className="mb-6">
                        <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                            Nationaal belang
                        </h2>
                        <ul>
                            {this.state.nationaleBelangen.map(item => (
                                <li
                                    className="text-gray-700 text-sm mb-2"
                                    key={item.UUID}
                                >
                                    <Link
                                        className="cursor-pointer relative"
                                        to={`/detail/belangen/${item.ID}`}
                                    >
                                        <FontAwesomeIcon
                                            className="text-base absolute mt-1"
                                            icon={faAngleRight}
                                        />
                                        <span className="pl-4 inline-block">
                                            {item.Titel}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
                {this.state.wettelijkeTaken &&
                this.state.wettelijkeTaken.length > 0 ? (
                    <div className="mb-6">
                        <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                            Wettelijke taak en bevoegdheid
                        </h2>
                        <ul>
                            {this.state.wettelijkeTaken.map(item => (
                                <li
                                    className="text-gray-700 text-sm mb-2"
                                    key={item.UUID}
                                >
                                    <Link
                                        className="cursor-pointer relative"
                                        to={`/detail/belangen/${item.ID}`}
                                    >
                                        <FontAwesomeIcon
                                            className="text-base absolute mt-1"
                                            icon={faAngleRight}
                                        />
                                        <span className="pl-4 inline-block">
                                            {item.Titel}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        ) : null
    }
}

ViewFieldBelangen.propTypes = {}

ViewFieldBelangen.defaultProps = {}

export default ViewFieldBelangen
