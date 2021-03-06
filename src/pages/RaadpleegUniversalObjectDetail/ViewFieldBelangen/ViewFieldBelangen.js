import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { Link, withRouter } from 'react-router-dom'
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
                .then((res) => {
                    belangen[index].data = res.data
                    belangen[index].Titel = res.data.Titel
                    belangen[index].Type = res.data.Type
                    belangen[index].ID = res.data.ID
                    this.setState({
                        belangen: belangen,
                    })
                })
                .catch((err) => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        )

        Promise.all(promiseArray).then(() => {
            const nationaleBelangen = this.state.belangen.filter(
                (item) => item.Type === 'Nationaal Belang'
            )
            const wettelijkeTaken = this.state.belangen.filter(
                (item) => item.Type === 'Wettelijke Taak & Bevoegdheid'
            )
            this.setState({
                dataLoaded: true,
                nationaleBelangen: nationaleBelangen,
                wettelijkeTaken: wettelijkeTaken,
            })
        })
    }

    render() {
        const currentPath = this.props.history.location.pathname

        return this.state.dataLoaded ? (
            <div>
                {this.state.nationaleBelangen &&
                this.state.nationaleBelangen.length > 0 ? (
                    <div className="mb-6">
                        <h2 className="block mb-2 font-serif text-lg tracking-wide text-gray-700">
                            Nationaal belang
                        </h2>
                        <ul>
                            {this.state.nationaleBelangen.map((item) => (
                                <li
                                    className="mb-2 text-sm text-gray-700"
                                    key={item.UUID}
                                >
                                    <Link
                                        className="relative cursor-pointer"
                                        to={`/detail/belangen/${item.UUID}?fromPage=${currentPath}`}
                                    >
                                        <FontAwesomeIcon
                                            className="absolute mt-1 text-base"
                                            icon={faAngleRight}
                                        />
                                        <span className="inline-block pl-4">
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
                        <h2 className="block mb-2 font-serif text-lg tracking-wide text-gray-700">
                            Wettelijke taak en bevoegdheid
                        </h2>
                        <ul>
                            {this.state.wettelijkeTaken.map((item) => (
                                <li
                                    className="mb-2 text-sm text-gray-700"
                                    key={item.UUID}
                                >
                                    <Link
                                        className="relative cursor-pointer"
                                        to={`/detail/belangen/${item.UUID}?fromPage=${currentPath}`}
                                    >
                                        <FontAwesomeIcon
                                            className="absolute mt-1 text-base"
                                            icon={faAngleRight}
                                        />
                                        <span className="inline-block pl-4">
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

export default withRouter(ViewFieldBelangen)
