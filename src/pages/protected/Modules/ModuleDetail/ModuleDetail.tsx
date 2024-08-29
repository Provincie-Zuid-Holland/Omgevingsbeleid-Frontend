import {
    Accordion,
    Button,
    Divider,
    TabItem,
    Tabs,
    TabsProps,
} from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { usePublicationsGet } from '@/api/fetchers'
import { DocumentType, Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'
import {
    ModuleActivateModal,
    ModuleCompleteModal,
    ModuleContentsModal,
    ModuleEditObjectModal,
    ModuleLockModal,
    ModuleObjectDeleteConfirmationModal,
} from '@/components/Modals/ModuleModals'
import ModuleCompleteCard from '@/components/Modules/ModuleCompleteCard'
import ModuleHeader from '@/components/Modules/ModuleHeader'
import ModuleInactiveCard from '@/components/Modules/ModuleInactiveCard'
import ModuleItemList from '@/components/Modules/ModuleItemList'
import ModuleLock from '@/components/Modules/ModuleLock'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'
import PublicationFolder from '@/components/Publications/PublicationFolder'
import PublicationWizard from '@/components/Publications/PublicationWizard'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'
import * as modules from '@/validation/modules'

type TabType = 'objects' | 'decisions'

export interface ModuleContext {
    object?: ModuleObjectShort
    module?: Module
}

interface ModuleDetailProps {
    activeTab?: TabType
}

const ModuleDetail = ({
    activeTab: providedActiveTab = 'objects',
}: ModuleDetailProps) => {
    const { canEditModule } = usePermissions()
    const navigate = useNavigate()
    const { moduleId } = useParams()

    const [activeTab, setActiveTab] = useState<TabType>(providedActiveTab)

    const {
        data: { Module: module } = {},
        isLoading,
        isModuleManager,
    } = useModule()

    const handleTabChange: TabsProps['onSelectionChange'] = key => {
        setActiveTab(key as TabType)

        navigate(
            `/muteer/modules/${moduleId}${
                key === 'decisions' ? '/besluiten' : ''
            }`
        )
    }

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title={module.Title} hasOwnBreadcrumbs>
            <ModuleHeader module={module} />

            <div
                className={classNames('col-span-6', {
                    '[&_[role=tablist]]:hidden':
                        !canEditModule && !isModuleManager,
                })}>
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={handleTabChange}>
                    <TabItem title="Onderdelen" key="objects">
                        {module.Activated ? (
                            <ModuleLock />
                        ) : (
                            !canEditModule &&
                            !isModuleManager && <Divider className="mb-4" />
                        )}
                        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
                            <TabObjects />
                        </div>
                    </TabItem>
                    <TabItem title="Besluiten" key="decisions">
                        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
                            <TabDecisions />
                        </div>
                    </TabItem>
                </Tabs>
            </div>
        </MutateLayout>
    )
}

const TabObjects = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
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
            <div className="col-span-6 lg:col-span-4">
                <ModuleItemList objects={objects} module={module} />

                {(canAddExistingObjectToModule || canAddNewObjectToModule) &&
                    !isLocked && (
                        <Button
                            variant="link"
                            onPress={() => setActiveModal('moduleAddObject')}
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

            <ModuleContentsModal
                initialStep={1}
                initialValues={{
                    ...modules.EMPTY_MODULE_OBJECT,
                    state: 'existing',
                    validOrModule: 'valid',
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

const TabDecisions = () => {
    const { moduleId } = useParams()

    const [showWizard, setShowWizard] = useState(true)

    const documentTypes = Object.keys(DocumentType) as Array<DocumentType>

    const { data: publications, isFetching: publicationsFetching } =
        usePublicationsGet({
            module_id: parseInt(moduleId!),
            limit: 100,
        })

    const getPublicationsByDocumentType = useCallback(
        (documentType: DocumentType) =>
            publications?.results.filter(
                publication => publication.Document_Type === documentType
            ),
        [publications?.results]
    )

    useEffect(() => {
        if (!!publications?.results.length && !publicationsFetching) {
            setShowWizard(false)
        }
    }, [publications?.results, publicationsFetching])

    return (
        <div className="col-span-6 flex flex-col gap-6">
            {publicationsFetching ? (
                <LoaderSpinner />
            ) : !showWizard ? (
                <Button
                    size="small"
                    icon={Plus}
                    className="self-end"
                    onPress={() => setShowWizard(true)}>
                    Nieuw
                </Button>
            ) : (
                <PublicationWizard handleClose={() => setShowWizard(false)} />
            )}

            <Accordion type="multiple" className="flex flex-col gap-4">
                {documentTypes.map(documentType => (
                    <PublicationFolder
                        key={documentType}
                        documentType={documentType}
                        publications={getPublicationsByDocumentType(
                            documentType
                        )}
                    />
                ))}
            </Accordion>
        </div>
    )
}

export default ModuleDetail
