import {
    Button,
    FieldInput,
    Heading,
    TabItem,
    Table,
    Tabs,
    Text,
    formatDate,
} from '@pzh-ui/components'
import { AngleRight, MagnifyingGlass } from '@pzh-ui/icons'
import { useUpdateEffect } from '@react-hookz/web'
import { keepPreviousData } from '@tanstack/react-query'
import { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
    useModulesGetListModuleObjects,
    useSearchGetMssqlValidSearch,
} from '@/api/fetchers'
import { ModuleObjectShort } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { Model, ModelReturnType } from '@/config/objects/types'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

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

    /**
     * Handle key down of search field
     */
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value
            setQuery(value)
        }
    }

    const handleChange = (e: ChangeEvent) => {
        const value = (e.target as HTMLInputElement).value

        if (!value) {
            setQuery('')
        }
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
                        activeTab !== 'latest' && (
                            <FieldInput
                                key={plural}
                                name="search"
                                placeholder="Zoeken in lijst"
                                className="min-w-[368px]"
                                icon={MagnifyingGlass}
                                onKeyDown={handleKeyDown}
                                onChange={handleChange}
                            />
                        )
                    )}
                </div>

                {atemporal ? (
                    <TabTable type="valid" activeTab="valid" model={model} />
                ) : (
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key =>
                            setActiveTab(key as typeof activeTab)
                        }>
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
        },
        {
            query: {
                placeholderData: keepPreviousData,
                enabled:
                    type === 'valid'
                        ? atemporal || (activeTab === 'valid' && !atemporal)
                        : activeTab === 'latest' && !atemporal,
            },
        }
    )

    const {
        data: searchData,
        isPending: searchLoading,
        mutate,
    } = useSearchGetMssqlValidSearch()

    useUpdateEffect(() => {
        if (!query) {
            return
        }

        mutate({
            data: {
                Object_Types: [singular],
            },
            params: {
                query,
                limit: 50,
            },
        })
    }, [query, pageIndex])

    useUpdateEffect(() => {
        setPagination({
            pageIndex: 1,
            pageSize: PAGE_LIMIT,
        })
    }, [plural])

    /**
     * Show search results if query is not empty and tab is valid
     */
    const results =
        !!query && activeTab !== 'latest' ? searchData?.results : data?.results

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
            results?.map(
                ({
                    Title,
                    Modified_Date,
                    Object_ID,
                    Object_Type,
                    ...props
                }: ModelReturnType | ModuleObjectShort) => ({
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
                                      new Date(Modified_Date + 'Z'),
                                      'cccccc d MMMM yyyy, p'
                                  )
                                : 'nooit'}
                            <AngleRight size={20} />
                        </span>
                    ),
                    ...((!atemporal || (atemporal && canCreateModule)) && {
                        onClick: () =>
                            navigate(
                                type === 'valid'
                                    ? `/muteer/${plural}/${Object_ID}${
                                          atemporal ? '/bewerk' : ''
                                      }`
                                    : 'Module_ID' in props
                                      ? `/muteer/modules/${props.Module_ID}/${Object_Type}/${Object_ID}`
                                      : ''
                            ),
                    }),
                })
            ) || [],
        [results, atemporal, plural, canCreateModule, navigate, type]
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
                    isLoading={isFetching || searchLoading}
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
