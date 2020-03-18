import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import axios from './../../../API/axios'

import LoaderSmallCircle from './../../../components/LoaderSmallCircle'

import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ViewFieldIngelogdExtraInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Eigenaar_1: null,
            Eigenaar_2: null,
            Portefeuillehouder_1: null,
            Portefeuillehouder_2: null,
            Opdrachtgever: null,
            propertiesWithValue: [],
        }

        this.maakAfkortingVanNaam = this.maakAfkortingVanNaam.bind(this)
        this.getPersonenRol = this.getPersonenRol.bind(this)
    }

    componentDidMount() {
        const propArray = [
            'Eigenaar_1',
            'Eigenaar_2',
            'Portefeuillehouder_1',
            'Portefeuillehouder_2',
            'Opdrachtgever',
        ]
        const propertiesWithValue = propArray.filter(
            item => this.props.crudObject[item] !== null
        )

        this.setState({
            propertiesWithValue: propertiesWithValue,
        })

        let axiosArray = propertiesWithValue.map(item =>
            axios
                .get(`/gebruikers/${this.props.crudObject[item]}`)
                .then(res => {
                    const dataObject = res.data
                    this.setState({
                        [item]: dataObject,
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        )
        Promise.all(axiosArray)
            .then(() =>
                this.setState(
                    {
                        dataLoaded: true,
                    },
                    () => console.log(this.state)
                )
            )
            .catch(err => console.log(err))
    }

    maakAfkortingVanNaam(gebruikersNaam) {
        const stringArray = gebruikersNaam.split(' ')
        const voornaam = stringArray[0]
        const achternaam = stringArray[stringArray.length - 1]

        return voornaam[0] + achternaam[0]
    }

    getPersonenRol(item) {
        if (item === 'Eigenaar_1') {
            return 'Eigenaar 1'
        } else if (item === 'Eigenaar_2') {
            return 'Eigenaar 2'
        } else if (item === 'Portefeuillehouder_1') {
            return 'Portefeuillehouder 1'
        } else if (item === 'Portefeuillehouder_2') {
            return 'Portefeuillehouder 2'
        } else if (item === 'Opdrachtgever') {
            return 'Ambtelijk opdrachtgever'
        }
    }

    render() {
        return (
            <div className="bg-gray-100 mb-4 px-3 py-3 border-b border-t border-gray-200 ">
                <span className="text-sm text-gray-600">
                    Deze informatie zien alleen gebruikers die zijn ingelogd.
                </span>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                        <ul className="flex mr-8">
                            {this.state.propertiesWithValue.map(item =>
                                this.state.dataLoaded ? (
                                    <li className="relative -ml-2">
                                        <div className="w-8 h-8 border border-white bg-orange-500 flex justify-center items-center rounded-full circle-gebruiker font-lg mr-1 text-white text-xs">
                                            {this.maakAfkortingVanNaam(
                                                this.state[item].Gebruikersnaam
                                            )}

                                            <div className="hidden absolute left-0 top-0 px-4 py-3 popup-gebruikersinfo mt-10 inline-block rounded whitespace-no-wrap z-10">
                                                <div className="block mb-1 text-xs">
                                                    {this.getPersonenRol(item)}
                                                </div>
                                                <div className="block text-sm font-semibold">
                                                    {
                                                        this.state[item]
                                                            .Gebruikersnaam
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ) : (
                                    <LoaderSmallCircle />
                                )
                            )}
                        </ul>
                        {this.props.crudObject['Weblink'] ? (
                            <a
                                href={`//${this.props.crudObject['Weblink']}`}
                                target="_blank"
                                className="text-gray-600 text-sm font-semibold hover:underline"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon
                                    className="text-gray-600 mr-2"
                                    icon={faLink}
                                />
                                IDMS-koppeling
                            </a>
                        ) : null}
                    </div>
                    <Link
                        to={`/muteer/beleidsbeslissingen/${this.props.crudObject.ID}`}
                        className="m-color m-base-border-color border rounded px-3 py-2 cursor-pointer font-semibold text-xs tracking-wide"
                    >
                        Openen in beheeromgeving
                    </Link>
                </div>
            </div>
        )
    }
}

ViewFieldIngelogdExtraInfo.propTypes = {}

ViewFieldIngelogdExtraInfo.defaultProps = {}

export default ViewFieldIngelogdExtraInfo
