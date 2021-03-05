import React from 'react'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import LoaderBeleidsrelatieRegel from '../../../components/LoaderBeleidsrelatieRegel'
import PopUpAnimatedContainer from '../../../components/PopUpAnimatedContainer'

/**
 * @prop {boolean} loaded true if all the data from parent component is loaded
 * @prop {array} requests contains the relations
 * @prop {string} motivationPopUp contains the UUID of a beleidsrelatie
 * @prop {function} setMotivationPopUp takes a UUID and set it in parent state in motivationPopUp
 * @prop {function} relationshipAccept accept an incoming relationship
 * @prop {function} relationshipReject reject an incoming relationship
 */
function TabRequests({
    loaded,
    requests,
    motivationPopUp,
    setMotivationPopUp,
    relationshipAccept,
    relationshipReject,
}) {
    return (
        <ul>
            <li className="flex p-2 text-sm font-semibold text-gray-800 border-b border-gray-200">
                <div className="w-5/12">Beleidskeuzes</div>
                <div className="w-2/12">Aangevraagd op</div>
                <div className="w-1/12">Status</div>
                <div className="w-2/12">Motivering</div>
                <div className="w-2/12">Actie</div>
            </li>
            {loaded ? (
                requests.length > 0 ? (
                    requests.map((verzoek) => {
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
                                            setMotivationPopUp(verzoek.UUID)
                                        }}
                                        className="underline cursor-pointer"
                                    >
                                        Bekijk motivering
                                    </span>
                                    {motivationPopUp === verzoek.UUID ? (
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
                                            relationshipAccept(verzoek)
                                        }
                                        className="inline-block px-2 py-1 mr-2 font-semibold text-white bg-green-600 rounded shadow cursor-pointer hover:bg-green-700"
                                    >
                                        Accepteren
                                    </span>
                                    <span
                                        onClick={() =>
                                            relationshipReject(verzoek)
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

export default TabRequests
