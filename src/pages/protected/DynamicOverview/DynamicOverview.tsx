import {
    Button,
    Heading,
    Pagination,
    TabItem,
    Table,
    Tabs,
    formatDate,
} from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'

import { useModulesObjectsLatestGet } from '@/api/fetchers'
import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

const PAGE_LIMIT = 20

interface DynamicOverviewProps {
    model: typeof models[ModelType]
}

const DynamicOverview = ({ model }: DynamicOverviewProps) => {
    const { canCreateModule } = usePermissions()

    const [currPage, setCurrPage] = useState(1)
    const [activeTab, setActiveTab] = useState<'valid' | 'latest'>('valid')

    const {
        atemporal,
        singular,
        singularReadable,
        plural,
        pluralCapitalize,
        prefixNewObject,
    } = model.defaults
    const { useGetValid } = model.fetchers

    const { data: validData, isLoading: validDataLoading } = useGetValid(
        {
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
        },
        {
            query: {
                enabled: atemporal || (activeTab === 'valid' && !atemporal),
            },
        }
    )

    const { data: latestData, isLoading: latestDataLoading } =
        useModulesObjectsLatestGet(
            {
                object_type: singular,
            },
            {
                query: {
                    enabled: activeTab === 'latest' && !atemporal,
                },
            }
        )

    const data = activeTab === 'valid' ? validData : validData

    const [pagination, setPagination] = useState({
        isLoaded: false,
        total: data?.total,
        limit: data?.limit,
    })

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

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: pluralCapitalize || '', isCurrent: true },
    ]

    return (
        <MutateLayout title={pluralCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="flex items-center justify-between mb-6">
                    <Heading>{pluralCapitalize}</Heading>
                    {atemporal && canCreateModule && (
                        <Button
                            as="a"
                            href={`/muteer/${plural}/nieuw`}
                            variant="cta">
                            {prefixNewObject} {singularReadable}
                        </Button>
                    )}
                </div>

                {atemporal ? (
                    <TabTable
                        model={model}
                        data={validData?.results}
                        isLoading={validDataLoading}
                        setCurrPage={setCurrPage}
                        pagination={pagination}
                    />
                ) : (
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key =>
                            setActiveTab(key as typeof activeTab)
                        }>
                        <TabItem title="Vigerend" key="valid">
                            <TabTable
                                model={model}
                                data={data?.results}
                                isLoading={validDataLoading}
                                setCurrPage={setCurrPage}
                                pagination={pagination}
                            />
                        </TabItem>
                        <TabItem title="In ontwerp" key="latest">
                            <TabTable
                                model={model}
                                data={data?.results}
                                isLoading={latestDataLoading}
                                setCurrPage={setCurrPage}
                                pagination={pagination}
                            />
                        </TabItem>
                    </Tabs>
                )}
            </div>
        </MutateLayout>
    )
}

interface TabTableProps {
    data?: ModelReturnType[]
    model: Model
    isLoading: boolean
    setCurrPage: (page: number) => void
    pagination: {
        isLoaded: boolean
        total?: number
        limit?: number
    }
}

const TabTable = ({
    data,
    model,
    isLoading,
    setCurrPage,
    pagination,
}: TabTableProps) => {
    const navigate = useNavigate()
    const { canCreateModule } = usePermissions()

    const { atemporal, plural } = model.defaults

    /**
     * Function to sort column by Modified_Date
     */
    const customSortType = (rowA: any, rowB: any, columnId: string) => {
        let [a, b] = [rowA.values[columnId], rowB.values[columnId]]

        a = a ? a.props['data-value'] : null
        b = b ? b.props['data-value'] : null

        return a === b ? 0 : a > b ? 1 : -1
    }

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

    const formattedData = useMemo(
        () =>
            data?.map(({ Title, Modified_Date, Object_ID, ...props }) => ({
                Title,
                ...(!atemporal &&
                    'Start_Validity' in props && {
                        Status: (
                            <span data-value={props.Start_Validity}>
                                Vigerend
                            </span>
                        ),
                    }),
                Modified_Date: (
                    <span data-value={Modified_Date}>
                        {Modified_Date
                            ? formatDate(
                                  new Date(Modified_Date + 'Z'),
                                  'cccccc d MMMM yyyy, p'
                              )
                            : 'nooit'}
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
            })) || [],
        [data, atemporal, plural, canCreateModule, navigate]
    )

    return (
        <div className="mt-6">
            {isLoading ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <div data-table>
                    <Table
                        columns={columns}
                        data={formattedData}
                        // @ts-ignore
                        disableSortRemove
                        disableMultiSort
                    />
                </div>
            )}

            {!!pagination.total &&
                !!pagination.limit &&
                pagination.total > pagination.limit && (
                    <div className="mt-8 flex justify-center">
                        <Pagination onChange={setCurrPage} {...pagination} />
                    </div>
                )}
        </div>
    )
}

export default DynamicOverview
