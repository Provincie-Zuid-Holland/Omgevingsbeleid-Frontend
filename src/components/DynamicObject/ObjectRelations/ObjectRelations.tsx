import { Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { RequestAcknowledgedRelation } from '@/api/fetchers.schemas'
import ObjectRelationApprovedModal from '@/components/Modals/ObjectModals/ObjectRelationApprovedModal/ObjectRelationApprovedModal'
import ObjectRelationNewModal from '@/components/Modals/ObjectModals/ObjectRelationNewModal/ObjectRelationNewModal'
import ObjectRelationReceivedModal from '@/components/Modals/ObjectModals/ObjectRelationReceivedModal/ObjectRelationReceivedModal'
import ObjectRelationSentModal from '@/components/Modals/ObjectModals/ObjectRelationSentModal/ObjectRelationSentModal'
import { ObjectRelationModalActions } from '@/components/Modals/ObjectModals/types'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'

import ObjectRelationPart from '../ObjectRelationPart'

interface ObjectRelationsProps {
    model: Model
}

const ObjectRelations = ({ model }: ObjectRelationsProps) => {
    const { objectId } = useParams()

    const [modal, setModal] = useState<ObjectRelationModalActions>({
        isOpen: false,
    })

    const { canCreateModule, canPatchObjectInModule } = usePermissions()
    const { isOwner } = useObject()

    const { useGetAcknowledgedRelations } = model.fetchers
    const { data, isLoading, queryKey } =
        useGetAcknowledgedRelations?.(parseInt(objectId!), undefined, {
            query: { enabled: !!objectId },
        }) || {}

    const { approved, sent, received } = useMemo(() => {
        /** Approved relations */
        const approved = data?.filter(
            relation =>
                relation.Side_A.Acknowledged && relation.Side_B.Acknowledged
        )

        /** Sent requests */
        const sent = data?.filter(
            relation =>
                relation.Side_A.Acknowledged && !relation.Side_B.Acknowledged
        )

        /** Received requests */
        const received = data?.filter(
            relation =>
                !relation.Side_A.Acknowledged && relation.Side_B.Acknowledged
        )

        return { approved, sent, received }
    }, [data])

    /**
     * Check if user has edit rights
     */
    const userCanEdit = useMemo(
        () => (canPatchObjectInModule && isOwner) || canCreateModule,
        [canPatchObjectInModule, isOwner, canCreateModule]
    )

    return (
        <>
            <div className="mt-8 mb-5 flex justify-between items-center">
                <Heading level="3">Beleidsrelaties</Heading>
                {userCanEdit && (
                    <button
                        onClick={() =>
                            setModal({
                                ...modal,
                                action: 'add',
                                isOpen: true,
                            })
                        }
                        className="w-[18px] h-[18px] bg-pzh-green rounded-full flex items-center justify-center">
                        <span className="sr-only">
                            Beleidsrelatie toevoegen
                        </span>
                        <Plus size={14} className="text-pzh-white" />
                    </button>
                )}
            </div>

            <ObjectRelationPart
                title="Gelegde relaties"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={approved?.length}
                onClick={() =>
                    setModal({
                        ...modal,
                        action: 'approved',
                        isOpen: true,
                    })
                }
            />

            <ObjectRelationPart
                title="Uitgezonden verzoeken"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={sent?.length}
                onClick={() =>
                    setModal({
                        ...modal,
                        action: 'sent',
                        isOpen: true,
                    })
                }
            />

            <ObjectRelationPart
                title="Binnengekomen verzoeken"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={received?.length}
                hasNotification={received && received.length > 0}
                onClick={() =>
                    setModal({
                        ...modal,
                        action: 'received',
                        isOpen: true,
                    })
                }
            />

            <ObjectRelationNewModal
                model={model}
                onClose={() => setModal({ ...modal, isOpen: false })}
                queryKey={queryKey}
                {...modal}
                initialValues={
                    {
                        Object_Type: model.defaults.singular,
                    } as RequestAcknowledgedRelation
                }
                isOpen={modal.isOpen && modal.action === 'add'}
            />

            <ObjectRelationApprovedModal
                model={model}
                onClose={() => setModal({ ...modal, isOpen: false })}
                queryKey={queryKey}
                relations={approved}
                {...modal}
                initialValues={
                    {
                        Object_Type: model.defaults.singular,
                    } as RequestAcknowledgedRelation
                }
                isOpen={modal.isOpen && modal.action === 'approved'}
            />

            <ObjectRelationSentModal
                model={model}
                onClose={() => setModal({ ...modal, isOpen: false })}
                queryKey={queryKey}
                relations={sent}
                {...modal}
                isOpen={modal.isOpen && modal.action === 'sent'}
            />

            <ObjectRelationReceivedModal
                model={model}
                onClose={() => setModal({ ...modal, isOpen: false })}
                queryKey={queryKey}
                relations={received}
                {...modal}
                isOpen={modal.isOpen && modal.action === 'received'}
            />
        </>
    )
}

export default ObjectRelations
