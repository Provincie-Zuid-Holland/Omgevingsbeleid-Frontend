import {
    usePublicationActPackagesGet,
    usePublicationAnnouncementPackagesGet,
} from '@/api/fetchers'
import MutateLayout from '@/templates/MutateLayout'
import { Button, Heading, Text } from '@pzh-ui/components'
import { ArrowUpToLine, Download, File as FileIcon } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

const config = {
    title: 'Levering',
}

const PackageDetail = () => {
    const { type, uuid } = useParams()

    const useGetData =
        type === 'act'
            ? usePublicationActPackagesGet
            : usePublicationAnnouncementPackagesGet

    const { data } = useGetData(
        {
            version_uuid: uuid,
        },
        {
            query: {
                enabled: !!uuid,
            },
        }
    )

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Leveringen', path: '/muteer/leveringen' },
        { name: config.title, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={config.title}
            breadcrumbs={breadcrumbPaths}
            className="gap-y-6">
            <div className="col-span-6">
                <Heading size="xxl">{config.title}</Heading>
            </div>

            <div className="col-span-3">
                <Row label="Levering ID" value="Placeholder" />
                <Row label="Module" value="Herziening 2025" />
                <Row label="Environment" value="Productie" />
                <Row label="Instrument" value="Visie" />
                <Row label="Type" value="Publicatie" />
                <Row label="Soort" value="Regeling" />
                <Row label="Resultaat" value="In afwachting" />
                <Row label="Gemaakt op" value="15-02-2025 om 12:05" />
            </div>

            <div className="col-span-3 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Heading level="2" size="m">
                        Rapporten
                    </Heading>
                    <Button variant="cta" icon={ArrowUpToLine} iconSize={20}>
                        Upload rapporten
                    </Button>
                </div>
                <div className="border-pzh-gray-200 flex flex-col gap-2 rounded-sm border p-4">
                    <Heading level="3" size="s" className="text-center">
                        Levering (ID)
                    </Heading>
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                    <File title="Rapport aX74_663234" />
                </div>
            </div>
        </MutateLayout>
    )
}

interface RowProps {
    label: string
    value: string
}

const Row = ({ label, value }: RowProps) => (
    <div className="border-pzh-gray-200 grid grid-cols-4 gap-x-6 border-b py-2">
        <div className="col-span-1">
            <Text bold>{label}</Text>
        </div>
        <div className="col-span-3">
            <Text>{value}</Text>
        </div>
    </div>
)

interface FileProps {
    title: string
}

const File = ({ title }: FileProps) => (
    <Button
        variant="default"
        className="border-pzh-gray-200 flex items-center justify-between rounded-sm border px-4 py-2">
        <div className="flex items-center gap-4">
            <FileIcon className="text-pzh-blue-500" size={20} />
            <Text bold color="text-pzh-blue-500">
                {title}
            </Text>
        </div>
        <Download className="text-pzh-blue-500" size={20} />
    </Button>
)

export default PackageDetail
