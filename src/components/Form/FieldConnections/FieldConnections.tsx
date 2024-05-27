import { FieldLabel } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useCallback, useState } from 'react'

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
            value?.filter(relation => relation.Object_Type === type),
        [value]
    )

    const handleSubmit = (
        payload:
            | WriteRelation
            | { items?: { Object_ID: number; Title: string }[] }
    ) => {
        let newData = value || []

        if (!('items' in payload)) {
            if (!('Object_ID' in payload)) return

            const isExisting = newData.find(
                item =>
                    item.Object_ID === payload?.Object_ID &&
                    item.Object_Type === payload?.Object_Type
            )

            if (isExisting) {
                isExisting.Description = payload?.Description || ''
            } else {
                if (payload?.Object_ID && payload.Object_Type) {
                    newData.push(payload)
                }
            }
        } else {
            newData = [
                ...newData.filter(
                    e =>
                        e.Object_Type !==
                        modal.connectionModel?.defaults?.singular
                ),
                ...(payload.items?.map(item => ({
                    Object_Type: modal.connectionModel?.defaults?.singular,
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
                    item.Object_ID === connection.Object_ID &&
                    item.Object_Type === connection.Object_Type
            ),
            1
        )

        setFieldValue('connections', value)
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
                    Title: values.Title || 'Naamloos',
                }}
            />
        </>
    )
}

export default FieldConnections
