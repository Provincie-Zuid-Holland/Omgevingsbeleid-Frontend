import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Heading } from '@pzh-ui/components'

import { ReadRelation } from '@/api/fetchers.schemas'
import ObjectConnectionModal from '@/components/Modals/ObjectModals/ObjectConnectionModal'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import * as models from '@/config/objects'
import { Model, ModelType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'

import ObjectConnectionPart from '../ObjectConnectionPart'

interface ObjectConnectionsProps {
    model: Model
}

export interface Connection {
    Description?: string
    Object_Type: string
    Object_ID: number
    UUID?: string
    Title?: string
}

const ObjectConnections = ({ model }: ObjectConnectionsProps) => {
    const { objectId } = useParams()

    const { canCreateModule, canPatchObjectInModule } = usePermissions()

    const { isLoading, isOwner } = useObject()
    const { useGetRelations } = model.fetchers

    const [modal, setModal] = useState<ObjectConnectionModalActions>({
        initialStep: 1,
        initialValues: {} as ReadRelation,
        connectionModel: {} as Model,
    })

    const { data: relations } = useGetRelations(parseInt(objectId!), {
        query: {
            enabled: !!objectId,
        },
    })

    /**
     * Get connections of Object_Type
     */
    const getConnections = useCallback(
        (type: ModelType) =>
            relations?.filter(relation => relation.Object_Type === type),
        [relations]
    )

    if (!!!model.allowedConnections?.length) return null

    return (
        <>
            <div className="mb-5 mt-8">
                <Heading level="3" size="m">
                    Koppelingen
                </Heading>
            </div>

            {model.allowedConnections?.map(connection => (
                <ObjectConnectionPart
                    key={connection.type}
                    model={models[connection.type]}
                    setModal={setModal}
                    connections={getConnections(connection.type)}
                    isLoading={isLoading}
                    canEdit={
                        (canPatchObjectInModule && isOwner) || canCreateModule
                    }
                />
            ))}

            <ObjectConnectionModal
                model={model}
                {...(modal as ObjectConnectionModalActions)}
            />
        </>
    )
}

export default ObjectConnections
