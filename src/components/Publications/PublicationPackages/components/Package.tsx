import { useMemo } from 'react'

import { Button, formatDate, Text, Tooltip } from '@pzh-ui/components'
import {
    ArrowDownToLine,
    ArrowUpRightFromSquareLight,
    EyeLight,
} from '@pzh-ui/icons'

import { useNavigate } from 'react-router-dom'

import {
    ModuleStatus,
    PackageType,
    PublicationPackage,
} from '@/api/fetchers.schemas'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import { parseUtc } from '@/utils/parseUtc'

import { PublicationType } from '../../types'
import { useActions } from './actions'
import { getPackageStatusIcon } from './utils'

interface PackageProps extends PublicationPackage {
    publicationType: PublicationType
    publicationUUID: string
    versionUUID: string
    announcementUUID?: string
    environmentUUID?: string
    isLocked?: boolean
    canPublicate?: boolean
    /** Module status the version is based on. Only shown for act (regeling) deliveries. */
    moduleStatus?: ModuleStatus
}

const Package = ({
    publicationType,
    id,
    created_date,
    zip,
    report_status,
    isLocked,
    publicationUUID,
    versionUUID,
    announcementUUID,
    environmentUUID,
    canPublicate,
    package_type,
    moduleStatus,
}: PackageProps) => {
    const navigate = useNavigate()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
        canUploadPublicationActPackageReport,
        canUploadPublicationAnnouncementPackageReport,
    } = usePermissions()

    const { downloadPackage } = useActions({
        publicationType,
        packageType: package_type as PackageType,
        publicationUUID,
        versionUUID,
        announcementUUID,
        packageUUID: id,
    })

    const createdDate = useMemo(
        () => formatDate(parseUtc(created_date), "dd-MM-yyyy 'om' HH:mm"),

        [created_date]
    )

    const downloadDate = useMemo(
        () =>
            zip.latest_download_date
                ? formatDate(parseUtc(zip.latest_download_date), 'dd-MM-yyyy')
                : null,

        [zip.latest_download_date]
    )

    const moduleStatusDate = useMemo(
        () =>
            moduleStatus
                ? formatDate(
                      parseUtc(moduleStatus.created_date),
                      "dd-MM-yyyy 'om' HH:mm"
                  )
                : null,
        [moduleStatus]
    )

    const {
        icon: StatusIcon,
        className: statusIconClassName,
        label: statusLabel,
    } = useMemo(() => getPackageStatusIcon(report_status), [report_status])

    const canUploadReports =
        !isLocked &&
        canPublicate &&
        (publicationType === 'act'
            ? canUploadPublicationActPackageReport
            : canUploadPublicationAnnouncementPackageReport)

    return (
        <div className="flex items-center justify-between gap-4 border-b border-pzh-gray-200 px-6 py-3 last:border-b-0">
            <div className="flex items-center gap-4">
                <Tooltip
                    label={
                        <Text size="s" color="text-pzh-white">
                            {statusLabel}
                        </Text>
                    }>
                    <StatusIcon
                        size={20}
                        className={`${statusIconClassName} shrink-0`}
                        role="img"
                        aria-label={statusLabel}
                    />
                </Tooltip>
                <Text
                    bold
                    className="heading-s -mb-1"
                    color="text-pzh-blue-500">
                    Gemaakt op {createdDate}
                </Text>
            </div>

            {!!moduleStatus && (
                <div className="mr-auto">
                    <Text size="s" color="text-pzh-blue-500">
                        Gebaseerd op modulestatus
                    </Text>
                    <Text size="s" bold color="text-pzh-blue-500">
                        {moduleStatus.status} ({moduleStatusDate})
                    </Text>
                </div>
            )}

            {!zip.latest_download_date ? (
                <Button
                    size="small"
                    variant="cta"
                    onPress={() => downloadPackage.refetch()}
                    isLoading={downloadPackage.isFetching}
                    isDisabled={downloadPackage.isFetching}>
                    Download levering
                </Button>
            ) : (
                <div className="flex items-center gap-4">
                    <div>
                        <Text size="s">Gedownload op {downloadDate}</Text>
                        {canUploadReports && (
                            <Button
                                variant="default"
                                className="group/upload flex items-center gap-2"
                                onPress={() =>
                                    setActiveModal(
                                        'publicationPackageReportUpload',
                                        {
                                            packageUUID: id,
                                            publicationType,
                                            publicationUUID,
                                            announcementUUID,
                                            environmentUUID,
                                            packageType:
                                                package_type as PackageType,
                                        }
                                    )
                                }>
                                <Text
                                    size="s"
                                    className="leading-none underline group-hover/upload:no-underline"
                                    color="text-pzh-green-500">
                                    Upload rapporten
                                </Text>

                                <ArrowUpRightFromSquareLight
                                    size={14}
                                    className="-mt-0.5 text-pzh-green-500"
                                />
                            </Button>
                        )}
                    </div>
                    {canPublicate && (
                        <Button
                            variant="secondary"
                            size="small"
                            icon={EyeLight}
                            aria-label="Bekijk levering"
                            onPress={() =>
                                navigate(
                                    `/muteer/leveringen/${publicationType}/${id}`
                                )
                            }
                        />
                    )}
                    <Button
                        variant="secondary"
                        size="small"
                        icon={canPublicate ? ArrowDownToLine : undefined}
                        onPress={() => downloadPackage.refetch()}
                        isLoading={downloadPackage.isFetching}
                        isDisabled={downloadPackage.isFetching}
                        aria-label="Download levering">
                        {!canPublicate ? 'Download levering' : null}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Package
