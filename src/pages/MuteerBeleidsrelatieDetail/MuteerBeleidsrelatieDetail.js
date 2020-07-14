import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons'

import axios from './../../API/axios'

import LoaderMainTitle from '../../components/LoaderMainTitle'
import LoaderSaving from '../../components/LoaderSaving'

import TabRelaties from './TabRelaties'
import TabVerzoeken from './TabVerzoeken'
import TabAfgewezen from './TabAfgewezen'
import TabVerbroken from './TabVerbroken'

function SwitchToTabbladButton({
    currentTabblad,
    tabbladName,
    changeTabblad,
    showLength,
    arrayLength,
}) {
    const tabbladTitle =
        tabbladName.charAt(0).toUpperCase() + tabbladName.slice(1)

    return (
        <li
            className={`py-2 px-5 text-lg m-color inline-block font-bold m-base-border-color ${
                currentTabblad === tabbladName
                    ? 'border-b-2'
                    : 'cursor-pointer hover:border-b-2'
            }`}
            onClick={() => {
                if (currentTabblad !== tabbladName) {
                    changeTabblad(tabbladName)
                }
            }}
        >
            {tabbladTitle}
            {showLength && arrayLength ? (
                <span className="px-2 py-1 ml-2 text-sm text-white bg-green-600 rounded-full text-bold">
                    {arrayLength}
                </span>
            ) : null}
        </li>
    )
}

class MuteerBeleidsrelatieDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTabblad: 'relaties',
            vanLoaded: false,
            naarLoaded: false,
            titelLoaded: false,
            savingInProgress: false,
            Naar_Beleidsbeslissingen: [],
            Van_Beleidsbeslissingen: [],
            motiveringPopUp: null,
            verbreekPopUp: null,
        }
        this.relatieAccepteren = this.relatieAccepteren.bind(this)
        this.relatieAfwijzen = this.relatieAfwijzen.bind(this)
        this.relatieVerbreken = this.relatieVerbreken.bind(this)
        this.toggleMotiveringPopup = this.toggleMotiveringPopup.bind(this)
        this.toggleVerbreekPopup = this.toggleVerbreekPopup.bind(this)
        this.changeTabblad = this.changeTabblad.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
    }

    getBeleidsbeslissingTitel(UUID) {
        axios.get(`/beleidsbeslissingen/version/${UUID}`).then((res) => {
            this.setState({
                beleidsbeslissingTitel: res.data.Titel,
                titelLoaded: true,
            })
        })
    }

    getBeleidsrelatiesVanBeleidsbeslissing(UUID) {
        // Get alle beleidsrelaties die een Van_Beleidsbeslissing relatie hebben met de beleidsbeslissing die bekeken wordt
        axios
            .get(`/beleidsrelaties?Van_Beleidsbeslissing=${UUID}`)
            .then((res) => {
                let beleidsrelaties = res.data

                // Als er geen beleidsrelaties zijn => return
                if (beleidsrelaties.length === 0) {
                    this.setState(
                        {
                            vanLoaded: true,
                        },
                        () => {
                            return
                        }
                    )
                }

                // Als er beleidsrelaties zijn mappen we over de array. De return waarde van de map is een array met axios promises. Voor elke relatie binnen de map functie halen we de gekoppelde beleidsrelatie op. Als de data hiervan binnen is is koppelen we deze aan het relatie object.
                const relatieGETRequests = beleidsrelaties.map((relatie) => {
                    return axios
                        .get(
                            `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                        )
                        .then((res) => (relatie.beleidsbeslissing = res.data))
                })

                // Zodra alle promises zijn voldaan kunnen we de van_beleidsbeslissingen opslaan in de state
                const that = this
                Promise.all(relatieGETRequests).then(function (values) {
                    that.setState({
                        Van_Beleidsbeslissingen: beleidsrelaties,
                        vanLoaded: true,
                    })
                })
            })
    }

    getBeleidsrelatiesNaarBeleidsbeslissing(UUID) {
        // Get alle beleidsrelaties die een Naar_Beleidsbeslissing relatie hebben met de beleidsbeslissing die bekeken wordt
        axios
            .get(`/beleidsrelaties?Naar_Beleidsbeslissing=${UUID}`)
            .then((res) => {
                let beleidsrelaties = res.data

                // Als er geen beleidsrelaties zijn => return
                if (beleidsrelaties.length === 0) {
                    this.setState(
                        {
                            naarLoaded: true,
                        },
                        () => {
                            return
                        }
                    )
                }

                // Als er beleidsrelaties zijn mappen we over de array. De return waarde van de map is een array met axios promises. Voor elke relatie binnen de map functie halen we de gekoppelde beleidsrelatie op. Als de data hiervan binnen is is koppelen we deze aan het relatie object.
                const relatieGETRequests = beleidsrelaties.map((relatie) => {
                    return axios
                        .get(
                            `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}`
                        )
                        .then((res) => (relatie.beleidsbeslissing = res.data))
                })

                // Zodra alle promises zijn voldaan kunnen we de van_beleidsbeslissingen opslaan in de state
                const that = this
                Promise.all(relatieGETRequests).then(function (values) {
                    that.setState({
                        Naar_Beleidsbeslissingen: beleidsrelaties,
                        naarLoaded: true,
                    })
                })
            })
    }

    componentDidMount() {
        const beleidsbeslissingUUID = this.props.match.params.UUID

        // Van de beleidsbeslissing hebben we enkel de titel nodig.
        this.getBeleidsbeslissingTitel(beleidsbeslissingUUID)

        // Beleidsrelaties bestaan met twee relaties, naar en van een beleidsbeslissing.
        // Beidde worden opgehaald met de onderstaande functies.
        this.getBeleidsrelatiesVanBeleidsbeslissing(beleidsbeslissingUUID)
        this.getBeleidsrelatiesNaarBeleidsbeslissing(beleidsbeslissingUUID)
    }

    relatieAccepteren(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Status: 'Akkoord',
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
        }
        this.setState({
            savingInProgress: true,
        })
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast('Beleidsrelatie geaccepteerd')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'Akkoord'
                )

                // Wijzigen in lokale state
                if (
                    this.state.Van_Beleidsbeslissingen.find(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = this.state.Van_Beleidsbeslissingen.findIndex(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = this.state.Van_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    this.setState({
                        Van_Beleidsbeslissingen: newStateObject,
                        savingInProgress: false,
                    })
                } else if (
                    this.state.Naar_Beleidsbeslissingen.find(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = this.state.Naar_Beleidsbeslissingen.findIndex(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = this.state.Naar_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    this.setState({
                        Naar_Beleidsbeslissingen: newStateObject,
                        savingInProgress: false,
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    relatieAfwijzen(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: 'NietAkkoord',
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast('Beleidsrelatie afgewezen')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'NietAkkoord'
                )
            })
            .catch((err) => console.log(err))
    }

    relatieVerbreken(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: 'Verbroken',
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast('Beleidsrelatie verbroken')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'Verbroken'
                )
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    patchRelatieStatus(beleidsrelatieObject, nieuweStatus, toastNotificatie) {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: nieuweStatus,
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast(toastNotificatie)
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    nieuweStatus
                )
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    toggleMotiveringPopup(UUID) {
        this.setState({
            motiveringPopUp: UUID,
        })
    }

    toggleVerbreekPopup(UUID) {
        this.setState({
            verbreekPopUp: UUID,
        })
    }

    changeTabblad(tabbladName) {
        this.setState({
            currentTabblad: tabbladName,
        })
    }

    // Wordt gebruikt om de lokale state te updaten bij bijvoorbeeld het intrekken van een relatie verzoek
    updateStatus(uuid, nieuweStatus) {
        let Van_Beleidsbeslissingen = this.state.Van_Beleidsbeslissingen
        let Naar_Beleidsbeslissingen = this.state.Naar_Beleidsbeslissingen

        const vanIndex = this.state.Van_Beleidsbeslissingen.findIndex(
            (x) => x.UUID === uuid
        )
        if (vanIndex !== -1) {
            Van_Beleidsbeslissingen[vanIndex].Status = nieuweStatus
            Van_Beleidsbeslissingen[vanIndex].Datum_Akkoord = new Date()
        }

        const naarIndex = this.state.Naar_Beleidsbeslissingen.findIndex(
            (x) => x.UUID === uuid
        )
        if (naarIndex !== -1) {
            Naar_Beleidsbeslissingen[naarIndex].Status = nieuweStatus
            Naar_Beleidsbeslissingen[naarIndex].Datum_Akkoord = new Date()
        }

        this.setState({
            Naar_Beleidsbeslissingen: Naar_Beleidsbeslissingen,
            Van_Beleidsbeslissingen: Van_Beleidsbeslissingen,
        })
    }

    render() {
        const ParamUUID = this.props.match.params.UUID
        // const beleidsbeslissing = this.props.beleidsbeslissing
        const alleBeleidsrelaties = this.state.Van_Beleidsbeslissingen.concat(
            this.state.Naar_Beleidsbeslissingen
        )
        const relatieArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                ((beleidsrelatie.Van_Beleidsbeslissing === ParamUUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Open')
        )

        const afgewezenArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )

        const verbrokenArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Verbroken') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Verbroken')
        )

        const verzoekArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                beleidsrelatie.Status === 'Open'
        )

        return (
            <div className="flex-grow inline-block w-3/4 rounded">
                <div className="container w-full mx-auto text-sm text-gray-600">
                    <Link
                        onClick={this.props.backToOverzicht}
                        className="inline-block mb-2 text-gray-600 cursor-pointer text-l"
                        id="button-back-to-previous-page"
                        to={`/muteer/beleidsrelaties`}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
                        <span>Terug naar overzicht</span>
                    </Link>
                </div>

                <div className="p-5 bg-white rounded shadow">
                    <div className="flex justify-between">
                        <div>
                            <span className="block mb-1 text-sm text-gray-500">
                                Beleidsbeslissing
                            </span>
                            <h1 className="inline-block mb-8 text-xl font-bold text-gray-800">
                                {this.state.titelLoaded ? (
                                    this.state.beleidsbeslissingTitel
                                ) : (
                                    <LoaderMainTitle />
                                )}
                                <span className="absolute inline-block px-1 py-1 ml-4 -mt-1 text-xs font-semibold border rounded m-color m-base-border-color">
                                    Vigerend
                                </span>
                            </h1>
                        </div>
                        <div>
                            <Link
                                to={`/muteer/beleidsrelaties/${this.props.match.params.UUID}/nieuwe-relatie`}
                                className="px-2 py-2 text-sm font-semibold text-white bg-green-600 rounded cursor-pointer hover:bg-green-700"
                            >
                                <FontAwesomeIcon
                                    className="mr-2 text-white"
                                    icon={faPlus}
                                />
                                Nieuwe relatie
                            </Link>
                        </div>
                    </div>

                    <div className="w-full mb-5 border-b border-gray-200">
                        <ul>
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="relaties"
                            />
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="verzoeken"
                                showLength={true}
                                arrayLength={verzoekArray.length}
                            />
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="afgewezen"
                            />
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="verbroken"
                            />
                        </ul>
                    </div>

                    {this.state.currentTabblad === 'relaties' ? (
                        <TabRelaties
                            updateStatus={this.updateStatus}
                            relatieVerbreken={this.relatieVerbreken}
                            relatieArray={relatieArray}
                            relatieAfwijzen={this.relatieAfwijzen}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            toggleVerbreekPopup={this.toggleVerbreekPopup}
                            verbreekPopUp={this.state.verbreekPopUp}
                            beleidsbeslissingTitel={
                                this.state.beleidsbeslissingTitel
                            }
                        />
                    ) : null}

                    {this.state.currentTabblad === 'verzoeken' ? (
                        <TabVerzoeken
                            updateStatus={this.updateStatus}
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            verzoekArray={verzoekArray}
                        />
                    ) : null}

                    {this.state.currentTabblad === 'afgewezen' ? (
                        <TabAfgewezen
                            updateStatus={this.updateStatus}
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            afgewezenArray={afgewezenArray}
                        />
                    ) : null}

                    {this.state.currentTabblad === 'verbroken' ? (
                        <TabVerbroken
                            updateStatus={this.updateStatus}
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            verbrokenArray={verbrokenArray}
                        />
                    ) : null}

                    {this.state.savingInProgress ? <LoaderSaving /> : null}
                </div>
            </div>
        )
    }
}

export default withRouter(MuteerBeleidsrelatieDetail)
