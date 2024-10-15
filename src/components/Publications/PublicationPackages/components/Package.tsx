import { Badge, BadgeProps, Button, formatDate, Text } from '@pzh-ui/components'
import {
    ArrowDownToLine,
    ArrowUpRightFromSquareLight,
    Check,
    EyeLight,
} from '@pzh-ui/icons'
import { useMemo } from 'react'

import { PublicationPackage } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

import { PublicationType } from '../../types'
import { useActions } from './actions'
import { getIndicatorClass } from './utils'

interface PackageProps extends PublicationPackage {
    publicationType: PublicationType
    publicationUUID: string
    versionUUID: string
    announcementUUID?: string
    isLocked?: boolean
    canPublicate?: boolean
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
    canPublicate,
}: PackageProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { downloadPackage } = useActions({
        publicationType,
        publicationUUID,
        versionUUID,
        announcementUUID,
        packageUUID: UUID,
    })

    const createdDate = useMemo(
        () => formatDate(new Date(Created_Date), 'dd-MM-yyyy'),

        [Created_Date]
    )

    const downloadDate = useMemo(
        () =>
            Zip.Latest_Download_Date
                ? formatDate(new Date(Zip.Latest_Download_Date), 'dd-MM-yyyy')
                : null,

        [Zip.Latest_Download_Date]
    )

    const indicatorClass = useMemo(
        () => getIndicatorClass(Report_Status !== 'pending'),
        [Report_Status]
    )

    const status = useMemo((): BadgeProps | undefined => {
        switch (Report_Status) {
            case 'pending':
                return {
                    text: 'In afwachting',
                    variant: 'yellow',
                }
            case 'valid':
                return {
                    text: 'Goedgekeurd',
                    variant: 'green',
                }
            case 'failed':
                return {
                    text: 'Gefaald',
                    variant: 'red',
                }
        }
    }, [Report_Status])

    return (
        <div className="flex items-center justify-between border-b border-pzh-gray-200 px-6 py-3 last:border-b-0">
            <div className="flex items-center gap-4">
                <div className={indicatorClass}>
                    {Report_Status !== 'pending' && (
                        <Check className="text-pzh-white" size={11} />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Text
                        bold
                        className="heading-s -mb-1"
                        color="text-pzh-blue-500">
                        Levering gemaakt op {createdDate}
                    </Text>
                    {status && <Badge solid upperCase={false} {...status} />}
                </div>
            </div>
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
