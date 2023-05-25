import { Button, getHeadingStyles, Text } from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useModulesModuleIdGet } from '@/api/fetchers'
import { SearchObject } from '@/api/fetchers.schemas'
import useBreakpoint from '@/hooks/useBreakpoint'
import useModule from '@/hooks/useModule'
import * as modules from '@/validation/modules'

import DynamicObjectSearch from '../../DynamicObject/DynamicObjectSearch'
import ModuleContentsModal from '../../Modals/ModuleModals/ModuleContentsModal'
import { ContentsModalForm } from '../../Modals/ModuleModals/ModuleContentsModal/ModuleContentsModal'
import ModulePart from '../ModulePart'

interface ModalProps {
    /** Is modal open */
    isOpen: boolean
    /** Initial step of contents wizard */
    initialStep: number
    /** Initial values of contents form */
    initialValues: ContentsModalForm
    /** Object which gets selected after search */
    selectedObject?: SearchObject
}

const initialModalValues: ModalProps = {
    isOpen: false,
    initialStep: 2,
    initialValues: { ...modules.EMPTY_MODULE_OBJECT, state: 'new' },
}

const FormContents = () => {
    const { moduleId } = useParams()

    const { isMobile } = useBreakpoint()

    const [modal, setModal] = useState<ModalProps>(initialModalValues)

    const { data: { Objects: objects, Module: module } = {} } =
        useModulesModuleIdGet(parseInt(moduleId!), {
            query: { enabled: !!moduleId },
        })

    const newObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.ModuleObjectContext?.Action === 'Toevoegen' ||
                    object.ModuleObjectContext?.Action === 'Create'
            ),
        [objects]
    )

    const existingObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.ModuleObjectContext?.Action !== 'Toevoegen' &&
                    object.ModuleObjectContext?.Action !== 'Create'
            ),
        [objects]
    )

    const { useRemoveObjectFromModule } = useModule()
    const { mutate } = useRemoveObjectFromModule()

    return (
        <>
            <div className="col-span-2">
                <h2 style={getHeadingStyles('3', isMobile)} className="mb-3">
                    Inhoud module
                </h2>
                <Text type="body">
                    Geef aan welke onderdelen van het omgevingsbeleid worden
                    aangepast, verwijderd of toegevoegd in deze module
                </Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <DynamicObjectSearch
                    onChange={object =>
                        setModal({
                            ...modal,
                            initialStep: 5,
                            isOpen: true,
                            initialValues: {
                                ...modules.EMPTY_MODULE_OBJECT,
                                state: 'existing',
                                Object_UUID: object?.UUID,
                            },
                            selectedObject: object,
                        })
                    }
                />

                {!!existingObjects?.length && (
                    <div className="mt-4">
                        {existingObjects.map((object, index) => (
                            <ModulePart
                                key={object.UUID}
                                isLast={existingObjects.length === index + 1}
                                handleRemove={() =>
                                    mutate({
                                        moduleId: object.Module_ID,
                                        objectType: object.Object_Type,
                                        lineageId: object.Object_ID,
                                    })
                                }
                                {...object}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <Text type="body" className="font-bold">
                        Nieuwe onderdelen in deze module
                    </Text>
                    {!!newObjects?.length ? (
                        <div className="mt-2">
                            {newObjects.map((object, index) => (
                                <ModulePart
                                    key={object.UUID}
                                    isLast={newObjects.length === index + 1}
                                    handleRemove={() =>
                                        mutate({
                                            moduleId: object.Module_ID,
                                            objectType: object.Object_Type,
                                            lineageId: object.Object_ID,
                                        })
                                    }
                                    {...object}
                                />
                            ))}
                        </div>
                    ) : (
                        <Text
                            type="body-small"
                            className="mt-2 text-pzh-gray-600">
                            Er zijn nog geen nieuwe onderdelen toegevoegd
                        </Text>
                    )}

                    <Button
                        className="mt-4"
                        onPress={() =>
                            setModal({ ...initialModalValues, isOpen: true })
                        }>
                        Nieuw onderdeel toevoegen
                    </Button>
                </div>
            </div>

            <ModuleContentsModal
                key={modal.initialValues.state}
                onClose={() => setModal({ ...modal, isOpen: false })}
                module={module}
                {...modal}
            />
        </>
    )
}

export default FormContents
