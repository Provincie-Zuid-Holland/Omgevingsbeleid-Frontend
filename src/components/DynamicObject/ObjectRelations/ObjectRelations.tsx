import { Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { RequestAcknowledgedRelation } from '@/api/fetchers.schemas'
import ObjectRelationNewModal from '@/components/Modals/ObjectModals/ObjectRelationNewModal/ObjectRelationNewModal'
import { ObjectRelationNewModalActions } from '@/components/Modals/ObjectModals/types'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'

import ObjectRelationPart from '../ObjectRelationPart'

interface ObjectRelationsProps {
    model: Model
}

const ObjectRelations = ({ model }: ObjectRelationsProps) => {
    const { objectId } = useParams()

    const [modal, setModal] = useState<ObjectRelationNewModalActions>({
        isOpen: false,
        initialValues: {
            Object_Type: model.defaults.singular,
        } as RequestAcknowledgedRelation,
    })

    const { canCreateModule, canPatchObjectInModule } = usePermissions()
    const { isOwner } = useObject()

    const { useGetAcknowledgedRelations } = model.fetchers
    const { data, isLoading, queryKey } =
        useGetAcknowledgedRelations?.(parseInt(objectId!), undefined, {
            query: { enabled: !!objectId },
        }) || {}

    const { approvedAmount, sentAmount, receivedAmount } = useMemo(() => {
        /** Amount of approved relations */
        const approvedAmount =
            data?.filter(
                relation =>
                    relation.Side_A.Acknowledged && relation.Side_B.Acknowledged
            ).length || 0

        /** Amount of sent requests */
        const sentAmount =
            data?.filter(
                relation =>
                    relation.Side_A.Acknowledged &&
                    !relation.Side_B.Acknowledged
            ).length || 0

        /** Amount of received requests */
        const receivedAmount =
            data?.filter(
                relation =>
                    !relation.Side_A.Acknowledged &&
                    relation.Side_B.Acknowledged
            ).length || 0

        return { approvedAmount, sentAmount, receivedAmount }
    }, [data])

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
                amount={approvedAmount}
            />

            <ObjectRelationPart
                title="Uitgezonden verzoeken"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={sentAmount}
            />

            <ObjectRelationPart
                title="Binnengekomen verzoeken"
                isLoading={isLoading}
                canEdit={userCanEdit}
                amount={receivedAmount}
                hasNotification={receivedAmount > 0}
            />

            <ObjectRelationNewModal
                model={model}
                onClose={() => setModal({ ...modal, isOpen: false })}
                queryKey={queryKey}
                {...modal}
            />
        </>
    )
}

export default ObjectRelations
