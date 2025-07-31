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
import ObjectsTable from './ObjectsTable'

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

    const canAddObject =
        (canAddExistingObjectToModule || canAddNewObjectToModule) && !isLocked
    const showInactiveCard =
        !module.Activated && (canPatchModuleStatus || isModuleManager)
    const showVersionCard =
        module.Activated &&
        isLocked &&
        !canComplete &&
        (canPatchModuleStatus || isModuleManager)
    const showCompleteCard = canComplete && isLocked && canPatchModuleStatus

    return (
        <>
            {module.Activated ? (
                <ModuleLock />
            ) : (
                !canEditModule &&
                !isModuleManager && <Divider className="mb-4" />
            )}

            <div className="grid grid-cols-6 gap-x-10 pt-6">
                {!canEditModule && !isModuleManager ? (
                    <>
                        <div className="col-span-6 lg:col-span-4">
                            <ModuleItemList objects={objects} module={module} />

                            {canAddObject && (
                                <Button
                                    variant="link"
                                    onPress={() =>
                                        setActiveModal('moduleAddObject')
                                    }
                                    className="text-pzh-green-500 hover:text-pzh-green-900 block">
                                    Onderdeel toevoegen
                                </Button>
                            )}
                        </div>

                        <div className="col-span-6 lg:col-span-2">
                            {showInactiveCard && <ModuleInactiveCard />}
                            {showVersionCard && <ModuleVersionCard />}
                            {showCompleteCard && <ModuleCompleteCard />}
                            {module.Activated && statusHistory && (
                                <ModuleTimeline statusHistory={statusHistory} />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="col-span-6 flex flex-col gap-y-6">
                        {showInactiveCard && (
                            <ModuleInactiveCard variant="row" />
                        )}
                        {showVersionCard && <ModuleVersionCard variant="row" />}
                        {showCompleteCard && (
                            <ModuleCompleteCard variant="row" />
                        )}

                        <ObjectsTable isLocked={isLocked} />
                    </div>
                )}
            </div>

            {/* Modals */}
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
