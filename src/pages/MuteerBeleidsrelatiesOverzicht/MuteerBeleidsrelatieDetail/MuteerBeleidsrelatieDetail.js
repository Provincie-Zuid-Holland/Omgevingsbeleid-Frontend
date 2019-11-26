import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

import axios from './../../../API/axios'

import ButtonBackToPage from './../../../components/ButtonBackToPage'
import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'

class MuteerBeleidsrelatieDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentView: 'relaties',
        }
        this.relatieAccepteren = this.relatieAccepteren.bind(this)
        this.relatieAfwijzen = this.relatieAfwijzen.bind(this)
    }

    relatieAccepteren(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Status: 'Akkoord',
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
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
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    render() {
        const beleidsbeslissing = this.props.beleidsbeslissing

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
                                {beleidsbeslissing.Titel}
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
                                {beleidsbeslissing.VerzoekArray &&
                                beleidsbeslissing.VerzoekArray.length > 0 ? (
                                    <span className="bg-red-600 rounded-full ml-2 inline-block text-white w-6 h-6 text-center text-base">
                                        {beleidsbeslissing.VerzoekArray.length}
                                    </span>
                                ) : null}
                            </li>
                        </ul>
                    </div>

                    {this.state.currentView === 'relaties' ? (
                        <ul>
                            <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 p-2">
                                <div className="w-6/12">
                                    Beleidsbeslissingen
                                </div>
                                <div className="w-3/12">Datum</div>
                                <div className="w-2/12">Status</div>
                                <div className="w-2/12">Motivering</div>
                            </li>
                            {beleidsbeslissing.RelatieArray &&
                            beleidsbeslissing.RelatieArray.length > 0 ? (
                                beleidsbeslissing.RelatieArray.map(relatie => {
                                    return (
                                        <li
                                            key={relatie.UUID}
                                            className="flex border-b border-gray-200 text-sm text-gray-800 py-2 px-2 relative items-center hover:bg-gray-100"
                                        >
                                            <div className="w-6/12">
                                                {
                                                    relatie
                                                        .beleidsrelatieGekoppeldObject
                                                        .Titel
                                                }
                                            </div>
                                            <div className="w-3/12">
                                                {relatie.Datum_Akkoord !== null
                                                    ? format(
                                                          new Date(
                                                              relatie.Datum_Akkoord
                                                          ),
                                                          'd MMMM YYYY, HH:mm uur'
                                                      )
                                                    : null}
                                            </div>
                                            <div className="w-2/12">
                                                {relatie.Status === 'Akkoord'
                                                    ? 'Bevestigd'
                                                    : relatie.Status === 'Open'
                                                    ? 'In afwachting'
                                                    : relatie.Status ===
                                                      'NietAkkoord'
                                                    ? 'Afgewezen'
                                                    : null}
                                            </div>
                                            <div className="w-2/12">
                                                <span
                                                    onClick={() => {
                                                        this.setState({
                                                            motiveringPopUp:
                                                                relatie.UUID,
                                                        })
                                                    }}
                                                    className="underline cursor-pointer"
                                                >
                                                    Bekijk motivering
                                                </span>
                                                {this.state.motiveringPopUp ===
                                                relatie.UUID ? (
                                                    <PopUpAnimatedContainer
                                                        small={true}
                                                    >
                                                        <div
                                                            onClick={() =>
                                                                this.setState({
                                                                    motiveringPopUp: null,
                                                                })
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
                                                            {
                                                                relatie.Omschrijving
                                                            }
                                                        </p>
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
                            )}
                        </ul>
                    ) : null}
                    {this.state.currentView === 'verzoeken' ? (
                        <ul>
                            <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 p-2">
                                <div className="w-5/12">
                                    Beleidsbeslissingen
                                </div>
                                <div className="w-2/12">Aangevraagd op</div>
                                <div className="w-1/12">Status</div>
                                <div className="w-2/12">Motivering</div>
                                <div className="w-2/12">Actie</div>
                            </li>
                            {beleidsbeslissing.VerzoekArray &&
                            beleidsbeslissing.VerzoekArray.length > 0 ? (
                                beleidsbeslissing.VerzoekArray.map(verzoek => {
                                    return (
                                        <li
                                            key={verzoek.UUID}
                                            className="flex border-b border-gray-200 text-sm text-gray-800 px-2 relative items-center hover:bg-gray-100"
                                        >
                                            <div className="w-5/12 py-2">
                                                {verzoek.beleidsrelatieGekoppeldObject &&
                                                verzoek
                                                    .beleidsrelatieGekoppeldObject
                                                    .Titel
                                                    ? verzoek
                                                          .beleidsrelatieGekoppeldObject
                                                          .Titel
                                                    : null}
                                            </div>
                                            <div className="w-2/12">
                                                {verzoek.Datum_Akkoord !== null
                                                    ? format(
                                                          new Date(
                                                              verzoek.Datum_Akkoord
                                                          ),
                                                          'd MMMM yyyy, '
                                                      )
                                                    : null}
                                            </div>
                                            <div className="w-1/12">Open</div>
                                            <div className="w-2/12">
                                                <span
                                                    onClick={() => {
                                                        this.setState({
                                                            motiveringPopUp:
                                                                verzoek.UUID,
                                                        })
                                                    }}
                                                    className="underline cursor-pointer"
                                                >
                                                    Bekijk motivering
                                                </span>
                                                {this.state.motiveringPopUp ===
                                                verzoek.UUID ? (
                                                    <PopUpAnimatedContainer
                                                        small={true}
                                                    >
                                                        <div
                                                            onClick={() =>
                                                                this.setState({
                                                                    motiveringPopUp: null,
                                                                })
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
                                                            {
                                                                verzoek.Omschrijving
                                                            }
                                                        </p>
                                                    </PopUpAnimatedContainer>
                                                ) : null}
                                            </div>
                                            <div className="w-2/12">
                                                <span
                                                    onClick={() =>
                                                        this.relatieAccepteren(
                                                            verzoek
                                                        )
                                                    }
                                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded cursor-pointer shadow inline-block mr-2"
                                                >
                                                    Accepteren
                                                </span>
                                                <span
                                                    onClick={() =>
                                                        this.relatieAfwijzen(
                                                            verzoek
                                                        )
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
                    ) : null}
                </div>
            </div>
        )
    }
}

export default withRouter(MuteerBeleidsrelatieDetail)
