import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleRight,
    faHourglass,
    faCheck,
    faEnvelope,
    faTimes,
} from '@fortawesome/pro-solid-svg-icons'
import { faSquare } from '@fortawesome/pro-light-svg-icons'

import axios from './../../API/axios'

import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import MuteerBeleidsrelatieDetail from './MuteerBeleidsrelatieDetail'
import LoaderBeleidsrelatieRegel from './../../components/LoaderBeleidsrelatieRegel'

class MuteerBeleidsrelatiesOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            beleidsbeslissingen: null,
            beleidsrelaties: null,
            dataLoaded: false,
            beleidsbeslissingenObject: null,
            currentView: 'overzicht',
            currentUUID: null,
        }
        this.initializeState = this.initializeState.bind(this)
        this.updateBeleidsrelaties = this.updateBeleidsrelaties.bind(this)
        this.countBevestigdeRelaties = this.countBevestigdeRelaties.bind(this)
        this.countOnbevestigdeRelaties = this.countOnbevestigdeRelaties.bind(
            this
        )
        this.countVerzoekRelaties = this.countVerzoekRelaties.bind(this)
        this.countAfgewezenRelaties = this.countAfgewezenRelaties.bind(this)
        this.generateRelatieArray = this.generateRelatieArray.bind(this)
        this.generateVerzoekArray = this.generateVerzoekArray.bind(this)
    }

    // ***
    // Lifecycle Functions

    // Als de gebruiker de url veranderd, verander naar de 'overzicht' over de 'detail' view
    componentDidUpdate(prevProps) {
        if (
            this.props.match.params.UUID === undefined &&
            this.state.currentView !== 'overzicht'
        ) {
            this.setState({
                currentView: 'overzicht',
            })
        }
    }

    // Als het compent gemount wordt, haal alle beleidsbeslissingen en beleidsrelaties => setState op en initialize state
    componentDidMount() {
        const UserUUID = JSON.parse(localStorage.getItem('identifier')).UUID
        console.log(UserUUID)
        Promise.all([
            axios.get(
                `/beleidsbeslissingen?Created_By=${UserUUID}&Eigenaar_1=${UserUUID}&Eigenaar_2=${UserUUID}&Opdrachtgever=${UserUUID}`
            ),
            axios.get(`/beleidsrelaties`),
        ])
            .then(([beleidsbeslissingen, beleidsrelaties]) =>
                this.setState(
                    {
                        beleidsbeslissingen: beleidsbeslissingen.data,
                        beleidsrelaties: beleidsrelaties.data,
                        dataLoaded: true,
                    },
                    () => {
                        this.initializeState()
                    }
                )
            )
            .catch(errors => {
                // react on errors.
                console.error(errors)
            })
    }

    // ***
    // Methods

    // Update de status van een beleidsrelatie en initialized opnieuw de State om de UI te updaten
    updateBeleidsrelaties(beleidsrelatieUUID, status) {
        let beleidsrelaties = this.state.beleidsrelaties
        let index = beleidsrelaties.findIndex(
            x => x.UUID === beleidsrelatieUUID
        )
        beleidsrelaties[index].Status = status
        this.setState(
            {
                beleidsrelaties: beleidsrelaties,
            },
            () => this.initializeState()
        )
    }

    // Kijkt hoeveel bevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countBevestigdeRelaties(UUID) {
        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countOnbevestigdeRelaties(UUID) {
        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie => {
                if (
                    beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open'
                ) {
                    return beleidsrelatie
                }
            }
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countVerzoekRelaties(UUID) {
        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel afgewezen relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countAfgewezenRelaties(UUID) {
        const beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'NietAkkoord'
        )
        return beleidsrelaties.length
    }

    // Kijk voor elke beleidsbeslissing hoeveel en wat voor relaties deze heeft
    initializeBeleidsbeslissingen(beleidsbeslissingen) {
        return beleidsbeslissingen.map(item => {
            return {
                Titel: item.Titel,
                Status: item.Status,
                UUID: item.UUID,
                Bevestigd: this.countBevestigdeRelaties(item.UUID),
                Onbevestigd: this.countOnbevestigdeRelaties(item.UUID),
                Afgewezen: this.countAfgewezenRelaties(item.UUID),
                Verzoeken: this.countVerzoekRelaties(item.UUID),
                RelatieArray: this.generateRelatieArray(item.UUID),
                VerzoekArray: this.generateVerzoekArray(item.UUID),
            }
        })
    }

    // Na het ophalen van de data in de API, Initialize de state
    // Map over alle beleidsbeslissingen en return een array met voor elke beleidsbeslissing een object met:
    // Titel, Status, het aantal Bevestigde, het aantal Onbevestigde, UUID
    initializeState() {
        this.setState(
            {
                beleidsbeslissingenObject: this.initializeBeleidsbeslissingen(
                    this.state.beleidsbeslissingen
                ),
            },
            () => {
                if (
                    this.props.match.params.UUID !== undefined &&
                    this.state.currentView !== 'detail'
                ) {
                    this.setState({
                        currentView: 'detail',
                        currentBeleidsbeslissing: this.state.beleidsbeslissingenObject.find(
                            element =>
                                element.UUID === this.props.match.params.UUID
                        ),
                    })
                }
            }
        )
    }

    // Maak de array waar de relatie objecten van de desbetreffende beleidsbeslissing in zitten
    // Voor elke relatie halen we ook de beleidsbeslissing op, zodat we in het detail scherm info zoals de titel kunnen tonen
    generateRelatieArray(UUID) {
        // We filteren op basis van de gekregen beleidsbeslissing UUID parameter
        // We spreken van een beleidsrelatie als de UUID overeenkomt met Van_Beleidsbeslissing of Naar_Beleidsbeslissing
        // EN als de beleidsrelatie een Status heeft van 'Akkoord' of 'Open'
        let beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                ((beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )

        // GET voor elke beleidsrelatie het gekoppelde beleidsbeslissing object
        // Als het relatie.Van_Beleidsbeslissing !== UUID van de beleidsbeslissing GET relatie.Van_Beleidsbeslissing
        // Als het relatie.Van_Beleidsbeslissing === UUID van de beleidsbeslissing GET relatie.Naar_Beleidsbeslissing

        const axiosGETArray = beleidsrelaties.map(relatie => {
            return axios
                .get(
                    `/beleidsbeslissingen/version/${
                        relatie.Van_Beleidsbeslissing !== UUID
                            ? relatie.Van_Beleidsbeslissing
                            : relatie.Naar_Beleidsbeslissing
                    }`
                )
                .then(res => (relatie.beleidsrelatieGekoppeldObject = res.data))
        })

        const that = this

        Promise.all(axiosGETArray).then(function(values) {
            that.setState({
                RelatieArray: beleidsrelaties,
            })
        })

        // beleidsrelaties.forEach(relatie => {
        //     axios
        //         .get(
        //             `/beleidsbeslissingen/version/${
        //                 relatie.Van_Beleidsbeslissing !== UUID
        //                     ? relatie.Van_Beleidsbeslissing
        //                     : relatie.Naar_Beleidsbeslissing
        //             }
        //             }`
        //         )
        //         .then(res => {
        //             relatie.beleidsrelatieGekoppeldObject = res.data
        //             return res.data
        //         })
        // })

        return beleidsrelaties
    }

    // Maak de array waar de verzoek objecten van de desbetreffende beleidsbeslissing in zitten
    // Voor elk verzoek halen we ook de beleidsbeslissing op, zodat we in het detail scherm info zoals de titel kunnen tonen
    generateVerzoekArray(UUID) {
        // We filteren op basis van de gekregen beleidsbeslissing UUID parameter
        // We spreken van een verzoek als de UUID overeenkomt met Naar_Beleidsbeslissing
        // EN als de beleidsrelatie een Status heeft van 'Open'
        let beleidsrelaties = this.state.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )

        // GET voor elke beleidsrelatie het gekoppelde beleidsbeslissing object
        // Als het relatie.Van_Beleidsbeslissing !== UUID van de beleidsbeslissing GET relatie.Van_Beleidsbeslissing
        // Als het relatie.Van_Beleidsbeslissing === UUID van de beleidsbeslissing GET relatie.Naar_Beleidsbeslissing
        beleidsrelaties.forEach(relatie => {
            axios
                .get(
                    `/beleidsbeslissingen/version/${
                        relatie.Van_Beleidsbeslissing !== UUID
                            ? relatie.Van_Beleidsbeslissing
                            : relatie.Naar_Beleidsbeslissing
                    }
                    }`
                )
                .then(res => {
                    relatie.beleidsrelatieGekoppeldObject = res.data
                    return res.data
                })
        })

        return beleidsrelaties
    }

    render() {
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - Beleidsrelaties</title>
                </Helmet>

                {this.state.currentView === 'overzicht' ? (
                    <React.Fragment>
                        <SidebarMain />
                        <div className="w-3/4 rounded inline-block flex-grow pl-8">
                            <h2 className="heading-serif text-gray-800 mb-4">
                                Beleidsrelaties
                            </h2>
                            <div className="bg-white shadow rounded p-5">
                                <ul>
                                    <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 py-2">
                                        <div className="w-6/12 pl-10">
                                            Beleidsbeslissingen
                                        </div>
                                        <div className="w-2/12 text-center">
                                            Status
                                        </div>
                                        <div className="w-1/12 text-center">
                                            <FontAwesomeIcon
                                                title="Geaccepteerde beleidsrelatie"
                                                className="text-gray-800 text-lg"
                                                icon={faCheck}
                                            />
                                        </div>
                                        <div className="w-1/12 text-center">
                                            <FontAwesomeIcon
                                                title="Wacht op antwoord"
                                                className="text-gray-800 text-lg"
                                                icon={faHourglass}
                                            />
                                        </div>
                                        <div className="w-1/12 text-center">
                                            <FontAwesomeIcon
                                                title="Inkomend verzoek"
                                                className="text-gray-800 text-lg"
                                                icon={faEnvelope}
                                            />
                                        </div>
                                        <div className="w-1/12 text-center mr-6 ">
                                            <FontAwesomeIcon
                                                title="Afgewezen relaties"
                                                className="text-gray-800 text-lg"
                                                icon={faTimes}
                                            />
                                        </div>
                                    </li>
                                    {this.state.dataLoaded &&
                                    this.state.beleidsbeslissingenObject !==
                                        null ? (
                                        this.state.beleidsbeslissingenObject
                                            .length !== 0 ? (
                                            this.state.beleidsbeslissingenObject.map(
                                                item => {
                                                    return (
                                                        <li key={item.UUID}>
                                                            <Link
                                                                className="flex border-b border-gray-200 text-sm text-gray-800 py-2 relative items-center hover:bg-gray-100"
                                                                to={`/muteer/beleidsrelaties/${item.UUID}`}
                                                                onClick={() =>
                                                                    this.setState(
                                                                        {
                                                                            currentBeleidsbeslissing: item,
                                                                            currentView:
                                                                                'Detail',
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <span className="h-3 w-3 mbg-color rounded-full absolute ml-3 inline-block"></span>
                                                                <div className="w-6/12 pl-10">
                                                                    {item.Titel}
                                                                </div>
                                                                <div className="w-2/12 text-center">
                                                                    <span className="border m-color m-base-border-color px-1 py-1 text-xs rounded">
                                                                        Vigerend
                                                                    </span>
                                                                </div>
                                                                <div className="w-1/12 text-center">
                                                                    {item.Bevestigd !==
                                                                    0
                                                                        ? item.Bevestigd
                                                                        : '-'}
                                                                </div>
                                                                <div className="w-1/12 text-center">
                                                                    {item.Onbevestigd !==
                                                                    0
                                                                        ? item.Onbevestigd
                                                                        : '-'}
                                                                </div>
                                                                <div className="w-1/12 text-center">
                                                                    {item.Verzoeken !==
                                                                    0
                                                                        ? item.Verzoeken
                                                                        : '-'}
                                                                </div>
                                                                <div className="w-1/12 text-center mr-6 ">
                                                                    {item.Afgewezen !==
                                                                    0
                                                                        ? item.Afgewezen
                                                                        : '-'}
                                                                </div>
                                                                <FontAwesomeIcon
                                                                    className="absolute text-gray-700 right-0 h-8 mr-3"
                                                                    icon={
                                                                        faAngleRight
                                                                    }
                                                                />
                                                            </Link>
                                                        </li>
                                                    )
                                                }
                                            )
                                        ) : (
                                            <span className="font-italic inline-block mt-2 text-gray-600">
                                                U heeft nog geen
                                                beleidsbeslissingen
                                            </span>
                                        )
                                    ) : (
                                        <React.Fragment>
                                            <LoaderBeleidsrelatieRegel />
                                            <LoaderBeleidsrelatieRegel />
                                            <LoaderBeleidsrelatieRegel />
                                        </React.Fragment>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <MuteerBeleidsrelatieDetail
                        beleidsbeslissing={this.state.currentBeleidsbeslissing}
                        dataLoaded={this.state.dataLoaded}
                        updateBeleidsrelaties={this.updateBeleidsrelaties}
                        backToOverzicht={() => {
                            this.setState({
                                currentView: 'overzicht',
                                currentUUID: null,
                            })
                        }}
                    />
                )}
            </ContainerMain>
        )
    }
}

export default withRouter(MuteerBeleidsrelatiesOverzicht)
