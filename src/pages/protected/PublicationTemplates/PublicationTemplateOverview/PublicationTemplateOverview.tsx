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
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { usePublicationTemplatesGetListTemplates } from '@/api/fetchers'
import model from '@/config/publicationTemplates'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

const PAGE_LIMIT = 20

type TabType = 'active' | 'inactive'

const PublicationTemplateOverview = () => {
    const { canCreatePublicationTemplate } = usePermissions()

    const [activeTab, setActiveTab] = useState<TabType>('active')

    const { plural, pluralCapitalize, prefixNewObject, singularReadable } =
        model.defaults

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: pluralCapitalize, isCurrent: true },
    ]

    return (
        <MutateLayout title={pluralCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-6 flex items-center justify-between">
                    <Heading size="xxl">{pluralCapitalize}</Heading>

                    {canCreatePublicationTemplate && (
                        <Button asChild variant="cta">
                            <Link to={`/muteer/${plural}/nieuw`}>
                                {prefixNewObject} {singularReadable}
                            </Link>
                        </Button>
                    )}
                </div>

                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={key =>
                        setActiveTab(key as typeof activeTab)
                    }>
                    <TabItem title="Actieve templates" key="active">
                        <TabTable type="active" activeTab={activeTab} />
                    </TabItem>
                    <TabItem title="Inactieve templates" key="inactive">
                        <TabTable type="inactive" activeTab={activeTab} />
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

    const { canViewPublicationTemplate } = usePermissions()

    const { plural } = model.defaults

    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })

    const { data, isFetching } = usePublicationTemplatesGetListTemplates(
        {
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
            is_active: activeTab === 'active',
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
                header: 'Instrument',
                accessorKey: 'Document_Type',
            },
            {
                header: 'Aanmaakdatum',
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
                ({ Title, Document_Type, Created_Date, UUID }) => ({
                    Title: (
                        <Text bold color="text-pzh-blue-500">
                            {Title}
                        </Text>
                    ),
                    Document_Type,
                    Created_Date: (
                        <span className="flex items-center justify-between">
                            {formatDate(
                                new Date(Created_Date + 'Z'),
                                'cccccc d MMMM yyyy, p'
                            )}
                            <AngleRight size={20} />
                        </span>
                    ),
                    ...(canViewPublicationTemplate && {
                        onClick: () => navigate(`/muteer/${plural}/${UUID}`),
                    }),
                })
            ) || [],
        [data, plural, navigate, canViewPublicationTemplate]
    )

    return (
        <div className="mt-4">
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
                    manualSorting
                    isLoading={isFetching}
                />
            ) : (
                <span className="italic">
                    {`Er zijn geen ${
                        type === 'active' ? 'actieve' : 'inactieve'
                    } templates gevonden`}
                </span>
            )}
        </div>
    )
}

export default PublicationTemplateOverview
