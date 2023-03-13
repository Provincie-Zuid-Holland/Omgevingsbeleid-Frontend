import { Button, getHeadingStyles, Text } from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMedia } from 'react-use'

import { useModulesModuleIdGet } from '@/api/fetchers'
import useModules from '@/hooks/useModules'
import * as modules from '@/validation/modules'

import ModuleContentsModal from '../ModuleModals/ModuleContentsModal'
import ModuleObjectSearch from '../ModuleObjectSearch'
import ModulePart from '../ModulePart'

const FormContents = () => {
    const { id } = useParams()

    const isMobile = useMedia('(max-width: 640px)')
    const [openModal, setOpenModal] = useState(false)

    const { data: { Objects: objects } = {} } = useModulesModuleIdGet(
        parseInt(id!),
        {
            query: { enabled: !!id },
        }
    )

    const newObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.Action === 'Toevoegen' || object.Action === 'Create'
            ),
        [objects]
    )

    const existingObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.Action !== 'Toevoegen' && object.Action !== 'Create'
            ),
        [objects]
    )

    const { useRemoveObjectFromModule } = useModules()
    const { mutate } = useRemoveObjectFromModule(parseInt(id!))

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
                <ModuleObjectSearch />

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

                    <Button className="mt-4" onPress={() => setOpenModal(true)}>
                        Nieuw onderdeel toevoegen
                    </Button>
                </div>
            </div>

            <ModuleContentsModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                initialStep={2}
                initialValues={{ ...modules.EMPTY_MODULE_OBJECT, state: 'new' }}
            />
        </>
    )
}

export default FormContents
