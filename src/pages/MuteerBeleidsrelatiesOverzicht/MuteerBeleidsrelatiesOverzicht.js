import {
    faAngleRight,
    faHourglass,
    faCheck,
    faEnvelope,
    faTimes,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'

import LoaderBeleidsrelatieRegel from './../../components/LoaderBeleidsrelatieRegel'
import SidebarMain from './../../components/SidebarMain'

/**
 * Returns the overzicht page of beleidsrelaties
 * @param {array} beleidskeuzes contains an array of the beleidskeuzes that are from
 */
class MuteerBeleidsrelatiesOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,
            beleidskeuzesObject: null,
            currentBeleidskeuze: {},
        }
        this.initializeState = this.initializeState.bind(this)
        this.updateBeleidsrelaties = this.updateBeleidsrelaties.bind(this)
        this.countBevestigdeRelaties = this.countBevestigdeRelaties.bind(this)
        this.countOnbevestigdeRelaties =
            this.countOnbevestigdeRelaties.bind(this)
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
            x => x.UUID === beleidsrelatieUUID
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
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID ||
                    beleidsrelatie.Naar_Beleidskeuze.UUID === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countOnbevestigdeRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Van_Beleidskeuze.UUID === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countVerzoekRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidskeuze.UUID === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel afgewezen relaties er in het beleidsrelatie object zitten met de geleverde UUID
    countAfgewezenRelaties(UUID) {
        const beleidsrelaties = this.props.beleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Naar_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )
        return beleidsrelaties.length
    }

    // For each beleidskeuze we create an object containing meta info
    initializeBeleidskeuzes(beleidskeuzes) {
        return beleidskeuzes.map(item => {
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
    // Map over alle beleidskeuzes en return een array met voor elke beleidskeuze een object met:
    // Titel, Status, het aantal Bevestigde, het aantal Onbevestigde, UUID
    initializeState() {
        this.setState(
            {
                beleidskeuzesObject: this.initializeBeleidskeuzes(
                    this.props.beleidskeuzes
                ),
            },
            () => {
                if (this.props.currentView !== 'detail') {
                    this.setState({
                        currentBeleidskeuze:
                            this.state.beleidskeuzesObject.find(
                                e => e.UUID === this.props.match.params.UUID
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

    // Maak de array waar de relatie objecten van de desbetreffende beleidskeuze in zitten
    // Voor elke relatie halen we ook de beleidskeuze op, zodat we in het detail scherm info zoals de titel kunnen tonen
    generateRelatieArray(UUID) {
        // We filteren op basis van de gekregen beleidskeuze UUID parameter
        // We spreken van een beleidsrelatie als de UUID overeenkomt met Van_Beleidskeuze of Naar_Beleidskeuze
        // EN als de beleidsrelatie een Status heeft van 'Akkoord' of 'Open'
        let beleidsrelaties = this.props.beleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID ||
                    beleidsrelatie.Naar_Beleidskeuze.UUID === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )

        this.setState({
            RelatieArray: beleidsrelaties,
        })

        return beleidsrelaties
    }

    // Maak de array waar de verzoek objecten van de desbetreffende beleidskeuze in zitten
    // Voor elk verzoek halen we ook de beleidskeuze op, zodat we in het detail scherm info zoals de titel kunnen tonen
    generateVerzoekArray(UUID) {
        // We filteren op basis van de gekregen beleidskeuze UUID parameter
        // We spreken van een verzoek als de UUID overeenkomt met Naar_Beleidskeuze
        // EN als de beleidsrelatie een Status heeft van 'Open'
        return this.props.beleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Naar_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === 'Open') ||
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === 'Open')
        )
    }

    render() {
        // Sort object
        const beleidskeuzesObject = this.state.beleidskeuzesObject
            ? this.state.beleidskeuzesObject.sort((a, b) =>
                  a.Titel > b.Titel ? 1 : -1
              )
            : []

        return (
            <>
                <Helmet>
                    <title>Omgevingsbeleid - Beleidsrelaties</title>
                </Helmet>
                <SidebarMain />
                <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                    <h2 className="mb-4 text-gray-800">Beleidsrelaties</h2>
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
                            beleidskeuzesObject !== null ? (
                                beleidskeuzesObject.length !== 0 ? (
                                    beleidskeuzesObject.map(item => {
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
                                                        this.setState({
                                                            currentBeleidskeuze:
                                                                item,
                                                        })
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
                                                            {item.Status}
                                                        </span>
                                                    </div>
                                                    <div className="w-1/12 text-center">
                                                        {item.Bevestigd !== 0
                                                            ? item.Bevestigd
                                                            : '-'}
                                                    </div>
                                                    <div className="w-1/12 text-center">
                                                        {item.Onbevestigd !== 0
                                                            ? item.Onbevestigd
                                                            : '-'}
                                                    </div>
                                                    <div
                                                        className="w-1/12 text-center"
                                                        data-testid="incoming"
                                                    >
                                                        {item.Verzoeken !== 0
                                                            ? item.Verzoeken
                                                            : '-'}
                                                    </div>
                                                    <div className="w-1/12 mr-6 text-center ">
                                                        {item.Afgewezen !== 0
                                                            ? item.Afgewezen
                                                            : '-'}
                                                    </div>
                                                    <FontAwesomeIcon
                                                        className="absolute right-0 h-8 mr-3 text-gray-700"
                                                        icon={faAngleRight}
                                                    />
                                                </Link>
                                            </li>
                                        )
                                    })
                                ) : (
                                    <span className="inline-block mt-2 text-gray-600 font-italic">
                                        Je hebt nog geen beleidskeuzes
                                    </span>
                                )
                            ) : (
                                <>
                                    <LoaderBeleidsrelatieRegel />
                                    <LoaderBeleidsrelatieRegel />
                                    <LoaderBeleidsrelatieRegel />
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(MuteerBeleidsrelatiesOverzicht)
