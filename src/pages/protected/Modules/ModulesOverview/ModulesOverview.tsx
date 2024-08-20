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

import { useModulesGet } from '@/api/fetchers'
import { LoaderCard } from '@/components/Loader'
import ModuleTile from '@/components/Modules/ModuleTile'
import MutateLayout from '@/templates/MutateLayout'

const PAGE_LIMIT = 9
type TabType = 'active' | 'inactive' | 'archive'

const ModulesOverview = () => {
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
                    <Button
                        asChild
                        variant="cta"
                        data-testid="dashboard-new-module">
                        <Link to="/muteer/modules/nieuw">Nieuwe module</Link>
                    </Button>
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

    const [filter, setFilter] = useState<Filter>()
    const [currPage, setCurrPage] = useState(1)
    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })

    const { data: modules, isFetching } = useModulesGet(
        {
            only_active: activeTab === 'active',
            only_mine: false,
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
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
                        {formatDate(
                            new Date(Modified_Date + 'Z'),
                            'dd-MM-yyyy'
                        )}
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
                        ) : !!modules?.results.length ? (
                            modules?.results?.map(module => (
                                <ModuleTile
                                    key={`module-${module.Module_ID}`}
                                    {...module}
                                />
                            ))
                        ) : (
                            <Text>
                                {`Er zijn geen op dit moment geen ${
                                    type === 'active' ? 'actieve' : 'inactieve'
                                } modules.`}
                            </Text>
                        )}
                    </div>

                    {!!modules?.total &&
                        !!modules?.limit &&
                        modules.total > modules.limit && (
                            <div className="mt-8 flex justify-center">
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
                !!formattedData?.length && (
                    <div className="mt-6">
                        <Table
                            columns={columns}
                            data={formattedData}
                            enableSortingRemoval={false}
                            enableMultiSort={false}
                            limit={PAGE_LIMIT}
                            total={modules?.total}
                            current={pageIndex}
                            onPaginationChange={setPagination}
                            // state={{
                            //     sorting: sortBy,
                            // }}
                            // onSortingChange={setSortBy}
                            // manualSorting
                            isLoading={isFetching}
                        />
                    </div>
                )
            )}
        </div>
    )
}

interface Filter {
    query?: string
}

interface FilterProps {
    setFilter: (filter: Filter) => void
}

const Filter = ({ setFilter }: FilterProps) => (
    <Formik initialValues={{}} onSubmit={setFilter}>
        <Form className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
            <div className="w-full">
                <FormikInput
                    name="query"
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
