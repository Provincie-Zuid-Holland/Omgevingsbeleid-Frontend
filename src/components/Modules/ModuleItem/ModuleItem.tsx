import { useMemo } from 'react'

import { Divider, Hyperlink, Text } from '@pzh-ui/components'
import { CircleInfo } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import { Model, ModelReturnTypeBasic } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import { getObjectActionText } from '@/utils/dynamicObject'

import ModuleItemDropdown from '../ModuleItemDropdown'

interface ModuleItemProps extends ModelReturnTypeBasic {
    /** Model */
    objectConfig: Model
    /** Has edit button */
    hasEditButton?: boolean
    /** Has view button */
    hasViewButton?: boolean
}

const ModuleItem = ({
    objectConfig: model,
    model: _model,
    object_type,
    module_id,
    module_object_context: ModuleObjectContext,
    object_statics: ObjectStatics,
    hasEditButton,
    hasViewButton,
    ...rest
}: ModuleItemProps) => {
    const { user } = useAuth()
    const { canEditModule, canPatchObjectInModule } = usePermissions()

    const { isModuleManager, isLocked, isActive } = useModule()

    const { singularCapitalize } = model.defaults

    /**
     * Check if user has owner rights in object
     */
    const hasRights = useMemo(() => {
        if (
            canEditModule ||
            isModuleManager ||
            ObjectStatics?.owner_1_id === user?.id ||
            ObjectStatics?.owner_2_id === user?.id ||
            ObjectStatics?.owner_3_id === user?.id
        )
            return true

        return false
    }, [
        canEditModule,
        isModuleManager,
        ObjectStatics?.owner_1_id,
        ObjectStatics?.owner_2_id,
        ObjectStatics?.owner_3_id,
        user?.id,
    ])

    return (
        <div data-test="module-item">
            <Divider />
            <div className="flex items-center justify-between">
                <div className="w-[90%] flex-1 pr-2">
                    <div className="flex justify-between">
                        <Text size="s" className="text-pzh-gray-600">
                            {singularCapitalize}
                        </Text>
                        <div className="flex items-center">
                            <Text size="s" className="mr-1 text-pzh-gray-600">
                                {getObjectActionText(
                                    ModuleObjectContext?.action
                                )}
                            </Text>
                            <CircleInfo className="text-pzh-gray-600" />
                        </div>
                    </div>
                    <Text className="truncate">{_model.title}</Text>
                    {hasEditButton &&
                        ModuleObjectContext?.action !== 'Terminate' &&
                        hasRights &&
                        canPatchObjectInModule &&
                        !isLocked &&
                        isActive && (
                            <Hyperlink asChild>
                                <Link
                                    to={`/muteer/modules/${module_id}/${object_type}/${_model.object_id}/bewerk`}>
                                    Bewerk onderdeel
                                </Link>
                            </Hyperlink>
                        )}
                    {hasViewButton && !hasRights && (
                        <Hyperlink asChild>
                            <Link
                                to={`/muteer/modules/${module_id}/${object_type}/${_model.object_id}`}>
                                Bekijk detailpagina
                            </Link>
                        </Hyperlink>
                    )}
                </div>
                <ModuleItemDropdown
                    objectConfig={model}
                    module_id={module_id}
                    object_type={object_type}
                    object_statics={ObjectStatics}
                    module_object_context={ModuleObjectContext}
                    model={_model}
                    {...rest}
                />
            </div>
        </div>
    )
}

export default ModuleItem
