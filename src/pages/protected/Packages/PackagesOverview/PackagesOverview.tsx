import { usePublicationPackagesGetListUnifiedPackages } from '@/api/fetchers'
import {
    DocumentType,
    PackageType,
    PublicationType,
    ReportStatusType,
    SortOrder,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { getStatus } from '@/components/Publications/PublicationPackages/components/utils'
import MutateLayout from '@/templates/MutateLayout'
import {
    Button,
    Divider,
    formatDate,
    Heading,
    Table,
    TableProps,
    Tag,
    Text,
} from '@pzh-ui/components'
import { AngleRight, ArrowUpToLine } from '@pzh-ui/icons'
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { config as providedConfig } from '../config'
import Filter from './components/Filter'

const PAGE_LIMIT = 20
const config = { title: 'Leveringen', plural: 'leveringen', ...providedConfig }

const PackagesOverview = () => {
    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: config.title, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={config.title}
            breadcrumbs={breadcrumbPaths}
            className="gap-y-6">
            <div className="col-span-6">
                <Heading size="xxl">{config.title}</Heading>
                <Text>Hieronder staat een overzicht van alle leveringen.</Text>
            </div>

            <div className="col-span-6 flex items-center justify-between">
                <Heading level="2" size="xl">
                    In afwachting
                </Heading>
                <Button variant="cta" icon={ArrowUpToLine} iconSize={20}>
                    Upload rapporten
                </Button>
            </div>

            <div className="col-span-6">
                <Divider />
            </div>

            <div className="col-span-6 flex flex-col gap-y-6">
                <Heading level="2" size="xl">
                    {config.title}
                </Heading>
                <Overview />
            </div>
        </MutateLayout>
    )
}

const Overview = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // -------------------------------
    // Hydrate state from URL once
    // -------------------------------
    const initialPage = Number(searchParams.get('page') || 1)
    const initialFilter: Filter = {
        publication_type:
            (searchParams.get('publication_type') as PublicationType) ||
            undefined,
        document_type:
            (searchParams.get('document_type') as DocumentType) || undefined,
        package_type:
            (searchParams.get('package_type') as PackageType) || undefined,
        report_status:
            (searchParams.get('report_status') as ReportStatusType) ||
            undefined,
        module_id: searchParams.get('module_id')
            ? parseInt(searchParams.get('module_id')!)
            : undefined,
    }

    const [pageIndex, setPageIndex] = useState(initialPage)
    const [filter, setFilter] = useState(initialFilter)
    const [sorting, setSorting] = useState([{ id: 'Created_Date', desc: true }])

    const sortColumn = sorting[0]?.id || 'Created_Date'
    const sortOrder: SortOrder = sorting[0]?.desc ? 'DESC' : 'ASC'

    // -------------------------------
    // Data fetching
    // -------------------------------
    const { data, isFetching } = usePublicationPackagesGetListUnifiedPackages(
        {
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
            sort_column: sortColumn,
            sort_order: sortOrder,
            ...filter,
        },
        {
            query: {
                placeholderData: keepPreviousData,
                select: data => ({
                    ...data,
                    ...(filter.module_id && {
                        Module_Title: data.results.find(
                            item => item.Module_ID === filter.module_id
                        )?.Module_Title,
                    }),
                }),
            },
        }
    )

    // -------------------------------
    // Sync URL on state change without jumping
    // -------------------------------
    const syncURL = () => {
        const params = new URLSearchParams(window.location.search)

        params.set('page', String(pageIndex))
        Object.entries(filter).forEach(([key, value]) => {
            if (value != null) params.set(key, String(value))
            else params.delete(key)
        })

        // Replace URL manually without triggering scroll
        window.history.replaceState(
            null,
            '',
            `${window.location.pathname}?${params.toString()}`
        )
    }

    // Call whenever filter or page changes
    useMemo(() => syncURL(), [pageIndex, filter])

    // -------------------------------
    // Table columns
    // -------------------------------
    const columns = useMemo(
        () => [
            { header: 'Module', accessorKey: 'Module_Title' },
            { header: 'Soort', accessorKey: 'Publication_Type' },
            { header: 'Instrument', accessorKey: 'Document_Type' },
            { header: 'Type', accessorKey: 'Package_Type' },
            { header: 'Gemaakt op', accessorKey: 'Created_Date' },
            { header: 'Status', accessorKey: 'Report_Status' },
        ],
        []
    )

    // -------------------------------
    // Format API results for table
    // -------------------------------
    const formattedData = useMemo(
        () =>
            data?.results.map(
                ({
                    Package_Type,
                    Publication_Type,
                    Document_Type,
                    Report_Status,
                    Created_Date,
                    UUID,
                    Module_Title,
                }) => ({
                    Module_Title: (
                        <Text bold color="text-pzh-blue-500" as="span">
                            {Module_Title}
                        </Text>
                    ),
                    Publication_Type:
                        config.publicationType[
                            Publication_Type as PublicationType
                        ].label,
                    Document_Type:
                        config.documentType[Document_Type as DocumentType]
                            .label,
                    Package_Type:
                        config.packageType[Package_Type as PackageType].label,
                    Created_Date: formatDate(
                        new Date(Created_Date + 'Z'),
                        'dd-MM-yyyy, p'
                    ),
                    Report_Status: (
                        <span className="flex items-center justify-between">
                            {getStatus(Report_Status)?.text}
                            <AngleRight size={20} />
                        </span>
                    ),
                    onClick: () =>
                        navigate(
                            `/muteer/${config.plural}/${Publication_Type}/${UUID}`
                        ),
                })
            ) || [],
        [data?.results, navigate]
    )

    // -------------------------------
    // Handlers
    // -------------------------------
    const handlePagination: TableProps['onPaginationChange'] =
        updaterOrValue => {
            const newPage =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue({ pageIndex, pageSize: PAGE_LIMIT })
                          .pageIndex
                    : updaterOrValue.pageIndex
            setPageIndex(newPage)
        }

    const handleSortingChange: TableProps['onSortingChange'] =
        updaterOrValue => {
            const newSorting =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(sorting)
                    : updaterOrValue
            setSorting(newSorting)
        }

    const handleFilter = (newFilter: Filter) => {
        setFilter(prev => ({ ...prev, ...newFilter }))
        setPageIndex(1)
    }

    return (
        <>
            <div className="mb-6">
                <Filter setFilter={handleFilter} />
                {filter.module_id && data?.Module_Title && (
                    <Tag
                        text={data.Module_Title}
                        onClick={() =>
                            setFilter(prev => ({
                                ...prev,
                                module_id: undefined,
                            }))
                        }
                        className="mt-2"
                    />
                )}
            </div>

            <Table
                columns={columns}
                data={formattedData}
                enableSortingRemoval={false}
                enableMultiSort={false}
                limit={PAGE_LIMIT}
                total={data?.total}
                current={pageIndex}
                onPaginationChange={handlePagination}
                state={{ sorting }}
                onSortingChange={handleSortingChange}
                manualSorting
                isLoading={isFetching}
            />

            {!isFetching && formattedData.length === 0 && (
                <span className="italic">
                    Er zijn geen leveringen gevonden.
                </span>
            )}
            {isFetching && (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
        </>
    )
}

export default PackagesOverview
