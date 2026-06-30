import { getStorageFileGetFilesDownloadQueryKey } from '@/api/fetchers'
import Dropdown, { DropdownItem } from '@/components/Dropdown'
import { Model, ModelReturnTypeBasic } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'
import { cn } from '@pzh-ui/components'
import { EllipsisVertical } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { memo, useCallback, useMemo, useState } from 'react'

interface ModuleItemDropdownProps extends ModelReturnTypeBasic {
    model: Model
    hasEditButton?: boolean
    hasViewButton?: boolean
    invertHover?: boolean
}

const ModuleItemDropdown = ({
    model,
    ObjectStatics,
    Module_ID,
    ModuleObjectContext,
    Module_Latest_Status,
    hasEditButton,
    Object_Type,
    Model,
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

    const { data, isModuleManager, isLocked, isActive } = useModule()
    const [isOpen, setIsOpen] = useState(false)

    const { slugOverview, plural, slugOverviewPublic, disabled } =
        model.defaults

    const fileUuid =
        Object_Type === 'document' && 'File_UUID' in Model
            ? String(Model.File_UUID || '')
            : ''

    const hasRights = useMemo(
        () =>
            canEditModule ||
            isModuleManager ||
            ObjectStatics?.Owner_1_UUID === user?.UUID ||
            ObjectStatics?.Owner_2_UUID === user?.UUID,
        [
            canEditModule,
            isModuleManager,
            ObjectStatics?.Owner_1_UUID,
            ObjectStatics?.Owner_2_UUID,
            user?.UUID,
        ]
    )

    const downloadDocument = useQuery({
        queryKey: ['downloadStorageFile', fileUuid],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(fileUuid)[0],
                undefined,
                true
            ),
        enabled: false,
    })

    const openEditObjectModal = useCallback(() => {
        setActiveModal('moduleEditObject', {
            object: {
                Object_Type,
                Model,
                Module_ID,
                ModuleObjectContext,
                Module_Latest_Status,
                ObjectStatics,
            },
        })
    }, [
        setActiveModal,
        Object_Type,
        Model,
        Module_ID,
        ModuleObjectContext,
        Module_Latest_Status,
        ObjectStatics,
    ])

    const openDeleteObjectModal = useCallback(() => {
        setActiveModal('moduleDeleteObject', {
            object: {
                Object_Type,
                Model,
                Module_ID,
                ModuleObjectContext,
                Module_Latest_Status,
                ObjectStatics,
            },
            module: {
                Title: String(data?.Module.Title),
                Module_ID: Number(data?.Module.Module_ID),
            },
        })
    }, [
        setActiveModal,
        Object_Type,
        Model,
        Module_ID,
        ModuleObjectContext,
        Module_Latest_Status,
        ObjectStatics,
        data?.Module.Title,
        data?.Module.Module_ID,
    ])

    const refetchDocument = useCallback(() => {
        downloadDocument.refetch()
    }, [downloadDocument])

    const dropdownItems = useMemo<DropdownItem[]>(() => {
        const items: DropdownItem[] = []

        if (hasRights) {
            items.push({
                text: 'Bekijk detailpagina',
                link: `/muteer/${plural}/${Model.Object_ID}`,
            })
        }

        if (fileUuid) {
            items.push({
                text: 'Bekijk document',
                isExternal: true,
                callback: refetchDocument,
            })
        } else if (slugOverviewPublic) {
            items.push({
                text: 'Bekijk voorbeeld',
                isExternal: true,
                link: `/${slugOverview}/${plural}/ontwerpversie/${Module_ID}/${Model.UUID}`,
            })
        }

        if (
            ModuleObjectContext?.Action !== 'Terminate' &&
            hasRights &&
            canPatchObjectInModule &&
            !isLocked &&
            isActive &&
            !hasEditButton &&
            !disabled
        ) {
            items.push({
                text: 'Bewerk onderdeel',
                link: `/muteer/modules/${Module_ID}/${Object_Type}/${Model.Object_ID}/bewerk`,
            })
        }

        if (hasRights && canEditModuleObjectContext && !isLocked) {
            const actionText =
                ModuleObjectContext?.Action !== 'Create' &&
                ModuleObjectContext?.Action !== 'Toevoegen'
                    ? 'actie, '
                    : ' '

            items.push({
                text: `Bewerk ${actionText}toelichting en conclusie`,
                callback: openEditObjectModal,
            })
        }

        if ((canRemoveObjectFromModule || isModuleManager) && !isLocked) {
            items.push({
                text: 'Verwijder uit module',
                callback: openDeleteObjectModal,
            })
        }

        return items
    }, [
        hasRights,
        plural,
        Model.Object_ID,
        Model.UUID,
        fileUuid,
        refetchDocument,
        slugOverviewPublic,
        slugOverview,
        Module_ID,
        ModuleObjectContext?.Action,
        canPatchObjectInModule,
        isLocked,
        isActive,
        hasEditButton,
        disabled,
        Object_Type,
        canEditModuleObjectContext,
        openEditObjectModal,
        canRemoveObjectFromModule,
        isModuleManager,
        openDeleteObjectModal,
    ])

    const toggleDropdown = useCallback(() => {
        setIsOpen(current => !current)
    }, [])

    if (!dropdownItems.length) {
        return <div className="w-6" />
    }

    return (
        <div className="relative">
            <button
                className={cn(
                    'hover:bg-pzh-gray-100 flex h-8 w-8 items-center justify-center rounded-full',
                    {
                        'hover:bg-pzh-gray-200': invertHover,
                    }
                )}
                onClick={toggleDropdown}
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
    )
}

export default memo(ModuleItemDropdown)
