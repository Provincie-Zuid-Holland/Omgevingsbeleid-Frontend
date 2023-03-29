import { Heading } from '@pzh-ui/components'
import { useCallback, useState } from 'react'

import { RelationShort } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { Model, ModelReturnType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import getPropertyByName from '@/utils/getPropertyByName'

import ObjectConnectionModal from '../ObjectModals/ObjectConnectionModal'
import { ObjectConnectionModalActions } from '../ObjectModals/types'
import ObjectRelationPart from '../ObjectRelationPart'

interface ObjectRelationsProps {
    model: Model
}

export interface Relation {
    Description?: string
    Object_Type: string
    Object_ID: number
    UUID?: string
    Title?: string
}

const ObjectRelations = ({ model }: ObjectRelationsProps) => {
    const { data } = useObject()

    const [modal, setModal] = useState<ObjectConnectionModalActions>({
        isOpen: false,
        initialStep: 1,
        initialValues: {} as RelationShort,
    })

    /**
     * Get relations of Object_Type
     */
    const getRelations = useCallback(
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

    return (
        <>
            <div className="mt-12 mb-4">
                <Heading level="3">Koppelingen & relaties</Heading>
            </div>

            {model.allowedConnections?.map(connection => (
                <ObjectRelationPart
                    key={connection.type}
                    connectionKey={connection.key}
                    model={models[connection.type]}
                    setModal={setModal}
                    relations={getRelations(connection.key)}
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

export default ObjectRelations
