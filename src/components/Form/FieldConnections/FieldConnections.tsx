import { useCallback, useState } from 'react'

import { FieldLabel } from '@pzh-ui/components'

import { useFormikContext } from 'formik'

import { ReadRelation, WriteRelation } from '@/api/fetchers.schemas'
import ObjectConnectionPart from '@/components/DynamicObject/ObjectConnectionPart'
import { ConnectionModal } from '@/components/Modals/ObjectModals/ObjectConnectionModal/ObjectConnectionModal'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import useModalStore from '@/store/modalStore'

const FieldConnections = ({
    name,
    label,
    description,
    required,
    allowedConnections,
    model,
}: Omit<Extract<DynamicField, { type: 'connections' }>, 'type'> & {
    model: Model
}) => {
    const { values, setFieldValue } = useFormikContext<
        ModelReturnType & { connections?: ReadRelation[] }
    >()
    const value = values['connections']

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [modal, setModal] = useState<ObjectConnectionModalActions>({
        initialStep: 1,
        initialValues: {} as ReadRelation,
        connectionModel: {} as Model,
    })

    /**
     * Get connections of Object_Type
     */
    const getConnections = useCallback(
        (type: ModelType) =>
            value?.filter(relation => relation.object_type === type),
        [value]
    )

    const handleSubmit = (
        payload: WriteRelation | { items?: { value: number; label: string }[] }
    ) => {
        let newData = value || []

        if (!('items' in payload)) {
            if (!('object_id' in payload)) return

            const isExisting = newData.find(
                item =>
                    item.object_id === payload?.object_id &&
                    item.object_type === payload?.object_type
            )

            if (isExisting) {
                isExisting.description = payload?.description || ''
            } else {
                if (payload?.object_id && payload.object_type) {
                    newData.push(payload)
                }
            }
        } else {
            newData = [
                ...newData.filter(
                    e =>
                        e.object_type !==
                        modal.connectionModel?.defaults?.singular
                ),
                ...(payload.items?.map(item => ({
                    object_type: modal.connectionModel?.defaults?.singular,
                    object_id: item.value,
                    ...item,
                })) || []),
            ]
        }

        setFieldValue('connections', newData)
        setActiveModal(null)
    }

    const handleDelete = (connection: WriteRelation) => {
        value?.splice(
            value.findIndex(
                item =>
                    item.object_id === connection.object_id &&
                    item.object_type === connection.object_type
            ),
            1
        )

        setFieldValue('connections', value)
        setActiveModal(null)
    }

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            <div className="mt-4">
                {allowedConnections?.map(connection => (
                    <ObjectConnectionPart
                        key={connection.type}
                        model={models[connection.type]}
                        setModal={setModal}
                        connections={getConnections(connection.type)}
                        canEdit
                    />
                ))}
            </div>

            <ConnectionModal
                model={model}
                {...(modal as ObjectConnectionModalActions)}
                handleDeleteConnection={handleDelete}
                handleFormSubmit={handleSubmit}
                relations={value}
                data={{
                    title: values.title || 'Naamloos',
                }}
            />
        </>
    )
}

export default FieldConnections
