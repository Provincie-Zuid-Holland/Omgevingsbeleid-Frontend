import {
    Button,
    FieldInput,
    Heading,
    Pagination,
    TabItem,
    Table,
    Tabs,
    formatDate,
} from '@pzh-ui/components'
import { AngleRight, MagnifyingGlass } from '@pzh-ui/icons'
import { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'

import { useModulesObjectsLatestGet, useSearchValidPost } from '@/api/fetchers'
import { ModuleObjectShortStatus } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

const PAGE_LIMIT = 20

type TabType = 'valid' | 'latest'

interface DynamicOverviewProps {
    model: (typeof models)[ModelType]
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
                    <Heading>{pluralCapitalize}</Heading>
                    {atemporal && canCreateModule ? (
                        <Button
                            as="a"
                            href={`/muteer/${plural}/nieuw`}
                            variant="cta">
                            {prefixNewObject} {singularReadable}
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

    const [currPage, setCurrPage] = useState(1)

    /**
     * Get correct data fetcher based on type
     */
    const useGetData =
        type === 'valid' ? useGetValid : useModulesObjectsLatestGet

    const { data, isLoading } = useGetData(
        {
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
            ...(type === 'latest' && {
                object_type: singular,
                action: 'Create',
            }),
        },
        {
            query: {
                enabled:
                    type === 'valid'
                        ? atemporal || (activeTab === 'valid' && !atemporal)
                        : activeTab === 'latest' && !atemporal,
            },
        }
    )

    const {
        data: searchData,
        mutate,
        isLoading: searchLoading,
    } = useSearchValidPost()

    const [pagination, setPagination] = useState({
        isLoaded: false,
        total: data?.total,
        limit: data?.limit,
    })

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
    }, [query, currPage])

    useUpdateEffect(() => {
        if (!pagination.isLoaded && !!data?.total) {
            setPagination({
                isLoaded: true,
                total: data?.total,
                limit: data?.limit,
            })
        }
    }, [data, plural])

    useUpdateEffect(() => {
        if (pagination.isLoaded) {
            setPagination({
                isLoaded: false,
                total: data?.total,
                limit: data?.limit,
            })
            setCurrPage(1)
        }
    }, [plural])

    /**
     * Show search results if query is not empty and tab is valid
     */
    const results =
        !!query && activeTab !== 'latest' ? searchData?.results : data?.results

    /**
     * Function to sort column by Modified_Date
     */
    const customSortType = (rowA: any, rowB: any, columnId: string) => {
        let [a, b] = [rowA.values[columnId], rowB.values[columnId]]

        a = a ? a.props['data-value'] : null
        b = b ? b.props['data-value'] : null

        return a === b ? 0 : a > b ? 1 : -1
    }

    /**
     * Setup Table columns
     */
    const columns = useMemo(
        () => [
            {
                Header: 'Titel',
                accessor: 'Title',
            },
            ...((!atemporal && [
                {
                    Header: 'Status',
                    accessor: 'Status',
                    sortType: customSortType,
                },
            ]) ||
                []),
            {
                Header: 'Laatst gewijzigd',
                accessor: 'Modified_Date',
                sortType: customSortType,
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
                }: ModelReturnType | ModuleObjectShortStatus) => ({
                    Title,
                    ...(!atemporal && 'Start_Validity' in props
                        ? {
                              Status: (
                                  <span data-value={props.Start_Validity}>
                                      Vigerend
                                  </span>
                              ),
                          }
                        : 'Status' in props && {
                              Status: (
                                  <span data-value={props.Status}>
                                      {props.Status}
                                  </span>
                              ),
                          }),
                    Modified_Date: (
                        <span
                            data-value={Modified_Date}
                            className="flex items-center justify-between">
                            {Modified_Date
                                ? formatDate(
                                      new Date(Modified_Date + 'Z'),
                                      'cccccc d MMMM yyyy, p'
                                  )
                                : 'nooit'}
                            <AngleRight size={18} />
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
            {isLoading || searchLoading ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : !!formattedData.length ? (
                <div data-table>
                    <Table
                        columns={columns}
                        data={formattedData}
                        // @ts-ignore
                        disableSortRemove
                        disableMultiSort
                    />
                </div>
            ) : (
                <span className="italic">
                    {!!query
                        ? `Er zijn geen resultaten gevonden voor '${query}'`
                        : type === 'valid'
                        ? `Er zijn geen vigerende ${pluralCapitalize.toLowerCase()} gevonden`
                        : `Er zijn geen ${pluralCapitalize.toLowerCase()} in ontwerp`}
                </span>
            )}

            {!query &&
                !!pagination.total &&
                !!pagination.limit &&
                pagination.total > pagination.limit && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            onChange={setCurrPage}
                            initialPage={currPage - 1}
                            {...pagination}
                        />
                    </div>
                )}
        </div>
    )
}

export default DynamicOverview
