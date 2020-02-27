import React, { Component } from 'react'
import { format } from 'date-fns'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import LoaderBeleidsrelatieRegel from './../../../components/LoaderBeleidsrelatieRegel'
import LoaderMainTitle from './../../../components/LoaderMainTitle'
import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'

function TabRelaties(props) {
    return (
        <ul>
            <li className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 p-2">
                <div className="w-5/12">Beleidsbeslissingen</div>
                <div className="w-4/12">Datum</div>
                <div className="w-1/12">Status</div>
                <div className="w-3/12 pl-8">Motivering</div>
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
                                <div className="w-4/12">
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
                                                <span
                                                    className="text-gray-600 cursor-pointer text-sm underline"
                                                    onClick={() => {
                                                        props.toggleVerbreekPopup(
                                                            null
                                                        )
                                                    }}
                                                >
                                                    Annuleren
                                                </span>
                                                <span
                                                    className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline cursor-pointer"
                                                    onClick={() => {
                                                        props.relatieVerbreken(
                                                            relatie
                                                        )
                                                    }}
                                                >
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

export default TabRelaties
