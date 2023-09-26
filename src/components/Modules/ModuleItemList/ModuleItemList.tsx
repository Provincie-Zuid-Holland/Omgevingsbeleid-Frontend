import { useMemo } from 'react'

import { Text } from '@pzh-ui/components'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import { ModuleContext } from '@/pages/protected/Modules/ModuleDetail'
import useModalStore from '@/store/modalStore'

import ModuleItem from '../ModuleItem'

interface ModuleItemListProps {
    /** Array of objects */
    objects?: ModuleObjectShort[]
    /** Current model object */
    module?: Module
    /** Set module context */
    setModuleContext: (e: ModuleContext) => void
}

const ModuleItemList = ({ objects, ...rest }: ModuleItemListProps) => {
    const { user } = useAuth()
    const { canEditModule, canPatchObjectInModule } = usePermissions()
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
                    object.ObjectStatics?.Owner_2_UUID === user?.UUID
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
    setModuleContext,
    module,
    title,
    noResultsText,
    hasEditButton,
}: ItemListProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <>
            <Text bold color="text-pzh-blue">
                {title}
            </Text>
            {!!objects?.length ? (
                <div className="mb-4">
                    {objects.map(object => {
                        const model =
                            models[
                                object.Object_Type.toLowerCase() as ModelType
                            ]
                        const { slugOverview } = model?.defaults || {}

                        return (
                            <ModuleItem
                                key={object.UUID}
                                editCallback={() => {
                                    setModuleContext({
                                        object,
                                    })
                                    setActiveModal('moduleEditObject')
                                }}
                                deleteCallback={() => {
                                    setModuleContext({
                                        object,
                                        module,
                                    })
                                    setActiveModal('moduleDeleteObject')
                                }}
                                viewCallback={() =>
                                    window
                                        .open(
                                            `/${slugOverview}/ontwerpversie/${module?.Module_ID}/${object.UUID}`,
                                            '_blank'
                                        )
                                        ?.focus()
                                }
                                hasEditButton={hasEditButton}
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
