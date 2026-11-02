import { useState } from 'react'

import {
    Button,
    formatDate,
    Heading,
    Hyperlink,
    Pagination,
    Text,
} from '@pzh-ui/components'
import { ArrowDownToLine } from '@pzh-ui/icons'

import { Link, useParams } from 'react-router-dom'

import {
    DocumentType,
    PackageType,
    PublicationType,
} from '@/api/fetchers.schemas'
import { LoaderContent } from '@/components/Loader'
import { useActions } from '@/components/Publications/PublicationPackages/components/actions'
import Report from '@/components/Publications/PublicationPackages/components/Report'
import { getPackageStatus } from '@/components/Publications/PublicationPackages/components/utils'
import usePackageDetailData from '@/hooks/usePackageDetailData'
import MutateLayout from '@/templates/MutateLayout'
import { parseUtc } from '@/utils/parseUtc'

import { config as providedConfig } from '../config'

const config = {
    title: 'Levering',
    ...providedConfig,
}

const PAGE_LIMIT = 10

const PackageDetail = () => {
    const { type, id } = useParams<{
        type: PublicationType
        id: string
    }>()

    if (!type || !id) return

    return <PackageDetailInner publicationType={type} id={id} />
}

const PackageDetailInner = ({
    publicationType,
    id,
}: {
    publicationType: PublicationType
    id: string
}) => {
    const [pageIndex, setPageIndex] = useState(1)

    const { data, isLoading, reports } = usePackageDetailData({
        publicationType,
        id,
        pageIndex,
        PAGE_LIMIT,
    })

    const { downloadPackage } = useActions({
        publicationType,
        publicationUUID: '',
        versionUUID:
            data && 'publication_version_id' in data
                ? data?.publication_version_id
                : undefined,
        announcementUUID: id,
        packageUUID: id,
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
                    <Row label="Levering ID" value={data?.delivery_id} />
                    <Row
                        label="Module"
                        value={data?.module_title}
                        link={`/muteer/modules/${data?.module_id}/besluiten`}
                    />

                    <Row label="Omgeving" value={data?.environment_title} />
                    <Row
                        label="Instrument"
                        value={
                            config.documentType[
                                data?.document_type as DocumentType
                            ].label
                        }
                    />
                    <Row
                        label="Type"
                        value={
                            config.packageType[
                                data?.package_type as PackageType
                            ].label
                        }
                    />
                    <Row
                        label="Soort"
                        value={config.publicationType[publicationType].label}
                    />
                    <Row
                        label="Resultaat"
                        value={getPackageStatus(data?.report_status)?.text}
                    />
                    <Row
                        label="Gemaakt op"
                        value={
                            data?.created_date &&
                            formatDate(
                                parseUtc(data?.created_date),
                                "dd-MM-yyyy 'om' HH:mm"
                            )
                        }
                    />

                    <Row label="Bestandsnaam" value={data?.zip.filename} />
                </div>

                <div className="flex flex-wrap justify-between gap-4">
                    <Hyperlink asChild>
                        <Link
                            to={`/muteer/leveringen?environment=${data?.environment_id}&module_id=${data?.module_id}`}>
                            Bekijk alle "{data?.module_title}" leveringen
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
                    {/* <Button
            variant="link"
            iconSize={20}
            className="text-pzh-green-500 hover:text-pzh-blue-500">
            Upload rapporten
            </Button> */}
                </div>
                <div className="flex flex-col gap-2 rounded-sm border border-pzh-gray-200 p-4">
                    <Heading level="3" size="s" className="mb-2 text-center">
                        Levering ({data?.delivery_id})
                    </Heading>
                    {reports?.results.length ? (
                        <>
                            <div className="flex flex-col gap-2">
                                {reports.results.map(result => (
                                    <Report
                                        key={result.id}
                                        publicationType={publicationType}
                                        {...result}
                                    />
                                ))}
                            </div>
                            {!!reports?.total &&
                                reports?.limit &&
                                reports.total > reports.limit && (
                                    <div className="mt-4 flex justify-center">
                                        <Pagination
                                            onPageChange={setPageIndex}
                                            current={pageIndex}
                                            total={reports.total}
                                            limit={reports.limit}
                                        />
                                    </div>
                                )}
                        </>
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
    value?: string | null
    link?: string
}

const Row = ({ label, value, link }: RowProps) => (
    <div className="grid grid-cols-4 gap-x-6 border-b border-pzh-gray-200 py-2">
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
