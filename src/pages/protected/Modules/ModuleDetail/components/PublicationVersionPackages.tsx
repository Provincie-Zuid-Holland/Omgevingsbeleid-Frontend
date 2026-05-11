import {
    usePublicationActPackagesGetListActPackages,
    usePublicationAnnouncementPackagesGetListAnnouncementPackages,
    usePublicationAnnouncementsGetListAnnouncements,
    usePublicationEnvironmentsGetDetailEnvironment,
    usePublicationVersionsGetDetailVersion,
} from '@/api/fetchers'
import { PackageType, ReportStatusType } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import PublicationNotification from '@/components/Publications/PublicationNotification'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import useModule from '@/hooks/useModule'
import { Accordion } from '@pzh-ui/components'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PublicationVersionPackages = () => {
    const { versionUUID } = useParams()

    const { isClosed } = useModule()

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
                isClosed={isClosed}
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
                        isClosed={isClosed}
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
    )
}

export default PublicationVersionPackages
