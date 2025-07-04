import {
    usePublicationActPackagesGet,
    usePublicationAnnouncementPackagesGet,
} from '@/api/fetchers'
import {
    DocumentType,
    PackageType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { getStatus } from '@/components/Publications/PublicationPackages/components/utils'
import MutateLayout from '@/templates/MutateLayout'
import {
    Button,
    Divider,
    formatDate,
    FormikSelect,
    Heading,
    TabItem,
    Table,
    Tabs,
    Text,
} from '@pzh-ui/components'
import { AngleRight, ArrowUpToLine } from '@pzh-ui/icons'
import { keepPreviousData } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PAGE_LIMIT = 20

type TabType = 'act' | 'announcement'

const config = {
    title: 'Leveringen',
    plural: 'leveringen',
    documentType: {
        omgevingsvisie: {
            label: 'Visie',
        },
        programma: {
            label: 'Programma',
        },
    },
    packageType: {
        validation: {
            label: 'Validatie',
        },
        publication: {
            label: 'Publicatie',
        },
    },
}

const PackagesOverview = () => {
    const [activeTab, setActiveTab] = useState<TabType>('act')

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
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={key =>
                        setActiveTab(key as typeof activeTab)
                    }>
                    <TabItem title="Regeling" key="act">
                        <TabTable type="act" activeTab={activeTab} />
                    </TabItem>
                    <TabItem title="Kennisgeving" key="announcement">
                        <TabTable type="announcement" activeTab={activeTab} />
                    </TabItem>
                </Tabs>
            </div>
        </MutateLayout>
    )
}

interface TabTableProps {
    type: TabType
    activeTab: TabType
}

const TabTable = ({ type, activeTab }: TabTableProps) => {
    const navigate = useNavigate()

    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })

    const [sortBy, setSortBy] = useState([
        {
            id: 'Created_Date',
            desc: true,
        },
    ])

    const [filter, setFilter] = useState<Filter>()

    const useGetPackages =
        type === 'act'
            ? usePublicationActPackagesGet
            : usePublicationAnnouncementPackagesGet

    const { data, isFetching } = useGetPackages(
        {
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
            sort_column: sortBy?.[0]?.id || 'Created_Date',
            sort_order: sortBy?.[0]?.desc ? 'DESC' : 'ASC',
            ...filter,
        },
        {
            query: {
                placeholderData: keepPreviousData,
                enabled: activeTab === type,
            },
        }
    )

    /**
     * Setup Table columns
     */
    const columns = useMemo(
        () => [
            {
                header: 'Module',
                accessorKey: 'Module',
            },
            {
                header: 'Instrument',
                accessorKey: 'Document_Type',
            },
            {
                header: 'Type',
                accessorKey: 'Package_Type',
            },
            {
                header: 'Status',
                accessorKey: 'Report_Status',
            },
            {
                header: 'Gemaakt op',
                accessorKey: 'Created_Date',
            },
        ],
        []
    )

    /**
     * Format data before passing to Table
     */
    const formattedData = useMemo(
        () =>
            data?.results.map(
                ({ Package_Type, Report_Status, Created_Date, UUID }) => ({
                    Module: (
                        <Text bold color="text-pzh-blue-500">
                            To-Do: Module_Title toevoegen
                        </Text>
                    ),
                    Document_Type: 'To-Do: Document_Type toevoegen',
                    Package_Type,
                    Report_Status: getStatus(Report_Status)?.text,
                    Created_Date: (
                        <span className="flex items-center justify-between">
                            {formatDate(
                                new Date(Created_Date + 'Z'),
                                'dd-MM-yyyy, p'
                            )}
                            <AngleRight size={20} />
                        </span>
                    ),
                    onClick: () =>
                        navigate(`/muteer/${config.plural}/${type}/${UUID}`),
                })
            ) || [],
        [data, navigate]
    )

    return (
        <>
            <div className="mb-6">
                <Filter setFilter={setFilter} />
            </div>

            {!!formattedData?.length ? (
                <Table
                    columns={columns}
                    data={formattedData}
                    enableSortingRemoval={false}
                    enableMultiSort={false}
                    limit={PAGE_LIMIT}
                    total={data?.total}
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
                    Er zijn geen leveringen gevonden.
                </span>
            ) : (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
        </>
    )
}

interface Filter {
    document_type?: DocumentType
    package_type?: PackageType
    report_status?: ReportStatusType
}

interface FilterProps {
    setFilter: (filter: Filter) => void
}

const Filter = ({ setFilter }: FilterProps) => {
    const documentTypeOptions = Object.entries(DocumentType).map(
        ([, value]) => ({
            label: config.documentType[value].label,
            value,
        })
    )

    const packageTypeOptions = Object.entries(PackageType).map(([, value]) => ({
        label: config.packageType[value].label,
        value,
    }))

    const reportStatusOptions = Object.entries(ReportStatusType)
        .map(([, value]) => ({
            label: getStatus(value)?.text,
            value,
        }))
        .filter(e => e.value !== 'not_applicable')

    return (
        <Formik initialValues={{}} onSubmit={setFilter}>
            {({ submitForm }) => (
                <Form className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
                    <div className="flex-1">
                        <FormikSelect
                            name="document_type"
                            label="Instrument"
                            placeholder="Kies een instrument"
                            options={documentTypeOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                    <div className="flex-1">
                        <FormikSelect
                            name="package_type"
                            label="Type"
                            placeholder="Kies een type"
                            options={packageTypeOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                    <div className="flex-1">
                        <FormikSelect
                            name="report_status"
                            label="Status"
                            placeholder="Kies een status"
                            options={reportStatusOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default PackagesOverview
