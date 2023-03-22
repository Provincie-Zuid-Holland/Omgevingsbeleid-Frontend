import { Button, FieldLabel, Heading, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'

import { RelationShort, SearchObject } from '@/api/fetchers.schemas'
import ObjectRelationPart from '@/components/DynamicObject/ObjectRelationPart/ObjectRelationPart'
import { DynamicConnections } from '@/config/objects/types'

import ObjectConnectionModal from '../../ObjectModals/ObjectConnectionModal'
import { ObjectModalActions } from '../../ObjectModals/types'

interface SectionConnectionsProps {
    section: DynamicConnections
}

const SectionConnections = ({ section }: SectionConnectionsProps) => {
    const { values } = useFormikContext<{
        relations?: (RelationShort & SearchObject)[]
    }>()

    const [modal, setModal] = useState<ObjectModalActions>({
        isOpen: false,
        initialStep: 1,
    })

    const relationItems = useMemo(() => values.relations, [values.relations])

    return (
        <>
            <div className="col-span-2">
                <Heading level="3" className="mb-3">
                    Koppelingen
                </Heading>
                <Text type="body">{section.description}</Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <FieldLabel
                    name="relations"
                    label="Koppelingen"
                    description={section.fieldDescription}
                />

                {!!relationItems?.length && (
                    <div className="mb-4">
                        {relationItems.map((relation, index) => (
                            <ObjectRelationPart
                                key={relation.ID + relation.Object_Type}
                                handleEdit={() =>
                                    setModal({
                                        action: 'addConnection',
                                        relation,
                                        initialStep: 3,
                                        isOpen: true,
                                        isEdit: true,
                                    })
                                }
                                isLast={relationItems.length === index + 1}
                                {...relation}
                            />
                        ))}
                    </div>
                )}

                <Button
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

            <ObjectConnectionModal
                key={modal.initialStep}
                onClose={() => setModal({ ...modal, isOpen: false })}
                initialValues={
                    modal.relation ||
                    (section.allowedConnections.length === 1 &&
                        ({
                            Object_Type: section.allowedConnections[0],
                        } as RelationShort)) ||
                    undefined
                }
                {...modal}
            />
        </>
    )
}

export default SectionConnections
