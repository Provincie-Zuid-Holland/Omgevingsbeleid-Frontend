import { Text } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import { ModuleModalActions } from '@/components/Modals/ModuleModals/types'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'

import ModuleItem from '../ModuleItem'

interface ModuleItemListProps {
    /** Array of objects */
    objects?: ModuleObjectShort[]
    /** Current model object */
    module?: Module
    /** Set module modal state */
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleItemList = ({ objects, ...rest }: ModuleItemListProps) => {
    const { user } = useAuth()
    const { canEditModule, canPatchObjectInModule } = usePermissions()
    const { isModuleManager } = useModule()

    /**
     * If user has no edit rights
     * show objects of the user
     */
    const userObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.Owner_1_UUID === user?.UUID ||
                    object.Owner_2_UUID === user?.UUID
            ),
        [objects, user?.UUID]
    )

    /**
     * If user has no edit rights
     * show objects of the user
     */
    const otherObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.Owner_1_UUID !== user?.UUID &&
                    object.Owner_2_UUID !== user?.UUID
            ),
        [objects, user?.UUID]
    )

    /**
     * If user has no edit rights show different layout
     */
    if (!canEditModule && !isModuleManager) {
        return (
            <>
                <ItemList
                    objects={userObjects}
                    title="Jouw onderdelen in deze module"
                    noResultsText="Je hebt nog geen onderdelen in deze module"
                    hasEditButton={canPatchObjectInModule}
                    {...rest}
                />

                <div className="mt-6">
                    <ItemList
                        objects={otherObjects}
                        title="Andere onderdelen in deze module"
                        noResultsText="Er zijn geen andere onderdelen in deze module"
                        {...rest}
                    />
                </div>
            </>
        )
    }

    return (
        <ItemList
            objects={objects}
            title="Alle onderdelen in deze module"
            noResultsText="Er zijn nog geen onderdelen toegevoegd aan deze module"
            {...rest}
        />
    )
}

interface ItemListProps extends ModuleItemListProps {
    /** Title of list */
    title: string
    /** Title if there are no results */
    noResultsText: string
    /** Has edit button */
    hasEditButton?: boolean
}

const ItemList = ({
    objects,
    setModuleModal,
    module,
    title,
    noResultsText,
    hasEditButton,
}: ItemListProps) => {
    const navigate = useNavigate()

    return (
        <>
            <Text type="body" className="font-bold text-pzh-blue">
                {title}
            </Text>
            {!!objects?.length ? (
                <div className="mb-4">
                    {objects.map(object => {
                        const model =
                            models[
                                object.Object_Type.toLowerCase() as ModelType
                            ]
                        const { plural } = model?.defaults || {}

                        return (
                            <ModuleItem
                                key={object.UUID}
                                editCallback={() =>
                                    setModuleModal({
                                        object,
                                        action: 'editObject',
                                        isOpen: true,
                                    })
                                }
                                deleteCallback={() =>
                                    setModuleModal({
                                        object,
                                        module,
                                        action: 'deleteObject',
                                        isOpen: true,
                                    })
                                }
                                viewCallback={() =>
                                    navigate(`/${plural}/${object.UUID}`)
                                }
                                hasEditButton={hasEditButton}
                                {...object}
                            />
                        )
                    })}
                </div>
            ) : (
                <p className="italic mb-4">{noResultsText}</p>
            )}
        </>
    )
}

export default ModuleItemList
