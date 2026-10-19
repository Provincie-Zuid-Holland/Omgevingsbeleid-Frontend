import { Button, formatDate, Text } from '@pzh-ui/components'
import {
    CircleCheckSolid,
    CircleXmark,
    ClockRotateLeft,
    Download,
} from '@pzh-ui/icons'

import {
    PublicationActPackageReportShort,
    PublicationAnnouncementPackageReportShort,
    PublicationType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { parseUtc } from '@/utils/parseUtc'

import { useActions } from './actions'

interface ReportProps {
    publicationType: PublicationType
}

type ReportData =
    PublicationActPackageReportShort | PublicationAnnouncementPackageReportShort

const statusIcons: Record<ReportStatusType, React.JSX.Element> = {
    valid: (
        <CircleCheckSolid
            size={22}
            className="min-w-[22px] text-pzh-green-500"
        />
    ),
    failed: <CircleXmark size={22} className="min-w-[22px] text-pzh-red-500" />,
    pending: (
        <ClockRotateLeft size={22} className="min-w-[22px] text-pzh-blue-500" />
    ),
    not_applicable: <></>,
    aborted: (
        <CircleXmark size={22} className="min-w-[22px] text-pzh-red-500" />
    ),
}

const Report = ({
    publicationType,
    Created_Date,
    Filename,
    Report_Status,
    UUID,
}: ReportProps & ReportData) => {
    const { downloadReport } = useActions({
        publicationType,
        publicationUUID: '',
        reportUUID: UUID,
    })

    const status = Report_Status as ReportStatusType

    return (
        <div className="flex w-full min-w-0 flex-1 flex-wrap items-center justify-between gap-2 rounded-sm border border-pzh-gray-300 px-4 py-2">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                {statusIcons[status]}

                <Text
                    bold
                    className="truncate"
                    title={Filename}
                    color="text-pzh-blue-500">
                    {Filename}
                </Text>
            </div>

            <Text className="text-s leading-normal whitespace-nowrap">
                {status === 'valid' ? 'Goedgekeurd' : 'Gefaald'} op{' '}
                {formatDate(parseUtc(Created_Date), "dd-MM-yyyy 'om' HH:mm")}
            </Text>

            <Button
                variant="default"
                onPress={() => downloadReport.refetch()}
                isDisabled={downloadReport.isFetching}>
                <Download
                    size={22}
                    className="min-w-[22px] text-pzh-blue-500"
                />
            </Button>
        </div>
    )
}

export default Report
