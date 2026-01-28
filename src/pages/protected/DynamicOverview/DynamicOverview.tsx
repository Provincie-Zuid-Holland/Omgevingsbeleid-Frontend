import {
    Button,
    Heading,
    TabItem,
    Table,
    Tabs,
    Text,
    formatDate,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useUpdateEffect } from '@react-hookz/web'
import { keepPreviousData } from '@tanstack/react-query'
import { KeyboardEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useModulesGetListModuleObjects } from '@/api/fetchers'
import { LoaderSpinner } from '@/components/Loader'
import SearchBar from '@/components/SearchBar'
import {
    Model,
    ModelReturnTypeBasic,
    ModelReturnTypeBasicUnion,
} from '@/config/objects/types'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import { parseUtc } from '@/utils/parseUtc'

const PAGE_LIMIT = 20

type TabType = 'valid' | 'latest'

interface DynamicOverviewProps {
    model: Model
}

const DynamicOverview = ({ model }: DynamicOverviewProps) => {
    const { canCreateModule } = usePermissions()

    const [activeTab, setActiveTab] = useState<TabType>('valid')
    const [query, setQuery] = useState('')

    const {
        atemporal,
        singularReadable,
        plural,
        pluralCapitalize,
        prefixNewObject,
    } = model.defaults

    const handleChange = (e: KeyboardEvent) => {
        const value = (e.target as HTMLInputElement).value

        if (!value) {
            setQuery('')
        }
    }

    const handleSearch = ({ query }: { query: string }) => {
        setQuery(query)
    }

    useUpdateEffect(() => {
        setQuery('')
    }, [plural])

    useUpdateEffect(() => {
        if (activeTab === 'latest') setQuery('')
    }, [activeTab])

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: pluralCapitalize || '', isCurrent: true },
    ]

    return (
        <MutateLayout title={pluralCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-6 flex items-center justify-between">
                    <Heading size="xxl">{pluralCapitalize}</Heading>
                    {atemporal && canCreateModule ? (
                        <Button asChild variant="cta">
                            <Link to={`/muteer/${plural}/nieuw`}>
                                {prefixNewObject} {singularReadable}
                            </Link>
                        </Button>
                    ) : (
                        <SearchBar
                            handleSubmit={handleSearch}
                            onKeyUp={handleChange}
                            className="w-auto min-w-[368px]"
                            placeholder="Zoeken in lijst"
                        />
                    )}
                </div>

                {atemporal ? (
                    <TabTable type="valid" activeTab="valid" model={model} />
                ) : (
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key => {
                            setActiveTab(key as typeof activeTab)
                            setQuery('')
                        }}>
                        <TabItem title="Vigerend" key="valid">
                            <TabTable
                                type="valid"
                                activeTab={activeTab}
                                model={model}
                                query={query}
                            />
                        </TabItem>
                        <TabItem title="In ontwerp" key="latest">
                            <TabTable
                                type="latest"
                                activeTab={activeTab}
                                model={model}
                                query={query}
                            />
                        </TabItem>
                    </Tabs>
                )}
            </div>
        </MutateLayout>
    )
}

interface TabTableProps {
    type: TabType
    activeTab: TabType
    model: Model
    query?: string
}

const TabTable = ({ type, activeTab, model, query }: TabTableProps) => {
    const navigate = useNavigate()
    const { canCreateModule } = usePermissions()

    const { atemporal, plural, pluralCapitalize, singular } = model.defaults
    const { useGetValid } = model.fetchers

    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })
    const [sortBy, setSortBy] = useState([
        {
            id: 'Title',
            desc: false,
        },
    ])

    /**
     * Get correct data fetcher based on type
     */
    const useGetData =
        type === 'valid' ? useGetValid : useModulesGetListModuleObjects

    const { data, isFetching } = useGetData(
        {
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
            sort_column: sortBy?.[0]?.id || 'Gebruikersnaam',
            sort_order: sortBy?.[0]?.desc ? 'DESC' : 'ASC',
            ...(type === 'latest' && {
                object_type: singular,
                actions: ['Create', 'Edit'],
            }),
            ...(!!query && {
                [type === 'valid' ? 'filter_title' : 'title']: `%${query}%`,
            }),
        },
        {
            query: {
                placeholderData: keepPreviousData,
                select: data => {
                    if (type === 'valid') return data

                    return {
                        ...data,
                        results: data.results.map(result =>
                            'Model' in result ? result.Model : result
                        ),
                    }
                },
                enabled:
                    type === 'valid'
                        ? atemporal || (activeTab === 'valid' && !atemporal)
                        : activeTab === 'latest' && !atemporal,
            },
        }
    )

    useUpdateEffect(() => {
        setPagination({
            pageIndex: 1,
            pageSize: PAGE_LIMIT,
        })
    }, [plural, query])

    /**
     * Setup Table columns
     */
    const columns = useMemo(
        () => [
            {
                header: 'Titel',
                accessorKey: 'Title',
            },
            ...((!atemporal && [
                {
                    header: 'Status',
                    accessorKey: 'Status',
                    enableSorting: false,
                },
            ]) ||
                []),
            {
                header: 'Laatst gewijzigd',
                accessorKey: 'Modified_Date',
            },
        ],
        [atemporal]
    )

    /**
     * Format data before passing to Table
     */
    const formattedData = useMemo(
        () =>
            (
                data?.results as (
                    | ModelReturnTypeBasic
                    | ModelReturnTypeBasicUnion
                )[]
            )?.map(props => {
                const { Title, Modified_Date, Object_ID } =
                    'Model' in props ? props.Model : props

                return {
                    Title: (
                        <Text bold color="text-pzh-blue-500">
                            {Title}
                        </Text>
                    ),
                    ...(!atemporal && 'Start_Validity' in props
                        ? {
                              Status: 'Vigerend',
                          }
                        : 'Status' in props && {
                              Status: props.Status,
                          }),
                    Modified_Date: (
                        <span className="flex items-center justify-between">
                            {Modified_Date
                                ? formatDate(
                                      parseUtc(Modified_Date),
                                      'cccccc d MMMM yyyy, p'
                                  )
                                : 'nooit'}
                            <AngleRight size={20} />
                        </span>
                    ),
                    ...((!atemporal || (atemporal && canCreateModule)) && {
                        onClick: () =>
                            navigate(
                                `/muteer/${plural}/${Object_ID}${
                                    atemporal ? '/bewerk' : ''
                                }`
                            ),
                    }),
                }
            }) || [],
        [data?.results, atemporal, plural, canCreateModule, navigate, type]
    )

    return (
        <div className="mt-6">
            {!!formattedData?.length ? (
                <Table
                    columns={columns}
                    data={formattedData}
                    enableSortingRemoval={false}
                    enableMultiSort={false}
                    limit={!query ? PAGE_LIMIT : undefined}
                    total={!query ? data?.total : undefined}
                    current={pageIndex}
                    onPaginationChange={setPagination}
                    state={{
                        sorting: sortBy,
                    }}
                    onSortingChange={setSortBy}
                    manualSorting
                    isLoading={isFetching}
                />
            ) : !isFetching ? (
                <span className="italic">
                    {!!query
                        ? `Er zijn geen resultaten gevonden voor '${query}'`
                        : type === 'valid'
                          ? `Er zijn geen vigerende ${pluralCapitalize.toLowerCase()} gevonden`
                          : `Er zijn geen ${pluralCapitalize.toLowerCase()} in ontwerp`}
                </span>
            ) : (
                <div className="mt-8 flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
        </div>
    )
}

export default DynamicOverview
