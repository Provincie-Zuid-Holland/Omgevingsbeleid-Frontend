import { Heading } from '@pzh-ui/components'
import { useCallback, useState } from 'react'

import { RelationShort } from '@/api/fetchers.schemas'
import ObjectConnectionModal from '@/components/Modals/ObjectModals/ObjectConnectionModal'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import * as models from '@/config/objects'
import { Model, ModelReturnType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import getPropertyByName from '@/utils/getPropertyByName'

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
    const { canCreateModule, canPatchObjectInModule } = usePermissions()

    const { data, isLoading, isOwner } = useObject()

    const [modal, setModal] = useState<ObjectConnectionModalActions>({
        isOpen: false,
        initialStep: 1,
        initialValues: {} as RelationShort,
    })

    /**
     * Get connections of Object_Type
     */
    const getConnections = useCallback(
        (type: keyof ModelReturnType) => {
            if (data && type in data) {
                const propertyType = getPropertyByName(data, type)

                if (Array.isArray(propertyType)) {
                    return propertyType.map(({ Object, Relation }) => ({
                        ...Object,
                        Object_ID: Object.Object_ID || 0,
                        Object_Type: Object.Object_Type || '',
                        Description: Relation.Description,
                    }))
                }
            }
        },
        [data]
    )

    if (!!!model.allowedConnections?.length) return null

    return (
        <>
            <div className="mt-8 mb-5">
                <Heading level="3">Koppelingen</Heading>
            </div>

            {model.allowedConnections?.map(connection => (
                <ObjectConnectionPart
                    key={connection.type}
                    connectionKey={connection.key}
                    model={models[connection.type]}
                    setModal={setModal}
                    connections={getConnections(connection.key)}
                    isLoading={isLoading}
                    canEdit={
                        (canPatchObjectInModule && isOwner) || canCreateModule
                    }
                />
            ))}

            <ObjectConnectionModal
                onClose={() => setModal({ ...modal, isOpen: false })}
                model={model}
                {...modal}
            />
        </>
    )
}

export default ObjectConnections
