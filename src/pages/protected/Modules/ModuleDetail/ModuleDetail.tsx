import {
    Badge,
    Breadcrumbs,
    Button,
    Divider,
    Heading,
    Hyperlink,
    Notification,
    TabItem,
    Tabs,
    Text,
} from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import classNames from 'classnames'
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
import ModuleDecisionModal from '@/components/Modals/ModuleModals/ModuleDecisionModal'
import ModuleCompleteCard from '@/components/Modules/ModuleCompleteCard'
import ModuleInactiveCard from '@/components/Modules/ModuleInactiveCard'
import ModuleItemList from '@/components/Modules/ModuleItemList'
import ModuleLock from '@/components/Modules/ModuleLock'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'
import ModuleVersionTable from '@/components/Modules/ModuleVersionTable'
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
    const { canEditModule } = usePermissions()
    const pathName = location.pathname || ''

    const {
        data: { Module: module } = {},
        isLoading,
        isModuleManager,
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
            <div className="col-span-6 mb-4">
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
            </div>

            <div
                className={classNames('col-span-6', {
                    '[&_[role=tablist]]:hidden':
                        !canEditModule && !isModuleManager,
                })}>
                <Tabs>
                    <TabItem title="Onderdelen" key="objects">
                        {module.Activated ? (
                            <ModuleLock />
                        ) : (
                            !canEditModule &&
                            !isModuleManager && <Divider className="mb-4" />
                        )}
                        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-4">
                            <TabObjects />
                        </div>
                    </TabItem>
                    <TabItem title="Besluiten" key="decisions">
                        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-4">
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

    const [moduleContext, setModuleContext] = useState<ModuleContext>({})

    if (isLoading || !module) return <LoaderContent />

    return (
        <>
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
}

const TabDecisions = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <>
            <div className="col-span-6">
                <Notification title="Werking versies" className="mb-6">
                    Voor elke (interne en officiële) publicatie moet een nieuwe
                    versie van een besluit worden aangemaakt. Een besluit is te
                    bewerken tot het moment dat er op ‘Maak levering’ wordt
                    geklikt. Iets niet goed gedaan? Maak dan een nieuwe versie
                    aan. Standaard worden de gegevens overgenomen van de vorige
                    versie, maar deze zijn uiteraard aan te passen. Voor alle
                    leveringen zie leveringen.
                </Notification>

                <div>
                    <Heading level="2" className="mb-4">
                        Visie
                    </Heading>

                    <ModuleVersionTable
                        versions={[
                            {
                                version: 1,
                                status: 'Ontwerp GS',
                                type: 'Ontwerp',
                                purpose: 'Interne publicatie',
                                uploadDate: '03-01-2024',
                            },
                            {
                                version: 2,
                                status: 'Ontwerp GS',
                                type: 'Ontwerp',
                                purpose: 'Officiële publicatie',
                            },
                        ]}
                    />

                    <Button
                        icon={Plus}
                        size="small"
                        onPress={() => setActiveModal('moduleDecision')}>
                        Nieuwe versie aanmaken
                    </Button>
                </div>

                <Divider className="my-10" />

                <div>
                    <Heading level="2" className="mb-4">
                        Programma
                    </Heading>

                    <ModuleVersionTable
                        versions={[
                            {
                                version: 1,
                                status: 'Ontwerp GS',
                                type: 'Ontwerp',
                                purpose: 'Officiële publicatie',
                                isPending: true,
                            },
                        ]}
                    />

                    <Button
                        icon={Plus}
                        size="small"
                        onPress={() => setActiveModal('moduleDecision')}>
                        Nieuwe versie aanmaken
                    </Button>
                </div>

                <Divider className="my-10" />

                <div>
                    <Heading level="2" className="mb-4">
                        Verordening
                    </Heading>
                    <Button
                        icon={Plus}
                        size="small"
                        onPress={() => setActiveModal('moduleDecision')}
                        isDisabled>
                        Nieuwe versie aanmaken
                    </Button>
                </div>
            </div>
            <ModuleDecisionModal />
        </>
    )
}

export default ModuleDetail
