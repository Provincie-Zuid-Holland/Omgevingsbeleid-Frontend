import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from './../../../API/axios'

import LoaderSmallCircle from './../../../components/LoaderSmallCircle'

import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import UserContext from './../../../App/UserContext'

const eigenaren = [
    'Eigenaar_1',
    'Eigenaar_2',
    'Portefeuillehouder_1',
    'Portefeuillehouder_2',
    'Opdrachtgever',
]

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

    inititState = () => {
        const propertiesWithValue = eigenaren.filter(
            (item) => this.props.crudObject[item] !== null
        )

        this.setState({
            propertiesWithValue: propertiesWithValue,
        })

        let axiosArray = propertiesWithValue.map((item) =>
            axios
                .get(`/gebruikers/${this.props.crudObject[item]}`)
                .then((res) => {
                    const dataObject = res.data
                    this.setState({
                        [item]: dataObject,
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        )
        Promise.all(axiosArray)
            .then(() =>
                this.setState({
                    dataLoaded: true,
                })
            )
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    maakAfkortingVanNaam(gebruikersNaam) {
        const stringArray = gebruikersNaam.split(' ')
        const voornaam = stringArray[0]
        const achternaam = stringArray[stringArray.length - 1]

        return voornaam[0] + achternaam[0]
    }

    getPersonenRol(item) {
        if (item === 'Eigenaar_1') {
            return 'Eerste eigenaar'
        } else if (item === 'Eigenaar_2') {
            return 'Tweede eigenaar'
        } else if (item === 'Portefeuillehouder_1') {
            return 'Eerste portefeuillehouder'
        } else if (item === 'Portefeuillehouder_2') {
            return 'Tweede portefeuillehouder'
        } else if (item === 'Opdrachtgever') {
            return 'Ambtelijk opdrachtgever'
        }
    }

    componentDidMount() {
        this.inititState()
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.crudObject &&
            this.props.crudObject.UUID !== prevProps.crudObject.UUID
        ) {
            this.setState(
                {
                    dataLoaded: false,
                    Eigenaar_1: null,
                    Eigenaar_2: null,
                    Portefeuillehouder_1: null,
                    Portefeuillehouder_2: null,
                    Opdrachtgever: null,
                    propertiesWithValue: [],
                },
                () => {
                    this.inititState()
                }
            )
        }
    }

    render() {
        const canUserEdit = (context) => {
            const contextAndUUIDExist =
                context &&
                context.user &&
                context.user !== null &&
                context.user.UUID

            const userCreatedObjectOrIsOwner =
                this.props.crudObject.Created_By === context.user.UUID ||
                (context.user && this.state.Eigenaar_1 === context.user.UUID) ||
                (context.user && this.state.Eigenaar_2 === context.user.UUID) ||
                (context.user && this.state.Opdrachtgever === context.user.UUID)

            const userCanEdit =
                contextAndUUIDExist && userCreatedObjectOrIsOwner

            return userCanEdit
        }

        return (
            <UserContext.Consumer>
                {(context) => (
                    <div className="px-3 py-3 mb-5 bg-gray-100 border border-gray-200 rounded-md ">
                        <span className="text-sm text-gray-600">
                            Deze informatie zien alleen gebruikers die zijn
                            ingelogd.
                        </span>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                                <ul className="flex mr-8">
                                    {this.state.propertiesWithValue.map(
                                        (item, index) =>
                                            this.state.dataLoaded ? (
                                                <li
                                                    key={item}
                                                    className={`relative ${
                                                        index === 0
                                                            ? ''
                                                            : '-ml-2'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-center w-8 h-8 mr-1 text-xs text-white bg-yellow-400 border border-white rounded-full circle-gebruiker font-lg">
                                                        {this.state[item]
                                                            ? this.maakAfkortingVanNaam(
                                                                  this.state[
                                                                      item
                                                                  ]
                                                                      .Gebruikersnaam
                                                              )
                                                            : null}

                                                        <div className="absolute top-0 left-0 z-10 hidden inline-block px-4 py-3 mt-10 whitespace-no-wrap rounded popup-gebruikersinfo">
                                                            <div className="block mb-1 text-xs">
                                                                {this.getPersonenRol(
                                                                    item
                                                                )}
                                                            </div>
                                                            <div className="block text-sm font-semibold">
                                                                {this.state[
                                                                    item
                                                                ]
                                                                    ? this
                                                                          .state[
                                                                          item
                                                                      ]
                                                                          .Gebruikersnaam
                                                                    : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ) : (
                                                <LoaderSmallCircle key={item} />
                                            )
                                    )}
                                </ul>
                                {this.props.crudObject['Weblink'] ? (
                                    <a
                                        href={this.props.crudObject['Weblink']}
                                        target="_blank"
                                        className="text-sm font-semibold text-gray-600 hover:underline"
                                        rel="noopener noreferrer"
                                    >
                                        <FontAwesomeIcon
                                            className="mr-2 text-gray-600"
                                            icon={faLink}
                                        />
                                        IDMS-koppeling
                                    </a>
                                ) : null}
                            </div>
                            {canUserEdit(context) ? (
                                <Link
                                    to={`/muteer/beleidskeuzes/${this.props.crudObject.ID}`}
                                    className="px-3 py-2 text-xs font-semibold tracking-wide border rounded cursor-pointer m-color m-base-border-color"
                                >
                                    Openen in beheeromgeving{' '}
                                    {this.state.Created_By}
                                </Link>
                            ) : null}
                        </div>
                    </div>
                )}
            </UserContext.Consumer>
        )
    }
}

export default ViewFieldIngelogdExtraInfo
