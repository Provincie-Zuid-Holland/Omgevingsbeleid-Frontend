import React, { Component } from 'react'
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

import axios from './../../API/axios'

import SidebarMain from './../../components/SidebarMain'

import MuteerBeleidsrelatieDetail from './../MuteerBeleidsrelatieDetail'
import LoaderBeleidsrelatieRegel from './../../components/LoaderBeleidsrelatieRegel'

/**
 * Returns the overzicht page of beleidsrelaties
 */
class MuteerBeleidsrelatiesOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,
            beleidsbeslissingenObject: null,
            currentBeleidsbeslissing: {},
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
            this.props.parentDataLoaded &&
            this.props.parentDataLoaded !== prevProps.parentDataLoaded
        ) {
            this.initializeState()
        }
    }

    componentDidMount() {
        if (this.props.parentDataLoaded) {
            this.initializeState()
        }
    }

    // Update de status van een beleidsrelatie en initialized opnieuw de State om de UI te updaten
    updateBeleidsrelaties(beleidsrelatieUUID, status) {
        let beleidsrelaties = this.props.beleidsrelaties
        let index = beleidsrelaties.findIndex(
            (x) => x.UUID === beleidsrelatieUUID
        )
        if (index) {
            beleidsrelaties[index].Status = status
            this.setState(
                {
                    beleidsrelaties: beleidsrelaties,
                },
                () => this.initializeState()
            )
        } else {
            return
        }
    }

    // Kijkt hoeveel bevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countBevestigdeRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countOnbevestigdeRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            (beleidsrelatie) =>
                beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countVerzoekRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            (beleidsrelatie) =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel afgewezen relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countAfgewezenRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )
        return beleidsrelaties.length
    }

    // Kijk voor elke beleidsbeslissing hoeveel en wat voor relaties deze heeft
    initializeBeleidsbeslissingen(beleidsbeslissingen) {
        return beleidsbeslissingen.map((item) => {
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
                    this.props.beleidsbeslissingen
                ),
            },
            () => {
                if (this.props.currentView !== 'detail') {
                    this.setState({
                        currentBeleidsbeslissing: this.state.beleidsbeslissingenObject.find(
                            (e) => e.UUID === this.props.match.params.UUID
                        ),
                        dataLoaded: true,
                    })
                } else {
                    this.setState({
                        dataLoaded: true,
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
        let beleidsrelaties = this.props.beleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )

        // GET voor elke beleidsrelatie het gekoppelde beleidsbeslissing object
        // Als het relatie.Van_Beleidsbeslissing !== UUID van de beleidsbeslissing GET relatie.Van_Beleidsbeslissing
        // Als het relatie.Van_Beleidsbeslissing === UUID van de beleidsbeslissing GET relatie.Naar_Beleidsbeslissing

        const axiosGETArray = beleidsrelaties.map((relatie) => {
            return axios
                .get(
                    `/beleidsbeslissingen/version/${
                        relatie.Van_Beleidsbeslissing !== UUID
                            ? relatie.Van_Beleidsbeslissing
                            : relatie.Naar_Beleidsbeslissing
                    }`
                )
                .then(
                    (res) => (relatie.beleidsrelatieGekoppeldObject = res.data)
                )
        })

        const that = this

        Promise.all(axiosGETArray).then(function (values) {
            that.setState({
                RelatieArray: beleidsrelaties,
            })
        })

        return beleidsrelaties
    }

    // Maak de array waar de verzoek objecten van de desbetreffende beleidsbeslissing in zitten
    // Voor elk verzoek halen we ook de beleidsbeslissing op, zodat we in het detail scherm info zoals de titel kunnen tonen
    generateVerzoekArray(UUID) {
        // We filteren op basis van de gekregen beleidsbeslissing UUID parameter
        // We spreken van een verzoek als de UUID overeenkomt met Naar_Beleidsbeslissing
        // EN als de beleidsrelatie een Status heeft van 'Open'
        let beleidsrelaties = this.props.beleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open') ||
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open')
        )

        // GET voor elke beleidsrelatie het gekoppelde beleidsbeslissing object
        // Als het relatie.Van_Beleidsbeslissing !== UUID van de beleidsbeslissing GET relatie.Van_Beleidsbeslissing
        // Als het relatie.Van_Beleidsbeslissing === UUID van de beleidsbeslissing GET relatie.Naar_Beleidsbeslissing
        beleidsrelaties.forEach((relatie) => {
            axios
                .get(
                    `/beleidsbeslissingen/version/${
                        relatie.Van_Beleidsbeslissing !== UUID
                            ? relatie.Van_Beleidsbeslissing
                            : relatie.Naar_Beleidsbeslissing
                    }
                    }`
                )
                .then((res) => {
                    relatie.beleidsrelatieGekoppeldObject = res.data
                    return res.data
                })
        })

        return beleidsrelaties
    }

    render() {
        // Sort object
        const beleidsbeslissingenObject = this.state.beleidsbeslissingenObject
            ? this.state.beleidsbeslissingenObject.sort((a, b) =>
                  a.Titel > b.Titel ? 1 : -1
              )
            : []

        return (
            <React.Fragment>
                <Helmet>
                    <title>Omgevingsbeleid - Beleidsrelaties</title>
                </Helmet>

                {this.props.currentView === 'overzicht' ? (
                    <React.Fragment>
                        <SidebarMain />
                        <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                            <h2 className="mb-4 text-gray-800">
                                Beleidsrelaties
                            </h2>
                            <div className="p-5 bg-white rounded shadow">
                                <ul id="beleidskeuzes-overview">
                                    <li className="flex py-2 text-sm font-bold text-gray-800 border-b border-gray-200">
                                        <div className="w-6/12 pl-10">
                                            Beleidskeuzes
                                        </div>
                                        <div className="w-2/12">Status</div>
                                        <div className="w-1/12 text-center">
                                            <FontAwesomeIcon
                                                title="Geaccepteerde beleidsrelatie"
                                                className="text-gray-800 "
                                                icon={faCheck}
                                            />
                                        </div>
                                        <div className="w-1/12 text-center">
                                            <FontAwesomeIcon
                                                title="Een onbevestigde relatie, is een relatie die door de andere partij nog geaccepteerd moet worden"
                                                className="text-gray-800 "
                                                icon={faHourglass}
                                            />
                                        </div>
                                        <div className="w-1/12 text-center">
                                            <FontAwesomeIcon
                                                title="Inkomend verzoek"
                                                className="text-gray-800 "
                                                icon={faEnvelope}
                                            />
                                        </div>
                                        <div className="w-1/12 mr-6 text-center ">
                                            <FontAwesomeIcon
                                                title="Afgewezen relaties"
                                                className="text-gray-800 "
                                                icon={faTimes}
                                            />
                                        </div>
                                    </li>
                                    {this.state.dataLoaded &&
                                    beleidsbeslissingenObject !== null ? (
                                        beleidsbeslissingenObject.length !==
                                        0 ? (
                                            beleidsbeslissingenObject.map(
                                                (item) => {
                                                    return (
                                                        <li
                                                            key={item.UUID}
                                                            className="beleids-item"
                                                        >
                                                            <Link
                                                                className="relative flex items-center py-1 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100"
                                                                to={`/muteer/beleidsrelaties/${item.UUID}`}
                                                                onClick={() => {
                                                                    this.props.setCurrentView(
                                                                        'detail'
                                                                    )
                                                                    this.setState(
                                                                        {
                                                                            currentBeleidsbeslissing: item,
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <span className="absolute inline-block w-3 h-3 ml-3 rounded-full bg-pzh-blue"></span>
                                                                <div
                                                                    className="w-6/12 pl-10"
                                                                    data-testid="title"
                                                                >
                                                                    {item.Titel}
                                                                </div>
                                                                <div className="w-2/12">
                                                                    <span
                                                                        className={`inline-block px-1 py-1 text-xs leading-8 ${
                                                                            item.Status ===
                                                                            'Vigerend'
                                                                                ? 'text-pzh-blue'
                                                                                : 'text-pzh-yellow-dark'
                                                                        } 
                                                                    `}
                                                                    >
                                                                        {
                                                                            item.Status
                                                                        }
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
                                                                <div
                                                                    className="w-1/12 text-center"
                                                                    data-testid="incoming"
                                                                >
                                                                    {item.Verzoeken !==
                                                                    0
                                                                        ? item.Verzoeken
                                                                        : '-'}
                                                                </div>
                                                                <div className="w-1/12 mr-6 text-center ">
                                                                    {item.Afgewezen !==
                                                                    0
                                                                        ? item.Afgewezen
                                                                        : '-'}
                                                                </div>
                                                                <FontAwesomeIcon
                                                                    className="absolute right-0 h-8 mr-3 text-gray-700"
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
                                            <span className="inline-block mt-2 text-gray-600 font-italic">
                                                U heeft nog geen beleidskeuzes
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
                        updateBeleidsrelaties={this.updateBeleidsrelaties}
                        backToOverzicht={() =>
                            this.props.setCurrentView('overzicht')
                        }
                    />
                )}
            </React.Fragment>
        )
    }
}

export default withRouter(MuteerBeleidsrelatiesOverzicht)
