import { Button, Heading } from '@pzh-ui/components'
import { useState } from 'react'

import { RelationShort } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

import ObjectConnectionModal from '../DynamicObjectForm/ObjectModals/ObjectConnectionModal'
import { ObjectModalActions } from '../DynamicObjectForm/ObjectModals/types'
import ObjectRelationPart from '../ObjectRelationPart'

interface ObjectRelationsProps {
    model: Model
    relations?: RelationShort[]
}

const ObjectRelations = ({ model, relations }: ObjectRelationsProps) => {
    const [modal, setModal] = useState<ObjectModalActions>({
        isOpen: false,
        initialStep: 1,
    })

    return (
        <>
            <div className="flex justify-between items-center mt-12">
                <Heading level="3">Koppelingen</Heading>
                <Button
                    size="small"
                    variant="secondary"
                    onPress={() =>
                        setModal({
                            isOpen: true,
                            isEdit: false,
                            action: 'addConnection',
                            relation: undefined,
                        })
                    }>
                    Nieuwe koppeling
                </Button>
            </div>

            {!!relations?.length ? (
                <div>
                    {relations.map(relation => (
                        <ObjectRelationPart
                            handleEdit={() =>
                                setModal({
                                    action: 'addConnection',
                                    relation,
                                    initialStep: 3,
                                    isOpen: true,
                                    isEdit: true,
                                })
                            }
                            {...relation}
                        />
                    ))}
                </div>
            ) : (
                <span className="italic">Er zijn nog geen koppelingen.</span>
            )}

            <ObjectConnectionModal
                key={modal.initialStep}
                onClose={() => setModal({ ...modal, isOpen: false })}
                initialStep={model?.allowedConnections?.length === 1 ? 2 : 1}
                initialValues={
                    modal.relation ||
                    (model?.allowedConnections?.length === 1 &&
                        ({
                            Object_Type: model.allowedConnections[0],
                        } as RelationShort)) ||
                    undefined
                }
                allowedConnections={model.allowedConnections}
                {...modal}
            />
        </>
    )
}

export default ObjectRelations
