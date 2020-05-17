import React, { Component } from 'react'
import { format } from 'date-fns'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import LoaderBeleidsrelatieRegel from './../../../components/LoaderBeleidsrelatieRegel'
import LoaderMainTitle from './../../../components/LoaderMainTitle'
import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'

function TabAfgewezen(props) {
    return (
        <ul>
            <li className="flex p-2 text-sm font-semibold text-gray-800 border-b border-gray-200">
                <div className="w-5/12">Beleidsbeslissingen</div>
                <div className="w-4/12">Datum</div>
                <div className="w-1/12">Status</div>
                <div className="w-3/12 pl-8">Motivering</div>
            </li>
            {props.naarLoaded && props.vanLoaded ? (
                props.afgewezenArray.length > 0 ? (
                    props.afgewezenArray.map((relatie) => {
                        return (
                            <li
                                key={relatie.UUID}
                                className="relative flex items-center px-2 py-2 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100"
                            >
                                <div className="w-5/12 pr-4">
                                    {relatie.beleidsbeslissing &&
                                    relatie.beleidsbeslissing.Titel ? (
                                        relatie.beleidsbeslissing.Titel
                                    ) : (
                                        <LoaderMainTitle />
                                    )}
                                </div>
                                <div className="w-4/12">
                                    {relatie.Datum_Akkoord !== null
                                        ? format(
                                              new Date(relatie.Datum_Akkoord),
                                              'd MMMM yyyy, HH:mm uur'
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
                                <div className="w-3/12 pl-8">
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
                                                {relatie.Omschrijving}
                                            </p>
                                        </PopUpAnimatedContainer>
                                    ) : null}
                                </div>
                            </li>
                        )
                    })
                ) : (
                    <span className="inline-block px-2 py-2 text-sm text-gray-600 font-italic">
                        Er zijn nog geen afgewezen beleidsrelaties
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

export default TabAfgewezen
