import React from 'react'
import { format } from 'date-fns'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import LoaderBeleidsrelatieRegel from './../../../components/LoaderBeleidsrelatieRegel'
import LoaderMainTitle from './../../../components/LoaderMainTitle'
import PopUpAnimatedContainer from './../../../components/PopUpAnimatedContainer'

/**
 * @prop {boolean} loaded true if all the data from parent component is loaded
 * @prop {array} relations contains the relations
 * @prop {string} motivationPopUp contains the UUID of a beleidsrelatie
 * @prop {function} setMotivationPopUp takes a UUID and set it in parent state in motivationPopUp
 * @prop {function} setDisconnectPopup takes a UUID and set it in parent state in motivationPopUp
 * @prop {string} disconnectPopUp contains the UUID of a beleidsrelatie
 * @prop {string} beleidsbeslissingTitle contains the title of the beleidsobject
 * @prop {function} relationshipDisconnect function to disconnect a relationship
 * @prop {function} updateStatus function to update a status in parent state
 */
function TabRelations({
    loaded,
    relations,
    motivationPopUp,
    setMotivationPopUp,
    setDisconnectPopup,
    disconnectPopUp,
    beleidsbeslissingTitle,
    relationshipDisconnect,
    updateStatus,
}) {
    return (
        <ul>
            <li className="flex p-2 text-sm font-bold text-gray-800 border-b border-gray-200">
                <div className="w-5/12">Beleidskeuzes</div>
                <div className="w-2/12">Aangevraagd op</div>
                <div className="w-1/12">Status</div>
                <div className="w-2/12 pl-4">Motivering</div>
                <div className="flex justify-end w-2/12">Actie</div>
            </li>
            {loaded ? (
                relations.length > 0 ? (
                    relations.map((relatie) => {
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
                                <div className="w-2/12">
                                    {relatie.Created_Date !== null
                                        ? format(
                                              new Date(relatie.Created_Date),
                                              'd MMMM yyyy, HH:mm'
                                          ) + ' uur'
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
                                <div className="w-2/12 pl-4">
                                    <span
                                        onClick={() => {
                                            setMotivationPopUp(relatie.UUID)
                                        }}
                                        className="underline cursor-pointer"
                                    >
                                        Bekijk motivering
                                    </span>
                                    {motivationPopUp === relatie.UUID ? (
                                        <PopUpAnimatedContainer small={true}>
                                            <div
                                                onClick={() =>
                                                    setMotivationPopUp(null)
                                                }
                                                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                                                id={`sluit-popup-beleidsrelatie-motivering`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            </div>
                                            <h3 className="form-field-label font-bold">
                                                Motivering
                                            </h3>
                                            <p className="form-field-description">
                                                {relatie.Omschrijving}
                                            </p>
                                        </PopUpAnimatedContainer>
                                    ) : null}
                                </div>
                                <div className="flex justify-end w-2/12">
                                    <span
                                        onClick={() => {
                                            setDisconnectPopup(relatie.UUID)
                                        }}
                                        className="text-red-600 underline cursor-pointer"
                                    >
                                        {relatie.Status === 'Akkoord'
                                            ? 'Relatie verwijderen'
                                            : 'Verzoek intrekken'}
                                    </span>
                                    {disconnectPopUp === relatie.UUID ? (
                                        <PopUpAnimatedContainer small={true}>
                                            <div
                                                onClick={() =>
                                                    setDisconnectPopup(null)
                                                }
                                                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                                                id={`sluit-popup-beleidsrelatie-motivering`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            </div>
                                            <h3 className="mb-4 text-lg font-bold">
                                                Beleidsrelatie
                                                {relatie.Status === 'Akkoord'
                                                    ? ' verbreken'
                                                    : ' verzoek intrekken'}
                                            </h3>
                                            <div className="relative p-4 mb-4 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
                                                <p className="mt-2 text-sm text-gray-700">
                                                    {relatie.Status ===
                                                    'Akkoord'
                                                        ? `Je staat op het punt om de beleidsrelatie tussen "${beleidsbeslissingTitle}" en "${relatie.beleidsbeslissing.Titel}" te verbreken`
                                                        : `Je staat op het punt om het beleidsrelatie verzoek tussen "${beleidsbeslissingTitle}" en "${relatie.beleidsbeslissing.Titel}" in te trekken`}
                                                </p>
                                            </div>
                                            <h4 className="mb-2 font-bold">
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
                                            <div className="flex justify-between mt-10">
                                                <span
                                                    className="text-sm text-gray-600 underline cursor-pointer"
                                                    onClick={() => {
                                                        setDisconnectPopup(null)
                                                    }}
                                                >
                                                    Annuleren
                                                </span>
                                                <span
                                                    className="px-4 py-2 text-sm font-bold leading-tight text-white rounded cursor-pointer bg-pzh-blue hover:underline"
                                                    onClick={() => {
                                                        relationshipDisconnect(
                                                            relatie
                                                        )
                                                        setDisconnectPopup(null)
                                                        updateStatus(
                                                            relatie.UUID,
                                                            relatie.Status ===
                                                                'Akkoord'
                                                                ? 'Verbroken'
                                                                : 'NietAkkoord'
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
                    <span className="inline-block px-2 py-2 text-sm text-gray-600 font-italic">
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

export default TabRelations
