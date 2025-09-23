import { Divider, Hyperlink, Text } from '@pzh-ui/components'
import { CircleInfo } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { ModuleObjectShort } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import { getObjectActionText } from '@/utils/dynamicObject'
import ModuleItemDropdown from '../ModuleItemDropdown'

interface ModuleItemProps extends ModuleObjectShort {
    /** Model */
    model: Model
    /** Has edit button */
    hasEditButton?: boolean
    /** Has view button */
    hasViewButton?: boolean
}

const ModuleItem = ({
    model,
    Object_ID,
    Object_Type,
    Module_ID,
    ModuleObjectContext,
    Title,
    ObjectStatics,
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
            ObjectStatics?.Owner_1_UUID === user?.UUID ||
            ObjectStatics?.Owner_2_UUID === user?.UUID
        )
            return true

        return false
    }, [
        canEditModule,
        isModuleManager,
        ObjectStatics?.Owner_1_UUID,
        ObjectStatics?.Owner_2_UUID,
        user?.UUID,
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
                            <Text size="s" className="text-pzh-gray-600 mr-1">
                                {getObjectActionText(
                                    ModuleObjectContext?.Action
                                )}
                            </Text>
                            <CircleInfo className="text-pzh-gray-600" />
                        </div>
                    </div>
                    <Text className="truncate">{Title}</Text>
                    {hasEditButton &&
                        ModuleObjectContext?.Action !== 'Terminate' &&
                        hasRights &&
                        canPatchObjectInModule &&
                        !isLocked &&
                        isActive && (
                            <Hyperlink asChild>
                                <Link
                                    to={`/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}/bewerk`}>
                                    Bewerk onderdeel
                                </Link>
                            </Hyperlink>
                        )}
                    {hasViewButton && !hasRights && (
                        <Hyperlink asChild>
                            <Link
                                to={`/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}`}>
                                Bekijk detailpagina
                            </Link>
                        </Hyperlink>
                    )}
                </div>
                <ModuleItemDropdown
                    model={model}
                    Module_ID={Module_ID}
                    Object_Type={Object_Type}
                    Object_ID={Object_ID}
                    Title={Title}
                    {...rest}
                />
            </div>
        </div>
    )
}

export default ModuleItem
