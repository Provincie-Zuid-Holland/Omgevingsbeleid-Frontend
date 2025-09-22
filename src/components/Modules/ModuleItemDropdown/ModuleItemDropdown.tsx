import { ModuleObjectShort } from '@/api/fetchers.schemas'
import Dropdown, { DropdownItem } from '@/components/Dropdown'
import { Model } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import { cn } from '@pzh-ui/components'
import { EllipsisVertical } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'

interface ModuleItemDropdownProps extends ModuleObjectShort {
    /** Model */
    model: Model
    /** Has edit button */
    hasEditButton?: boolean
    /** Has view button */
    hasViewButton?: boolean
    invertHover?: boolean
}

const ModuleItemDropdown = ({
    model,
    ObjectStatics,
    Module_ID,
    ModuleObjectContext,
    hasEditButton,
    Object_Type,
    Object_ID,
    UUID,
    Title,
    invertHover,
}: ModuleItemDropdownProps) => {
    const { user } = useAuth()
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const {
        canEditModule,
        canPatchObjectInModule,
        canEditModuleObjectContext,
        canRemoveObjectFromModule,
    } = usePermissions()
    const [isOpen, setIsOpen] = useState(false)

    const { data, isModuleManager, isLocked, isActive } = useModule()

    const { slugOverview, plural } = model.defaults

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
                link: `/muteer/${plural}/${Object_ID}`,
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
                    callback: () =>
                        setActiveModal('moduleEditObject', {
                            object: {
                                Object_Type,
                                Object_ID,
                                Title,
                                Module_ID,
                                ModuleObjectContext,
                            },
                        }),
                },
            ]) ||
            []),
        {
            text: 'Bekijk in raadpleegomgeving',
            callback: () =>
                window
                    .open(
                        `/${slugOverview}/${plural}/ontwerpversie/${Module_ID}/${UUID}`,
                        '_blank'
                    )
                    ?.focus(),
        },
        ...(((canRemoveObjectFromModule || isModuleManager) &&
            !isLocked && [
                {
                    text: 'Verwijderen uit module',
                    callback: () =>
                        setActiveModal('moduleDeleteObject', {
                            object: { Object_Type, Object_ID, Title },
                            module: {
                                Title: String(data?.Module.Title),
                                Module_ID: Number(data?.Module.Module_ID),
                            },
                        }),
                },
            ]) ||
            []),
    ]

    return !!dropdownItems.length ? (
        <div className="relative">
            <button
                className={cn(
                    'hover:bg-pzh-gray-100 flex h-8 w-8 items-center justify-center rounded-full',
                    {
                        'hover:bg-pzh-gray-200': invertHover,
                    }
                )}
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
    )
}

export default ModuleItemDropdown
