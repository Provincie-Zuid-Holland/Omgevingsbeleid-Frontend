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
import ModuleCompleteCard from '@/components/Modules/ModuleCompleteCard'
import ModuleInactiveCard from '@/components/Modules/ModuleInactiveCard'
import ModuleItemList from '@/components/Modules/ModuleItemList'
import ModuleLock from '@/components/Modules/ModuleLock'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'
import useModule from '@/hooks/useModule'
import useModuleManagers from '@/hooks/useModuleManagers'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'
import { getModuleStatusColor } from '@/utils/module'
import * as modules from '@/validation/modules'

export interface ModuleContext {
    object?: ModuleObjectShort
    module?: Module
}

const ModuleDetail = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
        canEditModule,
        canPatchModuleStatus,
        canAddExistingObjectToModule,
        canAddNewObjectToModule,
    } = usePermissions()
    const pathName = location.pathname || ''

    const [moduleContext, setModuleContext] = useState<ModuleContext>({})

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
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Modules', path: '/muteer' },
        { name: module?.Title || '', path: pathName },
    ]

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title={module.Title} hasOwnBreadcrumbs>
            <div className="col-span-6 mb-8">
                <div className="mb-4 flex items-center justify-between whitespace-nowrap">
                    <Breadcrumbs items={breadcrumbPaths} />
                    {(canEditModule || isModuleManager) && (
                        <Hyperlink
                            to={`/muteer/modules/${module.Module_ID}/bewerk`}
                            text="Module bewerken"
                        />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="w-[85%] flex-1 pr-4">
                        <div className="flex items-center">
                            <Heading level="1" size="xxl">
                                {module.Title}
                            </Heading>
                            <Badge
                                text={
                                    module.Status?.Status.replace('-', ' ') ||
                                    ''
                                }
                                upperCase={false}
                                className="-mt-2 ml-3 truncate"
                                variant={getModuleStatusColor(
                                    module.Status?.Status
                                )}
                            />
                        </div>
                        <div>
                            <Text className="truncate">
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
                    <ModuleLock />
                ) : (
                    <Divider className="mt-4" />
                )}
            </div>

            <div className="col-span-6 lg:col-span-4">
                <ModuleItemList
                    objects={objects}
                    module={module}
                    setModuleContext={setModuleContext}
                />

                {(canAddExistingObjectToModule || canAddNewObjectToModule) &&
                    !isLocked && (
                        <Button
                            variant="link"
                            onPress={() => setActiveModal('moduleAddObject')}
                            className="block text-pzh-green hover:text-pzh-green-dark">
                            Onderdeel toevoegen
                        </Button>
                    )}
            </div>

            <div className="col-span-6 lg:col-span-2">
                {!module.Activated &&
                    (canPatchModuleStatus || isModuleManager) && (
                        <ModuleInactiveCard />
                    )}

                {module.Activated &&
                    isLocked &&
                    !canComplete &&
                    (canPatchModuleStatus || isModuleManager) && (
                        <ModuleVersionCard />
                    )}

                {canComplete && isLocked && canPatchModuleStatus && (
                    <ModuleCompleteCard />
                )}

                {module.Activated && statusHistory && (
                    <ModuleTimeline statusHistory={statusHistory} />
                )}
            </div>

            <Modals moduleContext={moduleContext} module={module} />
        </MutateLayout>
    )
}

interface ModalsProps {
    module: Module
    moduleContext: ModuleContext
}

const Modals = ({ moduleContext, module }: ModalsProps) => (
    <>
        <ModuleContentsModal
            initialStep={1}
            initialValues={{
                ...modules.EMPTY_MODULE_OBJECT,
                state: 'existing',
            }}
            module={module}
        />

        <ModuleActivateModal />

        <ModuleLockModal />

        <ModuleEditObjectModal
            object={moduleContext.object || ({} as ModuleObjectShort)}
        />

        <ModuleObjectDeleteConfirmationModal
            object={moduleContext.object || ({} as ModuleObjectShort)}
            module={module}
        />

        <ModuleCompleteModal />
    </>
)

export default ModuleDetail
