import {
    usePublicationActPackagesGetDetailActPackage,
    usePublicationActReportsGetListActPackageReports,
    usePublicationAnnouncementPackagesGetDetailAnnouncementPackage,
    usePublicationAnnouncementReportsGetListAnnnouncementPackageReports,
} from '@/api/fetchers'
import {
    DocumentType,
    PackageType,
    PublicationType,
} from '@/api/fetchers.schemas'
import { LoaderContent } from '@/components/Loader'
import { useActions } from '@/components/Publications/PublicationPackages/components/actions'
import Report from '@/components/Publications/PublicationPackages/components/Report'
import { getPackageStatus } from '@/components/Publications/PublicationPackages/components/utils'
import MutateLayout from '@/templates/MutateLayout'
import { parseUtc } from '@/utils/parseUtc'
import {
    Button,
    formatDate,
    Heading,
    Hyperlink,
    Text,
} from '@pzh-ui/components'
import { ArrowDownToLine } from '@pzh-ui/icons'
import { Link, useParams } from 'react-router-dom'
import { config as providedConfig } from '../config'

const config = {
    title: 'Levering',
    ...providedConfig,
}

const PackageDetail = () => {
    const { type: publicationType, uuid } = useParams<{
        type: PublicationType
        uuid: string
    }>()

    if (!publicationType) return

    const useGetData =
        publicationType === 'act'
            ? usePublicationActPackagesGetDetailActPackage
            : usePublicationAnnouncementPackagesGetDetailAnnouncementPackage

    const useGetReports =
        publicationType === 'act'
            ? usePublicationActReportsGetListActPackageReports
            : usePublicationAnnouncementReportsGetListAnnnouncementPackageReports

    const { data, isLoading } = useGetData(String(uuid), {
        query: {
            enabled: !!uuid,
        },
    })

    const { data: reports } = useGetReports({
        ...(publicationType === 'act' && {
            act_package_uuid: uuid,
        }),
        ...(publicationType === 'announcement' && {
            announcement_package_uuid: uuid,
        }),
    })

    const { downloadPackage } = useActions({
        publicationType,
        publicationUUID: '',
        versionUUID:
            data && 'Publication_Version_UUID' in data
                ? data?.Publication_Version_UUID
                : undefined,
        announcementUUID: uuid,
        packageUUID: uuid,
    })

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Leveringen', path: '/muteer/leveringen' },
        { name: config.title, isCurrent: true },
    ]

    if (isLoading) return <LoaderContent />

    return (
        <MutateLayout
            title={config.title}
            breadcrumbs={breadcrumbPaths}
            className="gap-y-6">
            <div className="col-span-6">
                <Heading size="xxl">{config.title}</Heading>
            </div>

            <div className="col-span-3 flex flex-col gap-10">
                <div>
                    <Row label="Levering ID" value={data?.Delivery_ID} />
                    <Row
                        label="Module"
                        value={data?.Module_Title}
                        link={`/muteer/modules/${data?.Module_ID}/besluiten`}
                    />
                    <Row label="Omgeving" value={data?.Environment_Title} />
                    <Row
                        label="Instrument"
                        value={
                            config.documentType[
                                data?.Document_Type as DocumentType
                            ].label
                        }
                    />
                    <Row
                        label="Type"
                        value={
                            config.packageType[
                                data?.Package_Type as PackageType
                            ].label
                        }
                    />
                    <Row
                        label="Soort"
                        value={config.publicationType[publicationType].label}
                    />
                    <Row
                        label="Resultaat"
                        value={getPackageStatus(data?.Report_Status)?.text}
                    />
                    <Row
                        label="Gemaakt op"
                        value={
                            data?.Created_Date &&
                            formatDate(
                                parseUtc(data?.Created_Date),
                                "dd-MM-yyyy 'om' HH:mm"
                            )
                        }
                    />
                    <Row label="Bestandsnaam" value={data?.Zip.Filename} />
                </div>

                <div className="flex flex-wrap justify-between gap-4">
                    <Hyperlink asChild>
                        <Link
                            to={`/muteer/leveringen?environment=${data?.Environment_UUID}&module_id=${data?.Module_ID}`}>
                            Bekijk alle "{data?.Module_Title}" leveringen
                        </Link>
                    </Hyperlink>

                    <Button
                        onPress={() => downloadPackage.refetch()}
                        isLoading={downloadPackage.isFetching}
                        isDisabled={downloadPackage.isFetching}
                        icon={ArrowDownToLine}
                        iconSize={20}
                        className="self-start">
                        Download (.zip)
                    </Button>
                </div>
            </div>

            <div className="col-span-3 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Heading level="2" size="m">
                        Rapporten
                    </Heading>
                    <Button
                        variant="link"
                        iconSize={20}
                        className="text-pzh-green-500 hover:text-pzh-blue-500">
                        Upload rapporten
                    </Button>
                </div>
                <div className="border-pzh-gray-200 flex flex-col gap-2 rounded-sm border p-4">
                    {!!reports?.results.length ? (
                        reports.results.map(result => (
                            <Report
                                key={result.UUID}
                                publicationType={publicationType}
                                {...result}
                            />
                        ))
                    ) : (
                        <Text size="s" className="italic">
                            Geen rapporten gevonden voor deze levering.
                        </Text>
                    )}
                </div>
            </div>
        </MutateLayout>
    )
}

interface RowProps {
    label: string
    value?: string
    link?: string
}

const Row = ({ label, value, link }: RowProps) => (
    <div className="border-pzh-gray-200 grid grid-cols-4 gap-x-6 border-b py-2">
        <div className="col-span-1">
            <Text bold>{label}</Text>
        </div>
        <div className="col-span-3">
            {link ? (
                <Hyperlink asChild>
                    <Link to={link}>{value}</Link>
                </Hyperlink>
            ) : (
                <Text>{value}</Text>
            )}
        </div>
    </div>
)

export default PackageDetail
