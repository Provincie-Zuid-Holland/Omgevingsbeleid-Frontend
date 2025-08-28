import {
    usePublicationEnvironmentsGetListEnvironments,
    usePublicationPackagesGetListUnifiedPackages,
} from '@/api/fetchers'
import {
    DocumentType,
    PackageType,
    PublicationType,
    ReportStatusType,
    SortOrder,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { getPackageStatus } from '@/components/Publications/PublicationPackages/components/utils'
import MutateLayout from '@/templates/MutateLayout'
import {
    Divider,
    formatDate,
    Heading,
    TabItem,
    Table,
    TableProps,
    Tabs,
    Tag,
    Text,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { config as providedConfig } from '../config'
import Filter, { type Filter as FilterState } from './components/Filter'
import PendingPackages from './components/PendingPackages'

const PAGE_LIMIT = 20
const config = { title: 'Leveringen', plural: 'leveringen', ...providedConfig }

const PackagesOverview = () => {
    const { data: environments } =
        usePublicationEnvironmentsGetListEnvironments(
            { is_active: true },
            {
                query: {
                    select: data => data.results.filter(s => s.Can_Publicate),
                },
            }
        )

    // -------------------------------
    // State
    // -------------------------------
    const [activeEnv, setActiveEnv] = useState<string | null>(null)
    const [filter, setFilter] = useState<FilterState>({})
    const [sorting, setSorting] = useState([{ id: 'Created_Date', desc: true }])

    // -------------------------------
    // Initialize from URL on mount
    // -------------------------------
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const env = params.get('environment') || environments?.[0]?.UUID || null
        setActiveEnv(env)
        setFilter({
            publication_type:
                (params.get('publication_type') as PublicationType) ||
                undefined,
            document_type:
                (params.get('document_type') as DocumentType) || undefined,
            package_type:
                (params.get('package_type') as PackageType) || undefined,
            report_status:
                (params.get('report_status') as ReportStatusType) || undefined,
            module_id: params.get('module_id')
                ? parseInt(params.get('module_id')!)
                : undefined,
        })
        setSorting([
            {
                id: params.get('sort_column') || 'Created_Date',
                desc: params.get('sort_order') === 'DESC',
            },
        ])
    }, [environments])

    // -------------------------------
    // Sync URL whenever state changes
    // -------------------------------
    useEffect(() => {
        if (!activeEnv) return

        const params = new URLSearchParams()
        params.set('environment', activeEnv)

        Object.entries(filter).forEach(([key, value]) => {
            if (value != null) params.set(key, String(value))
        })

        if (sorting[0]) {
            params.set('sort_column', sorting[0].id)
            params.set('sort_order', sorting[0].desc ? 'DESC' : 'ASC')
        }

        window.history.replaceState(
            null,
            '',
            `${window.location.pathname}?${params.toString()}`
        )
    }, [activeEnv, filter, sorting])

    // -------------------------------
    // Listen to back/forward browser buttons
    // -------------------------------
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search)
            setActiveEnv(
                params.get('environment') || environments?.[0]?.UUID || null
            )
            setFilter({
                publication_type:
                    (params.get('publication_type') as PublicationType) ||
                    undefined,
                document_type:
                    (params.get('document_type') as DocumentType) || undefined,
                package_type:
                    (params.get('package_type') as PackageType) || undefined,
                report_status:
                    (params.get('report_status') as ReportStatusType) ||
                    undefined,
                module_id: params.get('module_id')
                    ? parseInt(params.get('module_id')!)
                    : undefined,
            })
            setSorting([
                {
                    id: params.get('sort_column') || 'Created_Date',
                    desc: params.get('sort_order') === 'DESC',
                },
            ])
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [environments])

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

            <div className="col-span-6">
                {!!environments?.length && (
                    <Tabs
                        variant="filled"
                        className="place-self-center"
                        selectedKey={activeEnv ?? undefined}
                        onSelectionChange={val => setActiveEnv(val as string)}>
                        {environments.map(env => (
                            <TabItem key={env.UUID} title={env.Title}>
                                {activeEnv === env.UUID && (
                                    <div className="mt-6 flex flex-col gap-y-6">
                                        <PendingPackages
                                            {...env}
                                            setFilter={setFilter}
                                        />
                                        <Divider />
                                        <div
                                            className="flex flex-col gap-y-6"
                                            id="packages-list">
                                            <Heading level="2" size="xl">
                                                {config.title} ({env.Title})
                                            </Heading>
                                            <Overview
                                                environmentUuid={env.UUID}
                                                filter={filter}
                                                setFilter={setFilter}
                                                sorting={sorting}
                                                setSorting={setSorting}
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabItem>
                        ))}
                    </Tabs>
                )}
            </div>
        </MutateLayout>
    )
}

interface OverviewProps {
    environmentUuid: string
    filter: FilterState
    setFilter: React.Dispatch<React.SetStateAction<FilterState>>
    sorting: { id: string; desc: boolean }[]
    setSorting: React.Dispatch<
        React.SetStateAction<{ id: string; desc: boolean }[]>
    >
}

const Overview = ({
    environmentUuid,
    filter,
    setFilter,
    sorting,
    setSorting,
}: OverviewProps) => {
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const initialPage = Number(urlParams.get('page') || 1)
    const [pageIndex, setPageIndex] = useState(initialPage)

    const sortColumn = sorting[0]?.id || 'Created_Date'
    const sortOrder: SortOrder = sorting[0]?.desc ? 'DESC' : 'ASC'

    const { data: packages, isFetching } =
        usePublicationPackagesGetListUnifiedPackages(
            {
                limit: PAGE_LIMIT,
                offset: (pageIndex - 1) * PAGE_LIMIT,
                sort_column: sortColumn,
                sort_order: sortOrder,
                environment_uuid: environmentUuid,
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

    // Reset page when environment or filters change
    useEffect(() => setPageIndex(1), [environmentUuid, filter])

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

    const formattedData = useMemo(
        () =>
            packages?.results.map(
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
                            {getPackageStatus(Report_Status)?.text}
                            <AngleRight size={20} />
                        </span>
                    ),
                    onClick: () =>
                        navigate(
                            `/muteer/${config.plural}/${Publication_Type}/${UUID}`
                        ),
                })
            ) || [],
        [packages?.results, navigate]
    )

    // -------------------------------
    // Handlers
    // -------------------------------
    const handlePagination: TableProps['onPaginationChange'] =
        updaterOrValue => {
            setPageIndex(prev =>
                typeof updaterOrValue === 'function'
                    ? updaterOrValue({ pageIndex: prev, pageSize: PAGE_LIMIT })
                          .pageIndex
                    : updaterOrValue.pageIndex
            )
        }

    const handleSortingChange: TableProps['onSortingChange'] =
        updaterOrValue => {
            setSorting(prev =>
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(prev)
                    : updaterOrValue
            )
        }

    const handleFilter = (newFilter: FilterState) => {
        setFilter(prev => ({ ...prev, ...newFilter }))
        setPageIndex(1)
    }

    return (
        <>
            <div className="mb-6">
                <Filter filter={filter} setFilter={handleFilter} />
                {filter.module_id && packages?.Module_Title && (
                    <>
                        <Text size="s" className="mr-2 inline-block">
                            Module:{' '}
                        </Text>
                        <Tag
                            text={packages.Module_Title}
                            onClick={() =>
                                setFilter(prev => ({
                                    ...prev,
                                    module_id: undefined,
                                }))
                            }
                            className="mt-2"
                        />
                    </>
                )}
            </div>

            <Table
                columns={columns}
                data={formattedData}
                enableSortingRemoval={false}
                enableMultiSort={false}
                limit={PAGE_LIMIT}
                total={packages?.total}
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
