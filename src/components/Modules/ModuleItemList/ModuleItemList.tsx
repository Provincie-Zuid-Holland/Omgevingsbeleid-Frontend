import { Button, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

import ModuleItem from '../ModuleItem'

interface ModuleItemListProps {
    /** Array of objects */
    objects?: ModuleObjectShort[]
    /** Current model object */
    module?: Module
}

const ModuleItemList = ({ objects, ...rest }: ModuleItemListProps) => {
    const { user } = useAuth()
    const { canEditModule, canPatchObjectInModule, canAddNewObjectToModule } =
        usePermissions()
    const { isLocked } = useModule()

    /**
     * If user has no edit rights
     * show objects of the user
     */
    const userObjects = useMemo(
        () =>
            objects?.filter(
                object =>
                    object.ObjectStatics?.Owner_1_UUID === user?.UUID ||
                    object.ObjectStatics?.Owner_2_UUID === user?.UUID ||
                    object.ObjectStatics?.Client_1_UUID === user?.UUID
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
                    object.ObjectStatics?.Owner_1_UUID !== user?.UUID &&
                    object.ObjectStatics?.Owner_2_UUID !== user?.UUID
            ),
        [objects, user?.UUID]
    )

    /**
     * If user has no edit rights show different layout
     */
    if (!canEditModule) {
        return (
            <>
                <ItemList
                    objects={userObjects}
                    title="Jouw onderdelen in deze module"
                    noResultsText="Je hebt nog geen onderdelen in deze module"
                    hasEditButton={canPatchObjectInModule && !isLocked}
                    hasViewButton={
                        canPatchObjectInModule && !canAddNewObjectToModule
                    }
                    hasAddButton
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
            hasAddButton
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
    /** Has view button */
    hasViewButton?: boolean
    /** Has add object button */
    hasAddButton?: boolean
}

const ItemList = ({
    objects,
    module,
    title,
    noResultsText,
    hasEditButton,
    hasViewButton,
    hasAddButton,
}: ItemListProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const { isLocked } = useModule()
    const { canAddExistingObjectToModule, canAddNewObjectToModule } =
        usePermissions()

    return (
        <>
            <div className="flex items-center justify-between">
                <Text bold color="text-pzh-blue-500">
                    {title}
                </Text>
                {(canAddExistingObjectToModule || canAddNewObjectToModule) &&
                    !isLocked &&
                    hasAddButton && (
                        <Button
                            variant="link"
                            onPress={() => setActiveModal('moduleAddObject')}
                            className="block text-pzh-green hover:text-pzh-green-dark">
                            Onderdeel toevoegen
                        </Button>
                    )}
            </div>

            {!!objects?.length ? (
                <div className="mb-4">
                    {objects.map(object => {
                        const model =
                            models[
                                object.Object_Type.toLowerCase() as ModelType
                            ]
                        const { slugOverview, plural } = model?.defaults || {}

                        return (
                            <ModuleItem
                                key={object.UUID}
                                editCallback={() =>
                                    setActiveModal('moduleEditObject', {
                                        object,
                                    })
                                }
                                deleteCallback={() =>
                                    setActiveModal('moduleDeleteObject', {
                                        object,
                                        module,
                                    })
                                }
                                viewCallback={() =>
                                    window
                                        .open(
                                            `/${slugOverview}/${plural}/ontwerpversie/${module?.Module_ID}/${object.UUID}`,
                                            '_blank'
                                        )
                                        ?.focus()
                                }
                                hasEditButton={hasEditButton}
                                hasViewButton={hasViewButton}
                                model={model}
                                {...object}
                            />
                        )
                    })}
                </div>
            ) : (
                <p className="mb-4 italic">{noResultsText}</p>
            )}
        </>
    )
}

export default ModuleItemList
