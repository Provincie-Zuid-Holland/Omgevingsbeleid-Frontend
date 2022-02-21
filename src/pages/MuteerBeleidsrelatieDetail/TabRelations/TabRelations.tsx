import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'

import {
    BeleidskeuzesInline,
    BeleidsrelatiesRead,
    BeleidsrelatiesReadStatus,
} from '@/api/fetchers.schemas'
import { LoaderBeleidsrelatieRegel } from '@/components/Loader'
import { PopUpAnimatedContainer } from '@/components/Popup'
import formatDate from '@/utils/formatDate'

import PopupMotivation from '../PopupMotivation'

/**
 * @prop {boolean} loaded true if all the data from parent component is loaded
 * @prop {array} relations contains the relations
 * @prop {string} motivationPopUp contains the UUID of a beleidsrelatie
 * @prop {function} setMotivationPopUp takes a UUID and set it in parent state in motivationPopUp
 * @prop {function} setDisconnectPopup takes a UUID and set it in parent state in motivationPopUp
 * @prop {string} disconnectPopUp contains the UUID of a beleidsrelatie
 * @prop {string} beleidskeuzeTitle contains the title of the beleidsobject
 * @prop {function} relationshipDisconnect function to disconnect a relationship
 * @prop {function} updateStatus function to update a status in parent state
 */

interface TabRelationsProps {
    loaded?: boolean
    relations: BeleidsrelatiesRead[]
    motivationPopUp?: string | null
    setMotivationPopUp: (UUID?: string | null) => void
    setDisconnectPopup: (UUID?: string | null) => void
    disconnectPopUp?: string | null
    beleidskeuzeTitle?: string
    relationshipDisconnect: (relation: BeleidsrelatiesRead) => void
    updateStatus: (
        uuid?: string,
        nieuweStatus?: BeleidsrelatiesReadStatus,
        updateDatumAkkoord?: boolean
    ) => void
}

function TabRelations({
    loaded,
    relations,
    motivationPopUp,
    setMotivationPopUp,
    setDisconnectPopup,
    disconnectPopUp,
    relationshipDisconnect,
    updateStatus,
    beleidskeuzeTitle,
}: TabRelationsProps) {
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
                <div className="w-2/12">Aangevraagd op</div>
                <div className="w-2/12">Status</div>
                <div className="w-2/12">Motivering</div>
                <div className="w-2/12">Actie</div>
            </li>
            {loaded ? (
                relations.length > 0 ? (
                    relations.map(relatie => {
                        const title = getPropertyFromRelation(relatie, 'Titel')

                        return (
                            <li
                                key={relatie.UUID}
                                className="relative flex items-center px-2 py-2 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100">
                                <div className="w-4/12 pr-4">{title}</div>
                                <div className="w-2/12 pr-4">
                                    {relatie.Created_Date !== null
                                        ? formatDate(
                                              new Date(
                                                  relatie.Created_Date || ''
                                              ),
                                              'd MMMM yyyy, HH:mm'
                                          ) + ' uur'
                                        : null}
                                </div>
                                <div className="w-2/12 pr-2">
                                    {relatie.Status === 'Akkoord'
                                        ? 'Bevestigd'
                                        : relatie.Status === 'Open'
                                        ? 'In afwachting'
                                        : relatie.Status === 'NietAkkoord'
                                        ? 'Afgewezen'
                                        : null}
                                </div>
                                <div className="w-2/12">
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
                                <div className="w-2/12">
                                    <span
                                        onClick={() => {
                                            setDisconnectPopup(relatie.UUID)
                                        }}
                                        className={`text-red-600 underline cursor-pointer`}>
                                        {relatie.Status === 'Akkoord'
                                            ? 'Relatie verwijderen'
                                            : 'Verzoek intrekken'}
                                    </span>

                                    {disconnectPopUp === relatie.UUID ? (
                                        <PopUpConfirm
                                            setDisconnectPopup={
                                                setDisconnectPopup
                                            }
                                            relation={relatie}
                                            beleidskeuzeTitle={
                                                beleidskeuzeTitle
                                            }
                                            relationshipDisconnect={
                                                relationshipDisconnect
                                            }
                                            updateStatus={updateStatus}
                                            title={title}
                                        />
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
                <>
                    <LoaderBeleidsrelatieRegel />
                    <LoaderBeleidsrelatieRegel />
                    <LoaderBeleidsrelatieRegel />
                </>
            )}
        </ul>
    )
}

interface PopUpConfirmProps
    extends Pick<
        TabRelationsProps,
        | 'setDisconnectPopup'
        | 'beleidskeuzeTitle'
        | 'relationshipDisconnect'
        | 'updateStatus'
    > {
    relation: BeleidsrelatiesRead
    title?: string | number
}

const PopUpConfirm = ({
    setDisconnectPopup,
    relation,
    beleidskeuzeTitle,
    relationshipDisconnect,
    updateStatus,
    title,
}: PopUpConfirmProps) => {
    return (
        <PopUpAnimatedContainer small={true}>
            <div
                onClick={() => setDisconnectPopup(null)}
                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                id={`sluit-popup-beleidsrelatie-motivering`}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <h3 className="mb-4 text-lg font-bold">
                Beleidsrelatie
                {relation.Status === 'Akkoord'
                    ? ' verbreken'
                    : ' verzoek intrekken'}
            </h3>
            <div className="relative p-4 mb-4 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
                <p className="mt-2 text-sm text-gray-700">
                    {relation.Status === 'Akkoord'
                        ? `Je staat op het punt om de beleidsrelatie tussen "${beleidskeuzeTitle}" en "${title}" te verbreken`
                        : `Je staat op het punt om het beleidsrelatie verzoek tussen "${beleidskeuzeTitle}" en "${title}" in te trekken`}
                </p>
            </div>
            <h4 className="mb-2 font-bold">
                {relation.Status === 'Akkoord'
                    ? 'Weet je zeker dat je deze beleidsrelatie wilt verbreken?'
                    : 'Weet je zeker dat je dit beleidsrelatie verzoek wilt intrekken?'}
            </h4>
            <p>
                Deze actie kan niet ongedaan worden gemaakt. Je kan wel een
                nieuwe beleidsrelatie aangaan. Deze moet dan opnieuw worden
                gemotiveerd.
            </p>
            <div className="flex justify-between mt-10">
                <span
                    className="text-sm text-gray-600 underline cursor-pointer"
                    onClick={() => {
                        setDisconnectPopup(null)
                    }}>
                    Annuleren
                </span>
                <span
                    className="px-4 py-2 text-sm font-bold leading-tight text-white rounded cursor-pointer bg-pzh-blue hover:underline"
                    onClick={() => {
                        relationshipDisconnect(relation)
                        setDisconnectPopup(null)
                        updateStatus(
                            relation.UUID,
                            relation.Status === 'Akkoord'
                                ? 'Verbroken'
                                : 'NietAkkoord',
                            true
                        )
                    }}>
                    {relation.Status === 'Akkoord' ? 'Verbreken' : 'Intrekken'}
                </span>
            </div>
        </PopUpAnimatedContainer>
    )
}

export default TabRelations
