import React, { Component } from 'react'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import LoaderBeleidsrelatieRegel from './../../../components/LoaderBeleidsrelatieRegel'
import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'

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
            {props.naarLoaded && props.vanLoaded ? (
                props.verzoekArray.length > 0 ? (
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
                                    {verzoek.Aanvraag_Datum !== null
                                        ? format(
                                              verzoek.Aanvraag_Datum,
                                              'D MMMM YYYY, HH:mm uur',
                                              { locale: nlLocale }
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
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
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

export default TabVerzoeken
