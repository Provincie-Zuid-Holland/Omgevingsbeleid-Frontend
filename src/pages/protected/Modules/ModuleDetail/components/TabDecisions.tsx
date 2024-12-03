import { Accordion, BackLink, Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useUnmountEffect } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import {
    usePublicationActPackagesGet,
    usePublicationAnnouncementPackagesGet,
    usePublicationAnnouncementsGet,
    usePublicationEnvironmentsEnvironmentUuidGet,
    usePublicationsGet,
    usePublicationVersionsVersionUuidGet,
} from '@/api/fetchers'
import {
    DocumentType,
    PackageType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import {
    PublicationAnnouncementUpdateModal,
    PublicationEditModal,
    PublicationPackageReportUploadModal,
    PublicationVersionEditModal,
} from '@/components/Modals/PublicationModals'
import PublicationFolder from '@/components/Publications/PublicationFolder'
import PublicationNotification from '@/components/Publications/PublicationNotification'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import PublicationWizard from '@/components/Publications/PublicationWizard'
import usePublicationStore from '@/store/publicationStore'

const TabDecisions = () => (
    <>
        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
            <Outlet />
        </div>

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

    const { data: publications, isFetching: publicationsFetching } =
        usePublicationsGet({
            module_id: parseInt(moduleId!),
            limit: 100,
        })

    useEffect(() => {
        if (!!publications?.results.length && !publicationsFetching) {
            setWizardActive(false)
        }
    }, [publications?.results, publicationsFetching, setWizardActive])

    useUnmountEffect(() => setWizardActive(true))

    return (
        <div className="col-span-6 flex flex-col gap-6">
            {publicationsFetching ? (
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
            )}

            <Accordion
                type="multiple"
                className="flex flex-col gap-4"
                value={activeFolders.documentTypes}
                onValueChange={documentTypes =>
                    setActiveFolders({ documentTypes })
                }>
                {documentTypes.map(documentType => (
                    <PublicationFolder
                        key={documentType}
                        documentType={documentType}
                        publications={publications?.results}
                    />
                ))}
            </Accordion>

            <div id="select-version-portal" />
        </div>
    )
}

export const Packages = () => {
    const { moduleId, versionUUID } = useParams()

    const { data: version, isFetching: versionFetching } =
        usePublicationVersionsVersionUuidGet(String(versionUUID), {
            query: {
                enabled: !!versionUUID,
            },
        })

    const { data: environment, isFetching: environmentFetching } =
        usePublicationEnvironmentsEnvironmentUuidGet(
            String(version?.Publication.Environment_UUID),
            {
                query: {
                    enabled: !!version?.Publication.Environment_UUID,
                },
            }
        )

    const { data: validActPackage } = usePublicationActPackagesGet(
        {
            version_uuid: version?.UUID,
            limit: 100,
        },
        {
            query: {
                enabled: !!version?.UUID,
                select: data =>
                    data.results.find(
                        pkg =>
                            pkg.Report_Status === ReportStatusType['valid'] &&
                            pkg.Package_Type === PackageType['publication']
                    ),
            },
        }
    )

    const { data: announcement, isFetching: announcementFetching } =
        usePublicationAnnouncementsGet(
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
        usePublicationAnnouncementPackagesGet(
            {
                announcement_uuid: announcement?.UUID,
                limit: 100,
            },
            {
                query: {
                    enabled: !!announcement?.UUID,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.Report_Status ===
                                    ReportStatusType['valid'] &&
                                pkg.Package_Type === PackageType['publication']
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
                    className="inline-flex text-s text-pzh-blue-500 underline hover:no-underline">
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
                {environment?.Can_Publicate && !!validActPackage && (
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
                            isDisabled={!!!announcement}
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
