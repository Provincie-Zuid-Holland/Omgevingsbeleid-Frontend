import { Accordion, Notification, TabItem, Tabs } from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import {
    usePublicationEnvironmentsGetListEnvironments,
    usePublicationsGetListPublications,
} from '@/api/fetchers'
import { ProcedureType } from '@/api/fetchers.schemas'
import {
    PublicationAddModal,
    PublicationAnnouncementUpdateModal,
    PublicationEditModal,
    PublicationPackageReportUploadModal,
    PublicationVersionEditModal,
} from '@/components/Modals/PublicationModals'
import PublicationScanModal from '@/components/Modals/PublicationModals/PublicationScanModal'
import PublicationFolder from '@/components/Publications/PublicationFolder'
import usePublicationStore from '@/store/publicationStore'

const TabDecisions = () => (
    <>
        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
            <Outlet />
        </div>

        <PublicationAddModal />
        <PublicationEditModal />
        <PublicationScanModal />
        <PublicationVersionEditModal />
        <PublicationAnnouncementUpdateModal />
        <PublicationPackageReportUploadModal />
    </>
)

export const Publications = () => {
    const { moduleId } = useParams()
    const [activeEnv, setActiveEnv] = useState<string | null>(null)

    const { activeFolders, setActiveFolders } = usePublicationStore(
        useShallow(state => ({
            activeFolders: state.activeFolders,
            setActiveFolders: state.setActiveFolders,
        }))
    )

    const procedureTypes = Object.keys(ProcedureType) as Array<ProcedureType>

    const { data: publications } = usePublicationsGetListPublications({
        module_id: parseInt(moduleId!),
        limit: 100,
    })

    const { data: environments } =
        usePublicationEnvironmentsGetListEnvironments({
            limit: 100,
            is_active: true,
        })

    const isEnvironmentLocked = useMemo(
        () =>
            environments?.results.find(env => env.UUID === activeEnv)
                ?.Is_Locked,
        [environments, activeEnv]
    )

    return (
        <div className="col-span-6 flex flex-col gap-6">
            {!!environments?.results.length && (
                <Tabs
                    variant="filled"
                    selectedKey={activeEnv ?? undefined}
                    onSelectionChange={val => setActiveEnv(val as string)}
                    className="place-self-center">
                    {environments.results.map(environment => (
                        <TabItem
                            title={environment.Title}
                            key={environment.UUID}>
                            {isEnvironmentLocked && (
                                <Notification
                                    title="De publicatieomgeving is gelockt"
                                    variant="warning"
                                    className="mb-6">
                                    Deze publicatieomgeving is momenteel gelockt
                                    omdat er een publicatielevering is gemaakt,
                                    deze wordt weer vrijgegeven zodra er een
                                    leveringsrapport is upload. Tot die tijd kun
                                    je geen nieuwe publicatie leveringen
                                    aanmaken. Je kan wel validatie leveringen
                                    maken.
                                </Notification>
                            )}

                            <Accordion
                                type="multiple"
                                className="flex flex-col gap-6"
                                value={activeFolders.procedureTypes}
                                onValueChange={procedureTypes =>
                                    setActiveFolders({ procedureTypes })
                                }>
                                {procedureTypes.map(procedureType => (
                                    <PublicationFolder
                                        key={procedureType}
                                        procedureType={procedureType}
                                        publications={publications?.results}
                                        environment={environment}
                                    />
                                ))}
                            </Accordion>
                        </TabItem>
                    ))}
                </Tabs>
            )}

            <div id="select-version-portal" />
        </div>
    )
}

export default TabDecisions
