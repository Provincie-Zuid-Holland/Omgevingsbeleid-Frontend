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
import ModuleLock from '@/components/Modules/ModuleLock'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'

import { OwnerType } from '@/api/fetchers.schemas'
import ModuleScanModal from '@/components/Modals/ModuleModals/ModuleScanModal'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import * as modules from '@/validation/modules'
import { useOutletContext } from 'react-router-dom'
import ObjectsTable from './ObjectsTable'

type ObjectsOutletContext = {
    owners?: OwnerType
}

const TabObjects = () => {
    const { owners = 'All' } = useOutletContext<ObjectsOutletContext>()

    const { canPatchModuleStatus } = usePermissions()

    const {
        data: { Module: module } = {},
        isLoading,
        isModuleManager,
        isLocked,
        isClosed,
        canComplete,
    } = useModule()

    if (isLoading || !module) return <LoaderContent />

    const showInactiveCard =
        !module.Activated && (canPatchModuleStatus || isModuleManager)
    const showVersionCard =
        module.Activated &&
        isLocked &&
        !canComplete &&
        !isClosed &&
        (canPatchModuleStatus || isModuleManager)
    const showCompleteCard = canComplete && isLocked && canPatchModuleStatus

    return (
        <>
            {module.Activated && <ModuleLock />}

            <div className="grid grid-cols-6 gap-x-10 pt-6">
                <div className="col-span-6 flex flex-col gap-y-6">
                    {showInactiveCard && <ModuleInactiveCard variant="row" />}
                    {showVersionCard && <ModuleVersionCard variant="row" />}
                    {showCompleteCard && <ModuleCompleteCard variant="row" />}

                    <ObjectsTable
                        isLocked={isLocked}
                        isClosed={isClosed}
                        owners={owners}
                    />
                </div>
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
            <ModuleScanModal />
        </>
    )
}

export default TabObjects
