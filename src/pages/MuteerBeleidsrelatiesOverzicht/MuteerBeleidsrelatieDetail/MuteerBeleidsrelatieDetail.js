import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

import axios from './../../../API/axios'

import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'
import LoaderBeleidsrelatieRegel from './../../../components/LoaderBeleidsrelatieRegel'
import LoaderMainTitle from './../../../components/LoaderMainTitle'
import LoaderSaving from './../../../components/LoaderSaving'

class MuteerBeleidsrelatieDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentView: 'relaties',
            vanLoaded: false,
            naarLoaded: false,
            titelLoaded: false,
            savingState: false,
            Naar_Beleidsbeslissingen: [],
            Van_Beleidsbeslissingen: [],
            motiveringPopUp: null,
            verbreekPopUp: null,
        }
        this.relatieAccepteren = this.relatieAccepteren.bind(this)
        this.relatieAfwijzen = this.relatieAfwijzen.bind(this)
        this.toggleMotiveringPopup = this.toggleMotiveringPopup.bind(this)
        this.toggleVerbreekPopup = this.toggleVerbreekPopup.bind(this)
    }

    componentDidMount() {
        axios
            .get(`/beleidsbeslissingen/version/${this.props.match.params.UUID}`)
            .then(res => {
                this.setState({
                    beleidsbeslissingTitel: res.data.Titel,
                    titelLoaded: true,
                })
            })
        axios
            .get(
                `/beleidsrelaties?Van_Beleidsbeslissing=${this.props.match.params.UUID}`
            )
            .then(res => {
                let beleidsrelaties = res.data

                if (res.data.length > 0) {
                    const axiosGETArray = res.data.map(relatie => {
                        return axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                            )
                            .then(res => (relatie.beleidsbeslissing = res.data))
                    })

                    const that = this

                    Promise.all(axiosGETArray).then(function(values) {
                        that.setState({
                            Van_Beleidsbeslissingen: beleidsrelaties,
                            vanLoaded: true,
                        })
                    })
                } else {
                    this.setState({
                        vanLoaded: true,
                    })
                }
            })

        axios
            .get(
                `/beleidsrelaties?Naar_Beleidsbeslissing=${this.props.match.params.UUID}`
            )
            .then(res => {
                let beleidsrelaties = res.data

                if (res.data.length > 0) {
                    const axiosGETArray = res.data.map(relatie => {
                        return axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}`
                            )
                            .then(res => (relatie.beleidsbeslissing = res.data))
                    })

                    const that = this

                    Promise.all(axiosGETArray).then(function(values) {
                        that.setState({
                            Naar_Beleidsbeslissingen: beleidsrelaties,
                            naarLoaded: true,
                        })
                    })
                } else {
                    this.setState({
                        naarLoaded: true,
                    })
                }
            })
    }

    relatieAccepteren(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Status: 'Akkoord',
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
        }
        this.setState({
            savingState: true,
        })
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(res => {
                toast('Beleidsrelatie geaccepteerd')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'Akkoord'
                )

                // Wijzigen in lokale state
                if (
                    this.state.Van_Beleidsbeslissingen.find(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = this.state.Van_Beleidsbeslissingen.findIndex(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = this.state.Van_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    this.setState({
                        Van_Beleidsbeslissingen: newStateObject,
                        savingState: false,
                    })
                } else if (
                    this.state.Naar_Beleidsbeslissingen.find(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = this.state.Naar_Beleidsbeslissingen.findIndex(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = this.state.Naar_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    this.setState({
                        Naar_Beleidsbeslissingen: newStateObject,
                        savingState: false,
                    })
                }
            })
            .catch(err => console.log(err))
    }

    relatieAfwijzen(beleidsrelatieObject) {
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
            .then(res => {
                toast('Beleidsrelatie afgewezen')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'NietAkkoord'
                )
            })
            .catch(err => console.log(err))
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

    render() {
        const ParamUUID = this.props.match.params.UUID
        // const beleidsbeslissing = this.props.beleidsbeslissing
        const alleBeleidsrelaties = this.state.Van_Beleidsbeslissingen.concat(
            this.state.Naar_Beleidsbeslissingen
        )
        const relatieArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                ((beleidsrelatie.Van_Beleidsbeslissing === ParamUUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Open')
        )

        const afgewezenArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )

        const verzoekArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Open') ||
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Open')
        )

        return (
            <div className="w-3/4 rounded inline-block flex-grow">
                <div className="text-gray-600 text-sm w-full container mx-auto">
                    <Link
                        onClick={this.props.backToOverzicht}
                        className="text-gray-600 text-l mb-2 inline-block cursor-pointer"
                        id="button-back-to-previous-page"
                        to={`/muteer/beleidsrelaties`}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
                        <span>Terug naar overzicht</span>
                    </Link>
                </div>

                <div className="bg-white shadow rounded p-5">
                    <div className="flex justify-between">
                        <div>
                            <span className="text-gray-500 text-sm mb-1 block">
                                Beleidsbeslissing
                            </span>
                            <h1 className="text-xl font-bold text-gray-800 inline-block mb-8">
                                {this.state.titelLoaded ? (
                                    this.state.beleidsbeslissingTitel
                                ) : (
                                    <LoaderMainTitle />
                                )}
                                <span className="border font-semibold m-color m-base-border-color px-1 py-1 text-xs rounded -mt-1 inline-block absolute ml-4">
                                    Vigerend
                                </span>
                            </h1>
                        </div>
                        <div>
                            <Link
                                to={`/muteer/beleidsrelaties/${this.props.match.params.UUID}/nieuwe-relatie`}
                                className="bg-green-600 hover:bg-green-700 px-2 py-2 text-white rounded text-sm font-semibold cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    className="mr-2 text-white"
                                    icon={faPlus}
                                />
                                Nieuwe relatie
                            </Link>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 w-full mb-5">
                        <ul>
                            <li
                                className={`py-2 px-5 text-lg m-color inline-block font-bold m-base-border-color ${
                                    this.state.currentView === 'relaties'
                                        ? 'border-b-2'
                                        : 'cursor-pointer hover:border-b-2'
                                }`}
                                onClick={() => {
                                    if (this.state.currentView !== 'relaties') {
                                        this.setState({
                                            currentView: 'relaties',
                                        })
                                    }
                                }}
                            >
                                Relaties
                            </li>
                            <li
                                className={`py-2 px-5 text-lg m-color inline-block font-bold m-base-border-color relative ${
                                    this.state.currentView === 'verzoeken'
                                        ? 'border-b-2'
                                        : 'cursor-pointer hover:border-b-2'
                                }`}
                                onClick={() => {
                                    if (
                                        this.state.currentView !== 'verzoeken'
                                    ) {
                                        this.setState({
                                            currentView: 'verzoeken',
                                        })
                                    }
                                }}
                            >
                                Verzoeken
                                {verzoekArray && verzoekArray.length > 0 ? (
                                    <span className="bg-red-600 rounded-full ml-2 inline-block text-white w-6 h-6 text-center text-base">
                                        {verzoekArray.length}
                                    </span>
                                ) : null}
                            </li>
                        </ul>
                    </div>

                    {this.state.currentView === 'relaties' ? (
                        <TabRelaties
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
                    {this.state.currentView === 'verzoeken' ? (
                        <TabVerzoeken
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            verzoekArray={verzoekArray}
                        />
                    ) : null}
                    {this.state.savingState ? <LoaderSaving /> : null}
                </div>
            </div>
        )
    }
}

function TabVerzoeken(props) {
    return (
        <ul>
            <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 p-2">
                <div className="w-5/12">Beleidsbeslissingen</div>
                <div className="w-2/12">Aangevraagd op</div>
                <div className="w-1/12">Status</div>
                <div className="w-2/12">Motivering</div>
                <div className="w-2/12">Actie</div>
            </li>
            {props.verzoekArray.length > 0 ? (
                props.verzoekArray.map(verzoek => {
                    return (
                        <li
                            key={verzoek.UUID}
                            className="flex border-b border-gray-200 text-sm text-gray-800 px-2 relative items-center hover:bg-gray-100"
                        >
                            <div className="w-5/12 py-2">
                                {verzoek.beleidsbeslissing &&
                                verzoek.beleidsbeslissing.Titel
                                    ? verzoek.beleidsbeslissing.Titel
                                    : null}
                            </div>
                            <div className="w-2/12">
                                {console.log(verzoek)}
                                {verzoek.Aanvraag_Datum !== null
                                    ? format(
                                          new Date(verzoek.Aanvraag_Datum),
                                          'd MMMM YYYY, HH:mm uur'
                                      )
                                    : null}
                            </div>
                            <div className="w-1/12">Open</div>
                            <div className="w-2/12">
                                <span
                                    onClick={() => {
                                        props.toggleMotiveringPopup(
                                            verzoek.UUID
                                        )
                                    }}
                                    className="underline cursor-pointer"
                                >
                                    Bekijk motivering
                                </span>
                                {props.motiveringPopUp === verzoek.UUID ? (
                                    <PopUpAnimatedContainer small={true}>
                                        <div
                                            onClick={() =>
                                                props.toggleMotiveringPopup(
                                                    null
                                                )
                                            }
                                            className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
                                            id={`sluit-popup-beleidsrelatie-motivering`}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                        <h3 className="form-field-label">
                                            Motivering
                                        </h3>
                                        <p className="form-field-description">
                                            {verzoek.Omschrijving}
                                        </p>
                                    </PopUpAnimatedContainer>
                                ) : null}
                            </div>
                            <div className="w-2/12">
                                <span
                                    onClick={() =>
                                        props.relatieAccepteren(verzoek)
                                    }
                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded cursor-pointer shadow inline-block mr-2"
                                >
                                    Accepteren
                                </span>
                                <span
                                    onClick={() =>
                                        props.relatieAfwijzen(verzoek)
                                    }
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer shadow inline-block"
                                >
                                    Afwijzen
                                </span>
                            </div>
                        </li>
                    )
                })
            ) : (
                <span className="font-italic text-sm px-2 py-2 inline-block text-gray-600">
                    Er zijn nog geen verzoeken
                </span>
            )}
        </ul>
    )
}

function TabRelaties(props) {
    return (
        <ul>
            <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 p-2">
                <div className="w-5/12">Beleidsbeslissingen</div>
                <div className="w-2/12">Datum</div>
                <div className="w-1/12">Status</div>
                <div className="w-2/12 pl-8">Motivering</div>
                <div className="w-2/12"></div>
            </li>
            {props.naarLoaded && props.vanLoaded ? (
                props.relatieArray.length > 0 ? (
                    props.relatieArray.map(relatie => {
                        return (
                            <li
                                key={relatie.UUID}
                                className="flex border-b border-gray-200 text-sm text-gray-800 py-2 px-2 relative items-center hover:bg-gray-100"
                            >
                                <div className="w-5/12 pr-4">
                                    {relatie.beleidsbeslissing &&
                                    relatie.beleidsbeslissing.Titel ? (
                                        relatie.beleidsbeslissing.Titel
                                    ) : (
                                        <LoaderMainTitle />
                                    )}
                                </div>
                                <div className="w-2/12">
                                    {relatie.Datum_Akkoord !== null
                                        ? format(
                                              new Date(relatie.Datum_Akkoord),
                                              'd MMMM YYYY, HH:mm uur'
                                          )
                                        : null}
                                </div>
                                <div className="w-1/12">
                                    {relatie.Status === 'Akkoord'
                                        ? 'Bevestigd'
                                        : relatie.Status === 'Open'
                                        ? 'In afwachting'
                                        : relatie.Status === 'NietAkkoord'
                                        ? 'Afgewezen'
                                        : null}
                                </div>
                                <div className="w-2/12 pl-8">
                                    <span
                                        onClick={() => {
                                            props.toggleMotiveringPopup(
                                                relatie.UUID
                                            )
                                        }}
                                        className="underline cursor-pointer"
                                    >
                                        Bekijk motivering
                                    </span>
                                    {props.motiveringPopUp === relatie.UUID ? (
                                        <PopUpAnimatedContainer small={true}>
                                            <div
                                                onClick={() =>
                                                    props.toggleMotiveringPopup(
                                                        null
                                                    )
                                                }
                                                className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
                                                id={`sluit-popup-beleidsrelatie-motivering`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            </div>
                                            <h3 className="form-field-label">
                                                Motivering
                                            </h3>
                                            <p className="form-field-description">
                                                {relatie.Omschrijving}
                                            </p>
                                        </PopUpAnimatedContainer>
                                    ) : null}
                                </div>
                                <div className="w-2/12 flex justify-end">
                                    <span
                                        onClick={() => {
                                            props.toggleVerbreekPopup(
                                                relatie.UUID
                                            )
                                            // props.relatieAfwijzen(relatie)
                                        }}
                                        className="underline text-red-600 cursor-pointer"
                                    >
                                        {relatie.Status === 'Akkoord'
                                            ? 'Relatie verwijderen'
                                            : 'Verzoek intrekken'}
                                    </span>
                                    {props.verbreekPopUp === relatie.UUID ? (
                                        <PopUpAnimatedContainer small={true}>
                                            <div
                                                onClick={() =>
                                                    props.toggleVerbreekPopup(
                                                        null
                                                    )
                                                }
                                                className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
                                                id={`sluit-popup-beleidsrelatie-motivering`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            </div>
                                            <h3 className="font-bold mb-4 text-lg">
                                                Beleidsrelatie
                                                {relatie.Status === 'Akkoord'
                                                    ? ' verbreken'
                                                    : ' verzoek intrekken'}
                                            </h3>
                                            <div className="border-l-4 purple-light-bg-color purple-border-color mb-4 p-4 relative">
                                                <p className="text-sm mt-2 text-gray-700">
                                                    {relatie.Status ===
                                                    'Akkoord'
                                                        ? `Je staat op het punt om de beleidsrelatie tussen "${props.beleidsbeslissingTitel}" en "${relatie.beleidsbeslissing.Titel}" te verbreken`
                                                        : `Je staat op het punt om het beleidsrelatie verzoek tussen "${props.beleidsbeslissingTitel}" en "${relatie.beleidsbeslissing.Titel}" in te trekken`}
                                                </p>
                                            </div>
                                            <h4 className="font-bold mb-2">
                                                {relatie.Status === 'Akkoord'
                                                    ? 'Weet je zeker dat je deze beleidsrelatie wilt verbreken?'
                                                    : 'Weet je zeker dat je dit beleidsrelatie verzoek wilt intrekken?'}
                                            </h4>
                                            <p>
                                                Deze actie kan niet ongedaan
                                                worden gemaakt. Je kan wel een
                                                nieuwe beleidsrelatie aangaan.
                                                Deze moet dan opnieuw worden
                                                gemotiveerd.
                                            </p>
                                            <div className="mt-10 flex justify-between">
                                                <span className="text-gray-600 cursor-pointer text-sm underline">
                                                    Annuleren
                                                </span>
                                                <span className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline cursor-pointer">
                                                    {relatie.Status ===
                                                    'Akkoord'
                                                        ? 'Verbreken'
                                                        : 'Intrekken'}
                                                </span>
                                            </div>
                                        </PopUpAnimatedContainer>
                                    ) : null}
                                </div>
                            </li>
                        )
                    })
                ) : (
                    <span className="font-italic text-sm px-2 py-2 inline-block text-gray-600">
                        Er zijn nog geen beleidsrelaties
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
    )
}

export default withRouter(MuteerBeleidsrelatieDetail)
