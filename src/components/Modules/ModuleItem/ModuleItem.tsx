import { Divider, Hyperlink, Text } from '@pzh-ui/components'
import { CircleInfo, EllipsisVertical } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'

import { ModuleObjectShort } from '@/api/fetchers.schemas'
import Dropdown, { DropdownItem } from '@/components/Dropdown'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import getObjectActionText from '@/utils/getObjectActionText'

interface ModuleItemProps extends ModuleObjectShort {
    /** Has edit button */
    hasEditButton?: boolean
    /** Function which gets called on edit click */
    editCallback: () => void
    /** Function which gets called on delete click */
    deleteCallback: () => void
    /** Function which gets called on view click */
    viewCallback: () => void
}

const ModuleItem = ({
    Object_ID,
    Object_Type,
    Module_ID,
    ModuleObjectContext,
    Title,
    ObjectStatics,
    hasEditButton,
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

    const { isModuleManager, isLocked } = useModule()

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
            !isLocked && [
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
        <div>
            <Divider />
            <div className="flex justify-between items-center">
                <div className="flex-1 pr-2 w-[90%]">
                    <div className="flex justify-between">
                        <Text
                            type="body-small"
                            className="text-pzh-gray-600 capitalize">
                            {Object_Type}
                        </Text>
                        <div className="flex items-center">
                            <Text
                                type="body-small"
                                className="mr-1 text-pzh-gray-600">
                                {getObjectActionText(
                                    ModuleObjectContext?.Action
                                )}
                            </Text>
                            <CircleInfo className="-mt-1 text-pzh-gray-600" />
                        </div>
                    </div>
                    <Text type="body" className="truncate">
                        {Title}
                    </Text>
                    {hasEditButton &&
                        ModuleObjectContext?.Action !== 'Terminate' && (
                            <Hyperlink
                                to={`/muteer/modules/${Module_ID}/${Object_Type}/${Object_ID}`}
                                text="Bewerken"
                            />
                        )}
                </div>
                {!!dropdownItems.length ? (
                    <div className="relative">
                        <button
                            className="flex items-center justify-center w-6 h-6 hover:bg-pzh-gray-100 rounded-full"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Onderdeel menu">
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
