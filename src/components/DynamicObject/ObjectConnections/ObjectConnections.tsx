import { Heading } from '@pzh-ui/components'
import { useCallback, useState } from 'react'

import { RegulationShort, RelationShort } from '@/api/fetchers.schemas'
import ObjectConnectionModal from '@/components/Modals/ObjectModals/ObjectConnectionModal'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import RegulationModal from '@/components/Modals/RegulationModal/RegulationModal'
import { RegulationModalActions } from '@/components/Modals/RegulationModal/types'
import * as models from '@/config/objects'
import { Model, ModelReturnType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import getPropertyByName from '@/utils/getPropertyByName'

import ObjectConnectionPart from '../ObjectConnectionPart'
import ObjectRegulationsPart from '../ObjectRegulationsPart'

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

    const [modal, setModal] = useState<
        (ObjectConnectionModalActions | RegulationModalActions) & {
            type: 'object' | 'regulation'
        }
    >({
        type: 'object',
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
                if (type === 'Regulations') {
                    return getPropertyByName(data, type)
                }

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

            {model.allowedConnections?.map(connection => {
                if (
                    connection.type === 'regulations' ||
                    connection.key === 'Regulations'
                ) {
                    return (
                        <ObjectRegulationsPart
                            key={connection.type}
                            setModal={setModal}
                            connections={
                                getConnections(
                                    connection.key
                                ) as RegulationShort[]
                            }
                            isLoading={isLoading}
                            canEdit={
                                (canPatchObjectInModule && isOwner) ||
                                canCreateModule
                            }
                        />
                    )
                }

                return (
                    <ObjectConnectionPart
                        key={connection.type}
                        connectionKey={connection.key}
                        model={models[connection.type]}
                        setModal={setModal}
                        connections={
                            getConnections(connection.key) as Connection[]
                        }
                        isLoading={isLoading}
                        canEdit={
                            (canPatchObjectInModule && isOwner) ||
                            canCreateModule
                        }
                    />
                )
            })}

            <ObjectConnectionModal
                onClose={() => setModal({ ...modal, isOpen: false })}
                model={model}
                {...(modal as ObjectConnectionModalActions)}
                isOpen={modal.isOpen && modal.type === 'object'}
            />

            {!!model.allowedConnections.some(e => e.type === 'regulations') && (
                <RegulationModal
                    onClose={() => setModal({ ...modal, isOpen: false })}
                    model={model}
                    {...(modal as RegulationModalActions)}
                    isOpen={modal.isOpen && modal.type === 'regulation'}
                />
            )}
        </>
    )
}

export default ObjectConnections
