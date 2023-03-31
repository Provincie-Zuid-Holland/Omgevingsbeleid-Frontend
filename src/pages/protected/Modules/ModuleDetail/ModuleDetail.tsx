import {
    Badge,
    Breadcrumbs,
    Button,
    Divider,
    Heading,
    Hyperlink,
    Text,
} from '@pzh-ui/components'
import { useMemo, useState } from 'react'

import { useUsersGet } from '@/api/fetchers'
import { ModuleObjectShort, UserShort } from '@/api/fetchers.schemas'
import Avatar from '@/components/Avatar'
import { LoaderContent } from '@/components/Loader'
import ModuleInactiveCard from '@/components/Modules/ModuleInactiveCard'
import ModuleItemList from '@/components/Modules/ModuleItemList'
import ModuleLock from '@/components/Modules/ModuleLock'
import {
    ModuleActivateModal,
    ModuleContentsModal,
} from '@/components/Modals/ModuleModals'
import ModuleEditObjectModal from '@/components/Modals/ModuleModals/ModuleEditObjectModal'
import ModuleLockModal from '@/components/Modals/ModuleModals/ModuleLockModal'
import ModuleObjectDeleteConfirmationModal from '@/components/Modals/ModuleModals/ModuleObjectDeleteConfirmationModal'
import { ModuleModalActions } from '@/components/Modals/ModuleModals/types'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import getModuleStatusColor from '@/utils/getModuleStatusColor'
import * as modules from '@/validation/modules'

const ModuleDetail = () => {
    const {
        canEditModule,
        canPatchModuleStatus,
        canAddExistingObjectToModule,
        canAddNewObjectToModule,
    } = usePermissions()
    const pathName = location.pathname || ''

    const [moduleModal, setModuleModal] = useState<ModuleModalActions>({
        isOpen: false,
    })

    const {
        data: {
            Module: module,
            Objects: objects,
            StatusHistory: statusHistory,
        } = {},
        isLoading,
        isModuleManager,
        isLocked,
    } = useModule()
    const { data: users } = useUsersGet()

    /**
     * Array of selected managers of module
     */
    const managers = useMemo(() => {
        const items: UserShort[] = []

        if (module?.Module_Manager_1_UUID) {
            const manager_1 = users?.find(
                user => user.UUID === module.Module_Manager_1_UUID
            )

            if (manager_1) items.push(manager_1)
        }

        if (module?.Module_Manager_2_UUID) {
            const manager_2 = users?.find(
                user => user.UUID === module.Module_Manager_2_UUID
            )

            if (manager_2) items.push(manager_2)
        }

        return items
    }, [module?.Module_Manager_1_UUID, module?.Module_Manager_2_UUID, users])

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        { name: 'Modules', path: '/muteer' },
        { name: module?.Title || '', path: pathName },
    ]

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title={module.Title}>
            <div className="col-span-6 mb-6">
                <div className="flex items-center justify-between mb-4 whitespace-nowrap">
                    <Breadcrumbs items={breadcrumbPaths} />
                    {canEditModule && (
                        <Hyperlink
                            to={`/muteer/modules/${module.Module_ID}/bewerk`}
                            text="Module bewerken"
                        />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex-1 w-[85%]">
                        <div className="flex items-center">
                            <Heading level="1">{module.Title}</Heading>
                            <Badge
                                text={module.Status?.Status || ''}
                                upperCase={false}
                                className="-mt-2 ml-2"
                                variant={getModuleStatusColor(
                                    module.Status?.Status
                                )}
                            />
                        </div>
                        <div>
                            <Text type="body" className="truncate">
                                {module.Description}
                            </Text>
                        </div>
                    </div>
                    <div className="flex">
                        {managers?.[0] && (
                            <Avatar name={managers[0].Gebruikersnaam} />
                        )}
                        {managers?.[1] && (
                            <Avatar
                                name={managers[1].Gebruikersnaam}
                                className="-ml-2"
                            />
                        )}
                    </div>
                </div>
                {module.Activated ? (
                    <ModuleLock setModuleModal={setModuleModal} />
                ) : (
                    <Divider className="mt-3" />
                )}
            </div>

            <div className="col-span-4">
                <ModuleItemList
                    objects={objects}
                    module={module}
                    setModuleModal={setModuleModal}
                />

                {(canAddExistingObjectToModule || canAddNewObjectToModule) &&
                    !isLocked && (
                        <Button
                            variant="link"
                            onPress={() =>
                                setModuleModal({
                                    isOpen: true,
                                    action: 'addContents',
                                })
                            }
                            className="block text-pzh-green hover:text-pzh-green-dark">
                            Onderdeel toevoegen
                        </Button>
                    )}
            </div>

            <div className="col-span-2">
                {!module.Activated && (
                    <ModuleInactiveCard setModuleModal={setModuleModal} />
                )}

                {module.Activated &&
                    isLocked &&
                    (canPatchModuleStatus || isModuleManager) && (
                        <ModuleVersionCard currentStatus={module.Status} />
                    )}

                {module.Activated && statusHistory && (
                    <ModuleTimeline statusHistory={statusHistory} />
                )}
            </div>

            <ModuleContentsModal
                isOpen={
                    moduleModal.isOpen && moduleModal.action === 'addContents'
                }
                onClose={() => setModuleModal({ isOpen: false })}
                initialStep={1}
                initialValues={{
                    ...modules.EMPTY_MODULE_OBJECT,
                    state: 'new',
                }}
                module={module}
            />

            <ModuleActivateModal
                isOpen={moduleModal.isOpen && moduleModal.action === 'activate'}
                onClose={() => setModuleModal({ isOpen: false })}
            />

            <ModuleLockModal
                isOpen={moduleModal.isOpen && moduleModal.action === 'lock'}
                onClose={() => setModuleModal({ isOpen: false })}
            />

            <ModuleEditObjectModal
                isOpen={
                    moduleModal.isOpen && moduleModal.action === 'editObject'
                }
                onClose={() =>
                    setModuleModal({ ...moduleModal, isOpen: false })
                }
                object={moduleModal.object || ({} as ModuleObjectShort)}
            />

            <ModuleObjectDeleteConfirmationModal
                isOpen={
                    moduleModal.isOpen && moduleModal.action === 'deleteObject'
                }
                onClose={() =>
                    setModuleModal({ ...moduleModal, isOpen: false })
                }
                object={moduleModal.object || ({} as ModuleObjectShort)}
                module={module}
            />
        </MutateLayout>
    )
}

export default ModuleDetail
