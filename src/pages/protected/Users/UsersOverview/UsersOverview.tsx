import {
    Button,
    FormikInput,
    FormikSelect,
    Heading,
    TabItem,
    Table,
    Tabs,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { keepPreviousData } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUsersSearchGet } from '@/api/fetchers'
import UserAddModal from '@/components/Modals/UserModals/UserAddModal'
import { Role, availableRoleTypes } from '@/context/AuthContext'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'

const PAGE_LIMIT = 20

type TabType = 'active' | 'inactive'

const UsersOverview = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [activeTab, setActiveTab] = useState<TabType>('active')

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Gebruikers', isCurrent: true },
    ]

    return (
        <>
            <MutateLayout title="Gebruikers" breadcrumbs={breadcrumbPaths}>
                <div className="col-span-6">
                    <div className="mb-6 flex items-center justify-between">
                        <Heading size="xxl">Gebruikers</Heading>
                        <Button
                            variant="cta"
                            onPress={() => setActiveModal('userAdd')}>
                            Gebruiker toevoegen
                        </Button>
                    </div>

                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key =>
                            setActiveTab(key as typeof activeTab)
                        }>
                        <TabItem title="Actieve gebruikers" key="active">
                            <TabTable type="active" activeTab={activeTab} />
                        </TabItem>
                        <TabItem title="Inactieve gebruikers" key="inactive">
                            <TabTable type="inactive" activeTab={activeTab} />
                        </TabItem>
                    </Tabs>
                </div>
            </MutateLayout>

            <UserAddModal />
        </>
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
            id: 'Gebruikersnaam',
            desc: false,
        },
    ])
    const [filter, setFilter] = useState<Filter>()

    const { data, isFetching } = useUsersSearchGet(
        {
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
            sort_column: sortBy?.[0]?.id || 'Gebruikersnaam',
            sort_order: sortBy?.[0]?.desc ? 'DESC' : 'ASC',
            active: activeTab === 'active',
            ...filter,
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
                header: 'Naam',
                accessorKey: 'Gebruikersnaam',
            },
            {
                header: 'Rol',
                accessorKey: 'Rol',
            },
            {
                header: 'E-mailadres',
                accessorKey: 'Email',
            },
        ],
        []
    )

    /**
     * Format data before passing to Table
     */
    const formattedData = useMemo(
        () =>
            data?.results?.map(({ Gebruikersnaam, Rol, Email, UUID }) => ({
                Gebruikersnaam,
                Rol,
                Email: (
                    <span className="flex items-center justify-between">
                        {Email}
                        <AngleRight size={18} />
                    </span>
                ),
                onClick: () => navigate(`/muteer/gebruikers/${UUID}`),
            })),
        [data?.results, navigate]
    )

    return (
        <div className="mt-4">
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
            ) : (
                <span className="italic">
                    {`Er zijn geen ${
                        type === 'active' ? 'actieve' : 'inactieve'
                    } gebruikers gevonden`}
                </span>
            )}
        </div>
    )
}

interface Filter {
    query?: string
    role?: Role
}

interface FilterProps {
    setFilter: (filter: Filter) => void
}

const Filter = ({ setFilter }: FilterProps) => {
    const roleOptions = useMemo(
        () => availableRoleTypes.map(role => ({ label: role, value: role })),
        []
    )

    return (
        <Formik initialValues={{}} onSubmit={setFilter}>
            <Form className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
                <div className="sm:w-3/5">
                    <FormikInput
                        name="query"
                        placeholder="Zoek op naam of e-mailadres"
                    />
                </div>
                <div className="sm:w-2/5">
                    <FormikSelect
                        name="role"
                        placeholder="Kies een rol"
                        options={roleOptions}
                        isClearable
                        noOptionsMessage={({ inputValue }) =>
                            !!inputValue && 'Geen resultaten gevonden'
                        }
                    />
                </div>
                <Button type="submit" className="sm:w-auto">
                    Zoeken
                </Button>
            </Form>
        </Formik>
    )
}

export default UsersOverview
