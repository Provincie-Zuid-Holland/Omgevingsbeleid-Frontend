import {
    Badge,
    Breadcrumbs,
    Button,
    Divider,
    Heading,
    Hyperlink,
    Text,
} from '@pzh-ui/components'
import { useState } from 'react'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import Avatar from '@/components/Avatar'
import { LoaderContent } from '@/components/Loader'
import {
    ModuleActivateModal,
    ModuleCompleteModal,
    ModuleContentsModal,
    ModuleEditObjectModal,
    ModuleLockModal,
    ModuleObjectDeleteConfirmationModal,
} from '@/components/Modals/ModuleModals'
import { ModuleModalActions } from '@/components/Modals/ModuleModals/types'
import ModuleCompleteCard from '@/components/Modules/ModuleCompleteCard/ModuleCompleteCard'
import ModuleInactiveCard from '@/components/Modules/ModuleInactiveCard'
import ModuleItemList from '@/components/Modules/ModuleItemList'
import ModuleLock from '@/components/Modules/ModuleLock'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'
import useModule from '@/hooks/useModule'
import useModuleManagers from '@/hooks/useModuleManagers'
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
        canComplete,
    } = useModule()

    const managers = useModuleManagers(module)

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
                    {(canEditModule || isModuleManager) && (
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
                                text={
                                    module.Status?.Status.replace('-', ' ') ||
                                    ''
                                }
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

            <div className="col-span-6 lg:col-span-4">
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

            <div className="col-span-6 lg:col-span-2">
                {!module.Activated && (
                    <ModuleInactiveCard setModuleModal={setModuleModal} />
                )}

                {module.Activated &&
                    isLocked &&
                    !canComplete &&
                    (canPatchModuleStatus || isModuleManager) && (
                        <ModuleVersionCard currentStatus={module.Status} />
                    )}

                {canComplete && isLocked && canPatchModuleStatus && (
                    <ModuleCompleteCard setModuleModal={setModuleModal} />
                )}

                {module.Activated && statusHistory && (
                    <ModuleTimeline statusHistory={statusHistory} />
                )}
            </div>

            <Modals
                moduleModal={moduleModal}
                setModuleModal={setModuleModal}
                module={module}
            />
        </MutateLayout>
    )
}

interface ModalsProps {
    module: Module
    moduleModal: ModuleModalActions
    setModuleModal: (e: ModuleModalActions) => void
}

const Modals = ({ moduleModal, setModuleModal, module }: ModalsProps) => (
    <>
        <ModuleContentsModal
            isOpen={moduleModal.isOpen && moduleModal.action === 'addContents'}
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
            isOpen={moduleModal.isOpen && moduleModal.action === 'editObject'}
            onClose={() => setModuleModal({ ...moduleModal, isOpen: false })}
            object={moduleModal.object || ({} as ModuleObjectShort)}
        />

        <ModuleObjectDeleteConfirmationModal
            isOpen={moduleModal.isOpen && moduleModal.action === 'deleteObject'}
            onClose={() => setModuleModal({ ...moduleModal, isOpen: false })}
            object={moduleModal.object || ({} as ModuleObjectShort)}
            module={module}
        />

        <ModuleCompleteModal
            isOpen={
                moduleModal.isOpen && moduleModal.action === 'completeModule'
            }
            onClose={() => setModuleModal({ ...moduleModal, isOpen: false })}
        />
    </>
)

export default ModuleDetail
