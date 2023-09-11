import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'

import { RequestAcknowledgedRelation } from '@/api/fetchers.schemas'
import ObjectRelationApprovedModal from '@/components/Modals/ObjectModals/ObjectRelationApprovedModal'
import ObjectRelationNewModal from '@/components/Modals/ObjectModals/ObjectRelationNewModal'
import ObjectRelationReceivedModal from '@/components/Modals/ObjectModals/ObjectRelationReceivedModal'
import ObjectRelationSentModal from '@/components/Modals/ObjectModals/ObjectRelationSentModal'
import { ObjectRelationModalActions } from '@/components/Modals/ObjectModals/types'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

import ObjectRelationPart from '../ObjectRelationPart'

interface ObjectRelationsProps {
    model: Model
}

const ObjectRelations = ({ model }: ObjectRelationsProps) => {
    const { objectId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [modal, setModal] = useState<ObjectRelationModalActions>({})

    const { canCreateModule, canPatchObjectInModule } = usePermissions()
    const { isOwner, data: objectData } = useObject()

    const { useGetAcknowledgedRelations } = model.fetchers
    const { data, isLoading, queryKey } =
        useGetAcknowledgedRelations?.(parseInt(objectId!), undefined, {
            query: { enabled: !!objectId },
        }) || {}

    const { approved, sent, received } = useMemo(() => {
        const filteredData = data?.filter(
            relation => !relation.Denied && !relation.Deleted_At
        )

        /** Approved relations */
        const approved = filteredData?.filter(
            relation =>
                relation.Side_A.Acknowledged && relation.Side_B.Acknowledged
        )

        /** Sent requests */
        const sent = filteredData?.filter(
            relation =>
                relation.Side_A.Acknowledged && !relation.Side_B.Acknowledged
        )

        /** Received requests */
        const received = filteredData?.filter(
            relation =>
                !relation.Side_A.Acknowledged && relation.Side_B.Acknowledged
        )

        return { approved, sent, received }
    }, [data])

    const history = useMemo(() => {
        const filteredData = data?.filter(
            relation =>
                relation.Denied ||
                (relation.Side_A.Acknowledged && relation.Side_B.Acknowledged)
        )

        /** Sent history */
        const sent = filteredData?.filter(
            relation => relation.Requested_By_Code === objectData?.Code
        )

        /** Received history */
        const received = filteredData?.filter(
            relation => relation.Requested_By_Code !== objectData?.Code
        )

        return { sent, received }
    }, [data, objectData])

    /**
     * Check if user has edit rights
     */
    const userCanEdit = useMemo(
        () => (canPatchObjectInModule && isOwner) || canCreateModule,
        [canPatchObjectInModule, isOwner, canCreateModule]
    )

    return (
        <>
            <div className="mb-5 mt-8 flex items-center justify-between">
                <Heading level="3" size="m">
                    Beleidsrelaties
                </Heading>
                {userCanEdit && (
                    <button
                        data-testid="object-relation-add"
                        onClick={() => {
                            setModal({
                                ...modal,
                                action: 'add',
                            })
                            setActiveModal('objectRelationAdd')
                        }}
                        className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-pzh-green">
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
                onClick={() => {
                    setModal({
                        ...modal,
                        action: 'approved',
                    })
                    setActiveModal('objectRelationApproved')
                }}
            />

            <ObjectRelationPart
                title="Uitgezonden verzoeken"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={sent?.length}
                onClick={() => {
                    setModal({
                        ...modal,
                        action: 'sent',
                    })
                    setActiveModal('objectRelationSent')
                }}
            />

            <ObjectRelationPart
                title="Binnengekomen verzoeken"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={received?.length}
                hasNotification={received && received.length > 0}
                onClick={() => {
                    setModal({
                        ...modal,
                        action: 'received',
                    })
                    setActiveModal('objectRelationReceived')
                }}
            />

            <ObjectRelationNewModal
                model={model}
                queryKey={queryKey}
                relations={approved}
                {...modal}
                initialValues={
                    {
                        Object_Type: model.defaults.singular,
                    } as RequestAcknowledgedRelation
                }
            />

            <ObjectRelationApprovedModal
                model={model}
                queryKey={queryKey}
                relations={approved}
                {...modal}
            />

            <ObjectRelationSentModal
                model={model}
                queryKey={queryKey}
                relations={sent}
                history={history.sent}
                {...modal}
            />

            <ObjectRelationReceivedModal
                model={model}
                queryKey={queryKey}
                relations={received}
                history={history.received}
                {...modal}
            />
        </>
    )
}

export default ObjectRelations
