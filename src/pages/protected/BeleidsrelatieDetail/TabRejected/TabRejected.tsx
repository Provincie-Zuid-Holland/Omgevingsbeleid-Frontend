import { useParams } from 'react-router-dom'

import {
    BeleidskeuzesInline,
    BeleidsrelatiesRead,
} from '@/api/fetchers.schemas'
import { LoaderBeleidsrelatieRegel } from '@/components/Loader'
import formatDate from '@/utils/formatDate'

import PopupMotivation from '../PopupMotivation'

/**
 * @prop {boolean} loaded true if the incoming relationships have loaded
 * @prop {array} rejected contains the relations
 * @prop {string} motivationPopUp contains the UUID of a beleidsrelatie
 * @prop {function} setMotivationPopUp takes a UUID and set it in parent state in motivationPopUp
 */

interface TabRejectedProps {
    loaded?: boolean
    rejected: BeleidsrelatiesRead[]
    motivationPopUp?: string | null
    setMotivationPopUp: (UUID?: string | null) => void
}

function TabRejected({
    loaded,
    rejected,
    motivationPopUp,
    setMotivationPopUp,
}: TabRejectedProps) {
    const { UUID } = useParams<{ UUID: string }>()

    const getPropertyFromRelation = (
        relation: BeleidsrelatiesRead,
        property: keyof BeleidskeuzesInline
    ) => {
        if (relation.Van_Beleidskeuze?.UUID === UUID) {
            return relation.Naar_Beleidskeuze?.[property]
        } else if (relation.Naar_Beleidskeuze?.UUID === UUID) {
            return relation.Van_Beleidskeuze?.[property]
        }
    }

    return (
        <ul>
            <li className="flex p-2 text-sm font-bold text-gray-800 border-b border-gray-200">
                <div className="w-4/12">Beleidskeuzes</div>
                <div className="w-4/12">Datum</div>
                <div className="w-2/12">Status</div>
                <div className="w-2/12 pl-8">Motivering</div>
            </li>
            {loaded ? (
                rejected?.length > 0 ? (
                    rejected.map(relatie => {
                        const title = getPropertyFromRelation(relatie, 'Titel')
                        return (
                            <li
                                key={relatie.UUID}
                                className="relative flex items-center px-2 py-2 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100">
                                <div className="w-4/12 pr-4">{title}</div>
                                <div className="w-4/12 pr-4">
                                    {relatie.Datum_Akkoord !== null
                                        ? formatDate(
                                              new Date(
                                                  relatie.Modified_Date || ''
                                              ),
                                              'd MMMM yyyy, HH:mm'
                                          ) + ' uur'
                                        : 'Zojuist afgewezen'}
                                </div>
                                <div className="w-2/12">
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
                                            setMotivationPopUp(relatie.UUID)
                                        }}
                                        className="underline cursor-pointer">
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
                    <li className="inline-block p-2 text-sm text-gray-600 font-italic">
                        Er zijn nog geen afgewezen beleidsrelaties
                    </li>
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

export default TabRejected
