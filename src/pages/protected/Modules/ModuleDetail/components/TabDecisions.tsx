import { Accordion, BackLink, Heading, TabItem, Tabs } from '@pzh-ui/components'
import { useUnmountEffect } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import {
    usePublicationActPackagesGetListActPackages,
    usePublicationAnnouncementPackagesGetListAnnouncementPackages,
    usePublicationAnnouncementsGetListAnnouncements,
    usePublicationEnvironmentsGetDetailEnvironment,
    usePublicationEnvironmentsGetListEnvironments,
    usePublicationsGetListPublications,
    usePublicationVersionsGetDetailVersion,
} from '@/api/fetchers'
import {
    DocumentType,
    PackageType,
    ProcedureType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import {
    PublicationAddModal,
    PublicationAnnouncementUpdateModal,
    PublicationEditModal,
    PublicationPackageReportUploadModal,
    PublicationVersionEditModal,
} from '@/components/Modals/PublicationModals'
import PublicationFolder from '@/components/Publications/PublicationFolder'
import PublicationNotification from '@/components/Publications/PublicationNotification'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import usePublicationStore from '@/store/publicationStore'

const TabDecisions = () => (
    <>
        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
            <Outlet />
        </div>

        <PublicationAddModal />
        <PublicationEditModal />
        <PublicationVersionEditModal />
        <PublicationAnnouncementUpdateModal />
        <PublicationPackageReportUploadModal />
    </>
)

export const Publications = () => {
    const { moduleId } = useParams()

    const { wizardActive, setWizardActive, activeFolders, setActiveFolders } =
        usePublicationStore(
            useShallow(state => ({
                wizardActive: state.wizardActive,
                setWizardActive: state.setWizardActive,
                activeFolders: state.activeFolders,
                setActiveFolders: state.setActiveFolders,
            }))
        )

    const documentTypes = Object.keys(DocumentType) as Array<DocumentType>
    const procedureTypes = Object.keys(ProcedureType) as Array<ProcedureType>

    const { data: publications, isFetching: publicationsFetching } =
        usePublicationsGetListPublications({
            module_id: parseInt(moduleId!),
            limit: 100,
        })

    const { data: environments } =
        usePublicationEnvironmentsGetListEnvironments({ limit: 100 })

    useEffect(() => {
        if (!!publications?.results.length && !publicationsFetching) {
            setWizardActive(false)
        }
    }, [publications?.results, publicationsFetching, setWizardActive])

    useUnmountEffect(() => setWizardActive(true))

    return (
        <div className="col-span-6 flex flex-col gap-6">
            {/* {publicationsFetching ? (
                <LoaderSpinner />
            ) : !wizardActive ? (
                <Button
                    size="small"
                    icon={Plus}
                    className="self-end"
                    onPress={() => setWizardActive(true)}>
                    Nieuw
                </Button>
            ) : (
                <PublicationWizard handleClose={() => setWizardActive(false)} />
            )} */}

            {!!environments?.results.length && (
                <Tabs variant="filled" className="place-self-center">
                    {environments.results.map(environment => (
                        <TabItem
                            title={environment.Title}
                            key={environment.UUID}>
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

export const Packages = () => {
    const { moduleId, versionUUID } = useParams()

    const { data: version, isFetching: versionFetching } =
        usePublicationVersionsGetDetailVersion(String(versionUUID), {
            query: {
                enabled: !!versionUUID,
            },
        })

    const { data: environment, isFetching: environmentFetching } =
        usePublicationEnvironmentsGetDetailEnvironment(
            String(version?.Publication.Environment_UUID),
            {
                query: {
                    enabled: !!version?.Publication.Environment_UUID,
                },
            }
        )

    const { data: validActPackage } =
        usePublicationActPackagesGetListActPackages(
            {
                version_uuid: version?.UUID,
                package_type: PackageType['publication'],
                limit: 3,
                sort_column: 'Created_Date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!version?.UUID,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.Report_Status === ReportStatusType['valid']
                        ),
                },
            }
        )

    const { data: announcement, isFetching: announcementFetching } =
        usePublicationAnnouncementsGetListAnnouncements(
            {
                limit: 100,
                act_package_uuid: validActPackage?.UUID,
            },
            {
                query: {
                    enabled: !!validActPackage?.UUID,
                    select: data => data.results[0],
                },
            }
        )

    const { data: validAnnouncementPackage } =
        usePublicationAnnouncementPackagesGetListAnnouncementPackages(
            {
                announcement_uuid: announcement?.UUID,
                limit: 3,
                package_type: PackageType['publication'],
                sort_column: 'Created_Date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!announcement?.UUID,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.Report_Status === ReportStatusType['valid']
                        ),
                },
            }
        )

    const [activeItems, setActiveItems] = useState(['act'])

    useEffect(() => {
        if (
            environment?.Can_Publicate &&
            version?.Publication.Procedure_Type === 'draft' &&
            !!validActPackage
        ) {
            setActiveItems(['act', 'announcement'])
        }
    }, [environment, version, announcement, validActPackage])

    if (
        versionFetching ||
        environmentFetching ||
        announcementFetching ||
        !version
    )
        return <LoaderSpinner />

    return (
        <div className="col-span-6 flex flex-col gap-6">
            <div>
                <BackLink
                    asChild
                    className="text-s text-pzh-blue-500 inline-flex underline hover:no-underline">
                    <Link to={`/muteer/modules/${moduleId}/besluiten`}>
                        Terug naar het overzicht
                    </Link>
                </BackLink>
            </div>

            <Heading level="2" size="l">
                {version?.Module_Status.Status} - {version?.Publication.Title} (
                {environment?.Title})
            </Heading>

            <Accordion
                type="multiple"
                className="flex flex-col gap-4"
                value={activeItems}
                onValueChange={setActiveItems}>
                <PublicationPackages
                    environment={environment}
                    version={version}
                    publication={version?.Publication}
                    publicationType="act"
                    isLocked={version.Is_Locked}
                />
                {version?.Publication.Procedure_Type === 'draft' &&
                    environment?.Can_Publicate &&
                    !!validActPackage && (
                        <PublicationNotification
                            publicationType="act"
                            validPublicationPackage={validActPackage}
                            version={version}
                            announcement={announcement}
                        />
                    )}
                {version?.Publication.Procedure_Type === 'draft' &&
                    environment?.Can_Publicate && (
                        <PublicationPackages
                            environment={environment}
                            version={version}
                            publication={version?.Publication}
                            publicationType="announcement"
                            validPublicationPackage={validActPackage}
                            announcement={announcement}
                            isDisabled={
                                !!!announcement || !!validAnnouncementPackage
                            }
                        />
                    )}
                {environment?.Can_Publicate && !!validAnnouncementPackage && (
                    <PublicationNotification
                        publicationType="announcement"
                        validPublicationPackage={validAnnouncementPackage}
                        version={version}
                        announcement={announcement}
                    />
                )}
            </Accordion>
        </div>
    )
}

export default TabDecisions
