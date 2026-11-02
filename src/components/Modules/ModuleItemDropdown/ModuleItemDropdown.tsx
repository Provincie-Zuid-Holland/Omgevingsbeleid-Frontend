import { memo, useCallback, useMemo, useState } from 'react'

import { cn } from '@pzh-ui/components'
import { EllipsisVertical } from '@pzh-ui/icons'

import Dropdown, { DropdownItem } from '@/components/Dropdown'
import { Model, ModelReturnTypeBasic } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

interface ModuleItemDropdownProps extends ModelReturnTypeBasic {
    objectConfig: Model
    hasEditButton?: boolean
    hasViewButton?: boolean
    invertHover?: boolean
}

const ModuleItemDropdown = ({
    objectConfig: model,
    object_statics: ObjectStatics,
    module_id,
    module_object_context: ModuleObjectContext,
    module_latest_status,
    hasEditButton,
    object_type,
    model: _model,
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
        object_type === 'document' && 'file_id' in _model
            ? String(_model.file_id || '')
            : ''

    const hasRights = useMemo(
        () =>
            canEditModule ||
            isModuleManager ||
            ObjectStatics?.owner_1_id === user?.id ||
            ObjectStatics?.owner_2_id === user?.id ||
            ObjectStatics?.owner_3_id === user?.id,
        [
            canEditModule,
            isModuleManager,
            ObjectStatics?.owner_1_id,
            ObjectStatics?.owner_2_id,
            ObjectStatics?.owner_3_id,
            user?.id,
        ]
    )

    const downloadDocument = useDownloadStorageFile(fileUuid)

    const openEditObjectModal = useCallback(() => {
        setActiveModal('moduleEditObject', {
            object: {
                object_type,
                model: _model,
                module_id,
                module_object_context: ModuleObjectContext,
                module_latest_status,
                object_statics: ObjectStatics,
            },
        })
    }, [
        setActiveModal,
        object_type,
        _model,
        module_id,
        ModuleObjectContext,
        module_latest_status,
        ObjectStatics,
    ])

    const openDeleteObjectModal = useCallback(() => {
        setActiveModal('moduleDeleteObject', {
            object: {
                object_type,
                model: _model,
                module_id,
                module_object_context: ModuleObjectContext,
                module_latest_status,
                object_statics: ObjectStatics,
            },
            module: {
                title: String(data?.module.title),
                module_id: Number(data?.module.module_id),
            },
        })
    }, [
        setActiveModal,
        object_type,
        _model,
        module_id,
        ModuleObjectContext,
        module_latest_status,
        ObjectStatics,
        data?.module.title,
        data?.module.module_id,
    ])

    const refetchDocument = useCallback(() => {
        downloadDocument.refetch()
    }, [downloadDocument])

    const dropdownItems = useMemo<DropdownItem[]>(() => {
        const items: DropdownItem[] = []

        if (hasRights) {
            items.push({
                text: 'Bekijk detailpagina',
                link: `/muteer/${plural}/${_model.object_id}`,
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
                link: `/${slugOverview}/${plural}/ontwerpversie/${module_id}/${_model.id}`,
            })
        }

        if (
            ModuleObjectContext?.action !== 'Terminate' &&
            hasRights &&
            canPatchObjectInModule &&
            !isLocked &&
            isActive &&
            !hasEditButton &&
            !disabled
        ) {
            items.push({
                text: 'Bewerk onderdeel',
                link: `/muteer/modules/${module_id}/${object_type}/${_model.object_id}/bewerk`,
            })
        }

        if (hasRights && canEditModuleObjectContext && !isLocked) {
            const actionText =
                ModuleObjectContext?.action !== 'Create' &&
                ModuleObjectContext?.action !== 'Toevoegen'
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
        _model.object_id,
        _model.id,
        fileUuid,
        refetchDocument,
        slugOverviewPublic,
        slugOverview,
        module_id,
        ModuleObjectContext?.action,
        canPatchObjectInModule,
        isLocked,
        isActive,
        hasEditButton,
        disabled,
        object_type,
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
                    'flex h-8 w-8 items-center justify-center rounded-full hover:bg-pzh-gray-100',
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
