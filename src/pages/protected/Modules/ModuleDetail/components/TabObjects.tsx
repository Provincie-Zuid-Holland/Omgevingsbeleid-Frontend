import { Button, Divider } from '@pzh-ui/components'

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
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import * as modules from '@/validation/modules'

const TabObjects = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
        canEditModule,
        canPatchModuleStatus,
        canAddExistingObjectToModule,
        canAddNewObjectToModule,
    } = usePermissions()

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

    if (isLoading || !module) return <LoaderContent />

    return (
        <>
            {module.Activated ? (
                <ModuleLock />
            ) : (
                !canEditModule &&
                !isModuleManager && <Divider className="mb-4" />
            )}

            <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
                <div className="col-span-6 lg:col-span-4">
                    <ModuleItemList objects={objects} module={module} />

                    {(canAddExistingObjectToModule ||
                        canAddNewObjectToModule) &&
                        !isLocked && (
                            <Button
                                variant="link"
                                onPress={() =>
                                    setActiveModal('moduleAddObject')
                                }
                                className="block text-pzh-green-500 hover:text-pzh-green-900">
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
            </div>

            <ModuleContentsModal
                initialStep={1}
                initialValues={{
                    ...modules.EMPTY_MODULE_OBJECT,
                    state: 'existing',
                    validOrModule: 'valid',
                    Action: 'Edit',
                }}
                module={module}
            />

            <ModuleActivateModal />

            <ModuleLockModal />

            <ModuleEditObjectModal />

            <ModuleObjectDeleteConfirmationModal />

            <ModuleCompleteModal />
        </>
    )
}

export default TabObjects
