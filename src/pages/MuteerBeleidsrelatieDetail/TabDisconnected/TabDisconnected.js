import { format } from 'date-fns'
import { useParams } from 'react-router-dom'

import LoaderBeleidsrelatieRegel from '../../../components/LoaderBeleidsrelatieRegel'
import PopupMotivation from '../PopupMotivation/PopupMotivation'

/**
 * @prop {boolean} loaded true if the incoming relationships have loaded
 * @prop {boolean} loaded true if the outgoing relationships have loaded
 * @prop {array} disconnected contains the beleidsrelaties with a status of 'Verbroken'
 * @prop {string} motivationPopUp contains the UUID of a beleidsrelatie
 * @prop {function} setMotivationPopUp takes a UUID and set it in parent state in motivationPopUp
 */
function TabDisconnected({
    loaded,
    disconnected,
    motivationPopUp,
    setMotivationPopUp,
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
                <div className="w-4/12">Beleidskeuzes</div>
                <div className="w-4/12">Datum</div>
                <div className="w-2/12">Status</div>
                <div className="w-2/12">Motivering</div>
            </li>
            {loaded ? (
                disconnected.length > 0 ? (
                    disconnected.map(relatie => {
                        const title = getPropertyFromRelation(relatie, 'Titel')
                        return (
                            <li
                                key={relatie.UUID}
                                className="relative flex items-center px-2 py-2 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100"
                            >
                                <div className="w-4/12 pr-4">{title}</div>
                                <div className="w-4/12 pr-4">
                                    {relatie.Datum_Akkoord !== null
                                        ? format(
                                              new Date(relatie.Datum_Akkoord),
                                              'd MMMM yyyy, HH:mm'
                                          ) + ' uur'
                                        : null}
                                </div>
                                <div className="w-2/12">
                                    {relatie.Status === 'Akkoord'
                                        ? 'Bevestigd'
                                        : relatie.Status === 'Open'
                                        ? 'In afwachting'
                                        : relatie.Status === 'NietAkkoord'
                                        ? 'Afgewezen'
                                        : relatie.Status === 'Verbroken'
                                        ? 'Verbroken'
                                        : null}
                                </div>
                                <div className="w-2/12">
                                    <span
                                        onClick={() => {
                                            setMotivationPopUp(relatie.UUID)
                                        }}
                                        className="underline cursor-pointer"
                                    >
                                        Bekijk motivering
                                    </span>

                                    <PopupMotivation
                                        motivationPopUp={motivationPopUp}
                                        setMotivationPopUp={setMotivationPopUp}
                                        relatie={relatie}
                                    />
                                </div>
                            </li>
                        )
                    })
                ) : (
                    <span className="inline-block px-2 py-2 text-sm text-gray-600 font-italic">
                        Er zijn nog geen verbroken beleidsrelaties
                    </span>
                )
            ) : (
                <>
                    <LoaderBeleidsrelatieRegel />
                    <LoaderBeleidsrelatieRegel />
                    <LoaderBeleidsrelatieRegel />
                </>
            )}
        </ul>
    )
}

export default TabDisconnected
