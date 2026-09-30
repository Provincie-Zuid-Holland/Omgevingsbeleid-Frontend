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
    UUID,
    Created_Date,
    Zip,
    Report_Status,
    isLocked,
    publicationUUID,
    versionUUID,
    announcementUUID,
    environmentUUID,
    canPublicate,
    Package_Type,
    moduleStatus,
}: PackageProps) => {
    const navigate = useNavigate()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { downloadPackage } = useActions({
        publicationType,
        packageType: Package_Type as PackageType,
        publicationUUID,
        versionUUID,
        announcementUUID,
        packageUUID: UUID,
    })

    const createdDate = useMemo(
        () => formatDate(parseUtc(Created_Date), "dd-MM-yyyy 'om' HH:mm"),

        [Created_Date]
    )

    const downloadDate = useMemo(
        () =>
            Zip.Latest_Download_Date
                ? formatDate(parseUtc(Zip.Latest_Download_Date), 'dd-MM-yyyy')
                : null,

        [Zip.Latest_Download_Date]
    )

    const moduleStatusDate = useMemo(
        () =>
            moduleStatus
                ? formatDate(
                      parseUtc(moduleStatus.Created_Date),
                      "dd-MM-yyyy 'om' HH:mm"
                  )
                : null,
        [moduleStatus]
    )

    const {
        icon: StatusIcon,
        className: statusIconClassName,
        label: statusLabel,
    } = useMemo(() => getPackageStatusIcon(Report_Status), [Report_Status])

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
                        {moduleStatus.Status} ({moduleStatusDate})
                    </Text>
                </div>
            )}

            {!!!Zip.Latest_Download_Date ? (
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
                        {!isLocked && canPublicate && (
                            <Button
                                variant="default"
                                className="group/upload flex items-center gap-2"
                                onPress={() =>
                                    setActiveModal(
                                        'publicationPackageReportUpload',
                                        {
                                            packageUUID: UUID,
                                            publicationType,
                                            publicationUUID,
                                            announcementUUID,
                                            environmentUUID,
                                            packageType:
                                                Package_Type as PackageType,
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
                                    `/muteer/leveringen/${publicationType}/${UUID}`
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
