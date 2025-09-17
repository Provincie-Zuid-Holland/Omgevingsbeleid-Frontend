import {
    Button,
    formatDate,
    FormikInput,
    Heading,
    Pagination,
    TabItem,
    Table,
    Tabs,
    Text,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { keepPreviousData } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useModulesGetListModules } from '@/api/fetchers'
import { ModuleSortColumn } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import ModuleTile from '@/components/Modules/ModuleTile'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import { parseUtc } from '@/utils/parseUtc'

const PAGE_LIMIT = 9
type TabType = 'active' | 'inactive' | 'archive'

const ModulesOverview = () => {
    const { canCreateModule } = usePermissions()

    const [activeTab, setActiveTab] = useState<TabType>('active')

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Modules', isCurrent: true },
    ]

    return (
        <MutateLayout title="Modules" breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-6 flex items-center justify-between">
                    <Heading size="xxl">Modules</Heading>
                    {canCreateModule && (
                        <Button
                            asChild
                            variant="cta"
                            data-testid="dashboard-new-module">
                            <Link to="/muteer/modules/nieuw">
                                Nieuwe module
                            </Link>
                        </Button>
                    )}
                </div>

                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={key =>
                        setActiveTab(key as typeof activeTab)
                    }>
                    <TabItem title="Actief" key="active">
                        <TabContent type="active" activeTab={activeTab} />
                    </TabItem>
                    <TabItem title="Niet actief" key="inactive">
                        <TabContent type="inactive" activeTab={activeTab} />
                    </TabItem>
                    <TabItem title="Afgerond" key="archive">
                        <TabContent type="archive" activeTab={activeTab} />
                    </TabItem>
                </Tabs>
            </div>
        </MutateLayout>
    )
}

interface TabContentProps {
    type: TabType
    activeTab: TabType
}

const TabContent = ({ type, activeTab }: TabContentProps) => {
    const navigate = useNavigate()

    const [sortBy, setSortBy] = useState([
        {
            id: 'Modified_Date',
            desc: true,
        },
    ])
    const [filter, setFilter] = useState<Filter>()
    const [currPage, setCurrPage] = useState(1)
    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })

    const { data: modules, isFetching } = useModulesGetListModules(
        {
            filter_activated: activeTab === 'inactive' ? false : true,
            filter_closed: activeTab === 'archive' ? true : false,
            filter_title: filter?.filter_title
                ? `%${filter.filter_title}%`
                : undefined,
            filter_successful: type === 'archive' ? true : undefined,
            sort_column:
                (sortBy?.[0]?.id as ModuleSortColumn) || 'Modified_Date',
            sort_order: sortBy?.[0]?.desc ? 'DESC' : 'ASC',
            limit: PAGE_LIMIT,
            offset:
                ((type === 'archive' ? pageIndex : currPage) - 1) * PAGE_LIMIT,
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

    /**
     * Setup Table columns
     */
    const columns = useMemo(
        () => [
            {
                header: 'Titel',
                accessorKey: 'Title',
                enableSorting: false,
            },
            {
                header: 'Datum afronding/publicatie',
                accessorKey: 'Modified_Date',
            },
        ],
        []
    )

    /**
     * Format data before passing to Table
     */
    const formattedData = useMemo(
        () =>
            modules?.results?.map(({ Title, Modified_Date, Module_ID }) => ({
                Title: (
                    <Text bold color="text-pzh-blue-500">
                        {Title}
                    </Text>
                ),
                Modified_Date: (
                    <span className="flex items-center justify-between">
                        {formatDate(parseUtc(Modified_Date), 'dd-MM-yyyy')}
                        <AngleRight size={20} />
                    </span>
                ),
                onClick: () => navigate(`/muteer/modules/${Module_ID}`),
            })),
        [modules?.results, navigate]
    )

    return (
        <div className="mt-6">
            <Filter setFilter={setFilter} />

            {type !== 'archive' ? (
                <>
                    <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                        {isFetching ? (
                            <>
                                <LoaderCard height="208" mb="" />
                                <LoaderCard height="208" mb="" />
                                <LoaderCard height="208" mb="" />
                            </>
                        ) : (
                            !!modules?.results.length &&
                            modules?.results?.map(module => (
                                <ModuleTile
                                    key={`module-${module.Module_ID}`}
                                    {...module}
                                />
                            ))
                        )}
                    </div>

                    {!!!modules?.results.length && (
                        <div className="mt-6">
                            {!filter?.filter_title ? (
                                <Text>
                                    {`Er zijn geen op dit moment geen ${
                                        type === 'active'
                                            ? 'actieve'
                                            : 'inactieve'
                                    } modules.`}
                                </Text>
                            ) : (
                                <Text>
                                    Er zijn geen resultaten voor '
                                    {filter.filter_title}' binnen{' '}
                                    {type === 'inactive' && 'niet '}actieve
                                    modules.
                                </Text>
                            )}
                        </div>
                    )}

                    {!!modules?.total &&
                        !!modules?.limit &&
                        modules.total > modules.limit && (
                            <div className="mt-8">
                                <Pagination
                                    onPageChange={setCurrPage}
                                    current={currPage}
                                    total={modules.total}
                                    limit={modules.limit}
                                />
                            </div>
                        )}
                </>
            ) : (
                <div className="mt-6">
                    {!!formattedData?.length ? (
                        <Table
                            columns={columns}
                            data={formattedData}
                            enableSortingRemoval={false}
                            enableMultiSort={false}
                            limit={PAGE_LIMIT}
                            total={modules?.total}
                            current={pageIndex}
                            onPaginationChange={setPagination}
                            state={{
                                sorting: sortBy,
                            }}
                            onSortingChange={setSortBy}
                            manualSorting
                            isLoading={isFetching}
                        />
                    ) : !filter?.filter_title ? (
                        <Text>
                            Er zijn geen op dit moment geen afgeronde modules.
                        </Text>
                    ) : (
                        <Text>
                            Er zijn geen resultaten voor '{filter.filter_title}'
                            binnen afgeronde modules.
                        </Text>
                    )}
                </div>
            )}
        </div>
    )
}

interface Filter {
    filter_title?: string
}

interface FilterProps {
    setFilter: (filter: Filter) => void
}

const Filter = ({ setFilter }: FilterProps) => (
    <Formik initialValues={{}} onSubmit={setFilter}>
        <Form className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
            <div className="w-full">
                <FormikInput
                    name="filter_title"
                    placeholder="Zoek op titel van module"
                />
            </div>
            <Button type="submit" className="sm:w-auto">
                Zoeken
            </Button>
        </Form>
    </Formik>
)

export default ModulesOverview
