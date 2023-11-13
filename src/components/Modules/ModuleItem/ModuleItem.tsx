import { Divider, Hyperlink, Text } from '@pzh-ui/components'
import { CircleInfo, EllipsisVertical } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'

import { ModuleObjectShort } from '@/api/fetchers.schemas'
import Dropdown, { DropdownItem } from '@/components/Dropdown'
import { Model } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import { getObjectActionText } from '@/utils/dynamicObject'

interface ModuleItemProps extends ModuleObjectShort {
    /** Model */
    model: Model
    /** Has edit button */
    hasEditButton?: boolean
    /** Has view button */
    hasViewButton?: boolean
    /** Function which gets called on edit click */
    editCallback: () => void
    /** Function which gets called on delete click */
    deleteCallback: () => void
    /** Function which gets called on view click */
    viewCallback: () => void
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
    editCallback,
    deleteCallback,
    viewCallback,
}: ModuleItemProps) => {
    const { user } = useAuth()
    const {
        canEditModule,
        canPatchObjectInModule,
        canEditModuleObjectContext,
        canRemoveObjectFromModule,
    } = usePermissions()
    const [isOpen, setIsOpen] = useState(false)

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

    /**
     * Array of dropdown items based on user rights
     */
    const dropdownItems: DropdownItem[] = [
        ...((hasRights && [
            {
                text: 'Bekijken',
                link: `/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}`,
            },
        ]) ||
            []),
        ...((ModuleObjectContext?.Action !== 'Terminate' &&
            hasRights &&
            canPatchObjectInModule &&
            !isLocked &&
            isActive &&
            !hasEditButton && [
                {
                    text: 'Bewerken',
                    link: `/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}/bewerk`,
                },
            ]) ||
            []),
        ...((hasRights &&
            canEditModuleObjectContext &&
            !isLocked && [
                {
                    text: `Bewerk ${
                        ModuleObjectContext?.Action !== 'Create' &&
                        ModuleObjectContext?.Action !== 'Toevoegen'
                            ? 'actie, '
                            : ' '
                    }toelichting en conclusie`,
                    callback: editCallback,
                },
            ]) ||
            []),
        {
            text: 'Bekijk in raadpleegomgeving',
            callback: viewCallback,
        },
        ...(((canRemoveObjectFromModule || isModuleManager) &&
            !isLocked && [
                {
                    text: 'Verwijderen uit module',
                    callback: deleteCallback,
                },
            ]) ||
            []),
    ]

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
                                    ModuleObjectContext?.Action
                                )}
                            </Text>
                            <CircleInfo className="-mt-1 text-pzh-gray-600" />
                        </div>
                    </div>
                    <Text className="truncate">{Title}</Text>
                    {hasEditButton &&
                        ModuleObjectContext?.Action !== 'Terminate' &&
                        hasRights &&
                        canPatchObjectInModule &&
                        !isLocked &&
                        isActive && (
                            <Hyperlink
                                to={`/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}/bewerk`}
                                text="Bewerken"
                            />
                        )}
                        {hasViewButton && (
                            <Hyperlink
                                to={`/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}`}
                                text="Bekijken"
                            />
                        )}
                </div>
                {!!dropdownItems.length ? (
                    <div className="relative">
                        <button
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-pzh-gray-100"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Onderdeel menu"
                            data-testid="module-item-menu">
                            <EllipsisVertical />
                        </button>
                        <Dropdown
                            items={dropdownItems}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            className="-right-1 mt-8"
                        />
                    </div>
                ) : (
                    <div className="w-6" />
                )}
            </div>
        </div>
    )
}

export default ModuleItem
