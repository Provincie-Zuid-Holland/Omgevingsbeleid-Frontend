import React, { Component } from 'react'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import LoaderBeleidsrelatieRegel from './../../../components/LoaderBeleidsrelatieRegel'
import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'

/**
 * 
 * @function
 * @memberof MuteerBeleidsrelatieDetail
 * @param {any} props - Een verzameling van eigendommen (properties).
 */
function TabVerzoeken(props) {
    return (
        <ul>
            <li className="flex p-2 text-sm font-semibold text-gray-800 border-b border-gray-200">
                <div className="w-5/12">Beleidskeuzes</div>
                <div className="w-2/12">Aangevraagd op</div>
                <div className="w-1/12">Status</div>
                <div className="w-2/12">Motivering</div>
                <div className="w-2/12">Actie</div>
            </li>
            {props.naarLoaded && props.vanLoaded ? (
                props.verzoekArray.length > 0 ? (
                    props.verzoekArray.map((verzoek) => {
                        return (
                            <li
                                key={verzoek.UUID}
                                className="relative flex items-center px-2 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100"
                            >
                                <div className="w-5/12 py-2">
                                    {verzoek.beleidsbeslissing &&
                                    verzoek.beleidsbeslissing.Titel
                                        ? verzoek.beleidsbeslissing.Titel
                                        : null}
                                </div>
                                <div className="w-2/12">
                                    {verzoek.Created_Date !== null
                                        ? format(
                                              new Date(verzoek.Created_Date),
                                              'd MMMM yyyy, HH:mm',
                                              { locale: nlLocale }
                                          ) + ' uur'
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
                                                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
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
                                        className="inline-block px-2 py-1 mr-2 font-semibold text-white bg-green-600 rounded shadow cursor-pointer hover:bg-green-700"
                                    >
                                        Accepteren
                                    </span>
                                    <span
                                        onClick={() =>
                                            props.relatieAfwijzen(verzoek)
                                        }
                                        className="inline-block px-2 py-1 font-semibold text-white bg-red-600 rounded shadow cursor-pointer hover:bg-red-700"
                                    >
                                        Afwijzen
                                    </span>
                                </div>
                            </li>
                        )
                    })
                ) : (
                    <span className="inline-block px-2 py-2 text-sm text-gray-600 font-italic">
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
