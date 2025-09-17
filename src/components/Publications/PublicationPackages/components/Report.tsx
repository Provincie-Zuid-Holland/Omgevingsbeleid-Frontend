import {
    PublicationActPackageReportShort,
    PublicationAnnouncementPackageReportShort,
    PublicationType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { parseUtc } from '@/utils/parseUtc'
import { Button, cn, formatDate, Text } from '@pzh-ui/components'
import {
    CircleCheckSolid,
    CircleXmark,
    ClockRotateLeft,
    Download,
    File,
} from '@pzh-ui/icons'
import { useActions } from './actions'

interface ReportProps {
    publicationType: PublicationType
}

type ReportData =
    | PublicationActPackageReportShort
    | PublicationAnnouncementPackageReportShort

const statusStyles: Record<ReportStatusType, string> = {
    valid: 'border-pzh-green-500 bg-pzh-green-10 text-pzh-green-500',
    failed: 'border-pzh-red-500 bg-pzh-red-10 text-pzh-red-500',
    pending: 'border-pzh-blue-500 text-pzh-blue-500',
    not_applicable: 'border-pzh-blue-500 text-pzh-blue-500',
}

const statusIcons: Record<ReportStatusType, JSX.Element> = {
    valid: (
        <CircleCheckSolid
            size={22}
            className="text-pzh-green-500 min-w-[22px]"
        />
    ),
    failed: <CircleXmark size={22} className="text-pzh-red-500 min-w-[22px]" />,
    pending: (
        <ClockRotateLeft size={22} className="text-pzh-blue-500 min-w-[22px]" />
    ),
    not_applicable: <></>,
}

const Report = ({
    publicationType,
    Created_Date,
    Filename,
    Report_Status,
    UUID,
}: ReportProps & ReportData) => {
    if (!publicationType) return null

    const { downloadReport } = useActions({
        publicationType,
        publicationUUID: '',
        reportUUID: UUID,
    })

    const status = Report_Status as ReportStatusType

    return (
        <div className="flex w-full flex-wrap items-center gap-2">
            <div
                className={cn(
                    'flex w-full min-w-0 flex-1 flex-wrap items-center justify-between gap-6 rounded-sm border px-4 py-2',
                    statusStyles[status]
                )}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <File size={20} className="min-w-[20px]" />
                    <Text
                        bold
                        className="truncate text-inherit"
                        title={Filename}>
                        {Filename}
                    </Text>
                </div>

                <div className="text-pzh-gray-800 mt-2 flex flex-shrink-0 items-center gap-4 sm:mt-0">
                    <Text className="text-[12px] leading-normal whitespace-nowrap">
                        {status === 'valid' ? 'Goedgekeurd' : 'Gefaald'} op{' '}
                        {formatDate(
                            parseUtc(Created_Date),
                            "dd-MM-yyyy 'om' HH:mm"
                        )}
                    </Text>
                    {statusIcons[status]}
                </div>
            </div>

            <Button
                variant="default"
                onPress={() => downloadReport.refetch()}
                isDisabled={downloadReport.isFetching}>
                <Download
                    size={22}
                    className="text-pzh-blue-500 min-w-[22px]"
                />
            </Button>
        </div>
    )
}

export default Report
