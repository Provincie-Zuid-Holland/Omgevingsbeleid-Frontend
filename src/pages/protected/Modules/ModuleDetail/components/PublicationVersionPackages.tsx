import { useEffect, useMemo, useRef, useState } from 'react'

import { Accordion } from '@pzh-ui/components'

import { useParams } from 'react-router-dom'

import {
    usePublicationActPackagesGetListActPackages,
    usePublicationAnnouncementPackagesGetListAnnouncementPackages,
    usePublicationAnnouncementsGetListAnnouncements,
    usePublicationEnvironmentsGetDetailEnvironment,
    usePublicationVersionsGetDetailVersion,
} from '@/api/fetchers'
import {
    BillCompact,
    BillMetadata,
    PackageType,
    ProcedureType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import PublicationNotification from '@/components/Publications/PublicationNotification'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import useModule from '@/hooks/useModule'
import { useModuleStatusData } from '@/hooks/useModuleStatusData'
import { config } from '@/pages/protected/Packages/config'

import KennisgevingActions from './KennisgevingActions'
import RegelingActions from './RegelingActions'

const PublicationVersionPackages = () => {
    const { moduleId, versionUUID } = useParams()

    const { isClosed } = useModule()

    const { lastStatus } = useModuleStatusData(moduleId)

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

    const isDraft = version?.Publication.Procedure_Type === 'draft'
    const isRegelingPublished = !!validActPackage
    const isKennisgevingPublished = !!validAnnouncementPackage

    /**
     * Mirrors the backend's PublicationVersionValidator (Draft/FinalValidated
     * models), which both "Maak levering" and "Export PDF" are guarded by:
     * Announcement_Date, Procedural.Signed_Date and
     * Procedural.Procedural_Announcement_Date are all required (not just
     * one of them), and Effective_Date is additionally required once the
     * procedure is final. Deliberately excludes the backend's "date must be
     * in the future" refinement, which only applies while editing and would
     * otherwise mark an already-published besluit as incomplete once its
     * dates are in the past.
     */
    const requiredFieldsFilled = useMemo(() => {
        if (!version) return false

        const billMetadata = version.Bill_Metadata as BillMetadata
        const billCompact = version.Bill_Compact as BillCompact

        const hasRequiredContent =
            !!billMetadata?.Official_Title?.trim() &&
            !!billMetadata?.Quote_Title?.trim() &&
            !!billCompact?.Amendment_Article?.trim()

        const hasRequiredDates =
            !!version.Announcement_Date &&
            !!version.Procedural?.Signed_Date &&
            !!version.Procedural?.Procedural_Announcement_Date

        const hasEffectiveDate =
            version.Publication.Procedure_Type !== 'final' ||
            !!version.Effective_Date

        const hasValidDateOrder =
            !version.Announcement_Date ||
            !version.Effective_Date ||
            new Date(version.Announcement_Date) <
                new Date(version.Effective_Date)

        return (
            hasRequiredContent &&
            hasRequiredDates &&
            hasEffectiveDate &&
            hasValidDateOrder
        )
    }, [version])

    const isLastStatus = useMemo(
        () => version?.Module_Status.ID === lastStatus?.ID,
        [version?.Module_Status.ID, lastStatus?.ID]
    )

    const procedureLabel =
        (version &&
            config.procedureType[
                version.Publication.Procedure_Type as ProcedureType
            ]?.label) ||
        ''

    const showKennisgeving = isDraft && !!environment?.Can_Publicate
    const hasAnnouncement = showKennisgeving && !!announcement

    const [activeItems, setActiveItems] = useState<string[]>(['act'])
    const autoOpenedItems = useRef(new Set<string>())

    /**
     * Auto-expands a section the first time it becomes relevant, without
     * reopening a section the user has manually collapsed since.
     */
    useEffect(() => {
        setActiveItems(current => {
            const next = new Set(current)

            if (
                hasAnnouncement &&
                !autoOpenedItems.current.has('announcement')
            ) {
                next.add('announcement')
                autoOpenedItems.current.add('announcement')
            }

            return Array.from(next)
        })
    }, [hasAnnouncement])

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
                actions={
                    <RegelingActions
                        publication={version.Publication}
                        versionUUID={version.UUID}
                        procedureLabel={procedureLabel}
                        moduleStatus={version.Module_Status}
                        isPublished={isRegelingPublished}
                        requiredFieldsFilled={requiredFieldsFilled}
                        isLastStatus={isLastStatus}
                        isClosed={isClosed}
                        isLocked={version.Is_Locked}
                    />
                }
            />

            {isRegelingPublished && (
                <PublicationNotification
                    publicationType="act"
                    version={version}
                    announcement={announcement}
                />
            )}

            {showKennisgeving && (
                <PublicationPackages
                    environment={environment}
                    version={version}
                    publication={version?.Publication}
                    publicationType="announcement"
                    validPublicationPackage={validActPackage}
                    announcement={announcement}
                    isDisabled={!!!announcement || !!validAnnouncementPackage}
                    isClosed={isClosed}
                    actions={
                        <KennisgevingActions
                            announcementUuid={announcement?.UUID}
                            actPackageUuid={validActPackage?.UUID}
                            isRegelingPublished={isRegelingPublished}
                            isPublished={isKennisgevingPublished}
                            isClosed={isClosed}
                            isLocked={announcement?.Is_Locked}
                        />
                    }
                />
            )}

            {isKennisgevingPublished && (
                <PublicationNotification
                    publicationType="announcement"
                    version={version}
                    announcement={announcement}
                />
            )}
        </Accordion>
    )
}

export default PublicationVersionPackages
