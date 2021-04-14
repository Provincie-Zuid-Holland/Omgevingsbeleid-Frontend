import React from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

import LoaderBeleidsrelatieRegel from '../../../components/LoaderBeleidsrelatieRegel'
import PopupMotivation from '../PopupMotivation/PopupMotivation'

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
    const { UUID } = useParams()

    const getPropertyFromRelation = (relation, property) => {
        if (relation.Van_Beleidskeuze.UUID === UUID) {
            return relation.Naar_Beleidskeuze[property]
        } else if (relation.Naar_Beleidskeuze.UUID === UUID) {
            return relation.Van_Beleidskeuze[property]
        }
    }

    return (
        <ul>
            <li className="flex p-2 text-sm font-bold text-gray-800 border-b border-gray-200">
                <div className="w-5/12">Beleidskeuzes</div>
                <div className="w-2/12">Aangevraagd op</div>
                <div className="w-1/12">Status</div>
                <div className="w-2/12">Motivering</div>
                <div className="w-2/12">Actie</div>
            </li>
            {loaded ? (
                requests.length > 0 ? (
                    requests.map((verzoek) => {
                        const titel = getPropertyFromRelation(verzoek, 'Titel')
                        return (
                            <li
                                key={verzoek.UUID}
                                className="relative flex items-center px-2 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100"
                            >
                                <div className="w-5/12 py-2">{titel}</div>
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
                                    <PopupMotivation
                                        motivationPopUp={motivationPopUp}
                                        setMotivationPopUp={setMotivationPopUp}
                                        relatie={verzoek}
                                    />
                                </div>
                                <div className="w-2/12 text-xs">
                                    <span
                                        onClick={() =>
                                            relationshipAccept(verzoek)
                                        }
                                        className="inline-block px-2 py-1 mr-2 font-bold text-white rounded shadow cursor-pointer bg-pzh-green hover:bg-pzh-green-dark"
                                    >
                                        Accepteren
                                    </span>
                                    <span
                                        onClick={() =>
                                            relationshipReject(verzoek)
                                        }
                                        className="inline-block px-2 py-1 font-bold text-white bg-red-600 rounded shadow cursor-pointer hover:bg-red-700"
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
