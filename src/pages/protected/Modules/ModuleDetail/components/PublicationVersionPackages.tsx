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
            String(version?.publication.environment_id),
            {
                query: {
                    enabled: !!version?.publication.environment_id,
                },
            }
        )

    const { data: validActPackage } =
        usePublicationActPackagesGetListActPackages(
            {
                version_id: version?.id,
                package_type: PackageType['publication'],
                limit: 3,
                sort_column: 'created_date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!version?.id,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.report_status === ReportStatusType['valid']
                        ),
                },
            }
        )

    const { data: announcement, isFetching: announcementFetching } =
        usePublicationAnnouncementsGetListAnnouncements(
            {
                limit: 100,
                act_package_id: validActPackage?.id,
            },
            {
                query: {
                    enabled: !!validActPackage?.id,
                    select: data => data.results[0],
                },
            }
        )

    const { data: validAnnouncementPackage } =
        usePublicationAnnouncementPackagesGetListAnnouncementPackages(
            {
                announcement_id: announcement?.id,
                limit: 3,
                package_type: PackageType['publication'],
                sort_column: 'created_date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!announcement?.id,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.report_status === ReportStatusType['valid']
                        ),
                },
            }
        )

    const isDraft = version?.publication.procedure_type === 'draft'
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

        const billMetadata = version.bill_metadata as BillMetadata
        const billCompact = version.bill_compact as BillCompact

        const hasRequiredContent =
            !!billMetadata?.official_title?.trim() &&
            !!billMetadata?.quote_title?.trim() &&
            !!billCompact?.amendment_article?.trim()

        const hasRequiredDates =
            !!version.announcement_date &&
            !!version.procedural?.signed_date &&
            !!version.procedural?.procedural_announcement_date

        const hasEffectiveDate =
            version.publication.procedure_type !== 'final' ||
            !!version.effective_date

        const hasValidDateOrder =
            !version.announcement_date ||
            !version.effective_date ||
            new Date(version.announcement_date) <
                new Date(version.effective_date)

        return (
            hasRequiredContent &&
            hasRequiredDates &&
            hasEffectiveDate &&
            hasValidDateOrder
        )
    }, [version])

    const isLastStatus = useMemo(
        () => version?.module_status.id === lastStatus?.id,
        [version?.module_status.id, lastStatus?.id]
    )

    const procedureLabel =
        (version &&
            config.procedureType[
                version.publication.procedure_type as ProcedureType
            ]?.label) ||
        ''

    const showKennisgeving = isDraft && !!environment?.can_publicate
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
                publication={version?.publication}
                publicationType="act"
                isLocked={version.is_locked}
                isClosed={isClosed}
                actions={
                    <RegelingActions
                        publication={version.publication}
                        versionUUID={version.id}
                        procedureLabel={procedureLabel}
                        moduleStatus={version.module_status}
                        isPublished={isRegelingPublished}
                        requiredFieldsFilled={requiredFieldsFilled}
                        isLastStatus={isLastStatus}
                        isClosed={isClosed}
                        isLocked={version.is_locked}
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
                    publication={version?.publication}
                    publicationType="announcement"
                    validPublicationPackage={validActPackage}
                    announcement={announcement}
                    isDisabled={!!!announcement || !!validAnnouncementPackage}
                    isClosed={isClosed}
                    actions={
                        <KennisgevingActions
                            announcementId={announcement?.id}
                            actPackageId={validActPackage?.id}
                            isRegelingPublished={isRegelingPublished}
                            isPublished={isKennisgevingPublished}
                            isClosed={isClosed}
                            isLocked={announcement?.is_locked}
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
