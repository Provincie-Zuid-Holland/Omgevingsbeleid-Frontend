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
import { useMemo, useState } from 'react'

interface ModuleItemDropdownProps extends ModelReturnTypeBasic {
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

    const downloadDocument = useQuery({
        queryKey: [
            'downloadStorageFile',
            'File_UUID' in Model && Model.File_UUID,
        ],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(
                    'File_UUID' in Model ? String(Model.File_UUID) : ''
                )[0],
                undefined,
                true
            ),
        enabled: false,
    })

    /**
     * Array of dropdown items based on user rights
     */
    const dropdownItems: DropdownItem[] = [
        ...((hasRights && [
            {
                text: 'Bekijk detailpagina',
                link: `/muteer/${plural}/${Model.Object_ID}`,
            },
        ]) ||
            []),
        ...(Object_Type === 'document' &&
        'File_UUID' in Model &&
        !!Model.File_UUID
            ? [
                  {
                      text: 'Bekijk document',
                      isExternal: true,
                      callback: () =>
                          !!downloadDocument && downloadDocument.refetch(),
                  },
              ]
            : !!model.defaults.slugOverviewPublic
              ? [
                    {
                        text: 'Bekijk voorbeeld',
                        isExternal: true,
                        link: `/${slugOverview}/${plural}/ontwerpversie/${Module_ID}/${Model.UUID}`,
                    },
                ]
              : []),
        ...((ModuleObjectContext?.Action !== 'Terminate' &&
            hasRights &&
            canPatchObjectInModule &&
            !isLocked &&
            isActive &&
            !hasEditButton && [
                {
                    text: 'Bewerk onderdeel',
                    link: `/muteer/modules/${Module_ID}/${Object_Type}/${Model.Object_ID}/bewerk`,
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
                                Model,
                                Module_ID,
                                ModuleObjectContext,
                                ObjectStatics,
                            },
                        }),
                },
            ]) ||
            []),
        ...(((canRemoveObjectFromModule || isModuleManager) &&
            !isLocked && [
                {
                    text: 'Verwijder uit module',
                    callback: () =>
                        setActiveModal('moduleDeleteObject', {
                            object: {
                                Object_Type,
                                Model,
                                Module_ID,
                                ModuleObjectContext,
                                ObjectStatics,
                            },
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
