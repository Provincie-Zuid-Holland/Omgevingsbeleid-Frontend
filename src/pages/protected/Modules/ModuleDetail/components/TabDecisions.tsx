import { useMemo, useState } from 'react'

import { Notification, TabItem, Tabs } from '@pzh-ui/components'

import { Outlet, useParams } from 'react-router-dom'

import {
    usePublicationEnvironmentsGetListEnvironments,
    usePublicationsGetListPublications,
} from '@/api/fetchers'
import { ProcedureType } from '@/api/fetchers.schemas'
import {
    PublicationAddModal,
    PublicationAnnouncementUpdateModal,
    PublicationEditModal,
    PublicationExportPdfModal,
    PublicationPackageReportUploadModal,
    PublicationVersionEditModal,
} from '@/components/Modals/PublicationModals'
import PublicationScanModal from '@/components/Modals/PublicationModals/PublicationScanModal'
import PublicationFolder from '@/components/Publications/PublicationFolder'

const TabDecisions = () => (
    <>
        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
            <Outlet />
        </div>

        <PublicationAddModal />
        <PublicationEditModal />
        <PublicationExportPdfModal />
        <PublicationScanModal />
        <PublicationVersionEditModal />
        <PublicationAnnouncementUpdateModal />
        <PublicationPackageReportUploadModal />
    </>
)

export const Publications = () => {
    const { moduleId } = useParams()
    const [activeEnv, setActiveEnv] = useState<string | null>(null)

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
                                    title="De publicatieomgeving is vergrendeld"
                                    variant="warning"
                                    className="mb-6">
                                    Deze publicatieomgeving is momenteel
                                    vergrendeld omdat er een publicatielevering
                                    is gemaakt, deze wordt weer vrijgegeven
                                    zodra er een leveringsrapport is upload. Tot
                                    die tijd kun je geen nieuwe publicatie
                                    leveringen aanmaken. Je kan wel validatie
                                    leveringen maken.
                                </Notification>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {procedureTypes.map(procedureType => (
                                    <PublicationFolder
                                        key={procedureType}
                                        procedureType={procedureType}
                                        publications={publications?.results}
                                        environment={environment}
                                    />
                                ))}
                            </div>
                        </TabItem>
                    ))}
                </Tabs>
            )}

            <div id="select-version-portal" />
        </div>
    )
}

export default TabDecisions
