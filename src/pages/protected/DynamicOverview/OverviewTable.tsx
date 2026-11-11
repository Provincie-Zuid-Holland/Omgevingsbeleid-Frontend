import { Dispatch, SetStateAction } from 'react'

import { Table } from '@pzh-ui/components'

import { LoaderSpinner } from '@/components/Loader'

export const PAGE_LIMIT = 20

export type OverviewColumn = {
    header: string
    accessorKey: string
}

export type OverviewRow = Record<string, unknown> & {
    onClick?: () => void
}

export type OverviewSorting = {
    id: string
    desc: boolean
}[]

interface OverviewTableProps {
    columns: OverviewColumn[]
    rows: OverviewRow[]
    total?: number
    pageIndex: number
    setPagination: Dispatch<
        SetStateAction<{ pageIndex: number; pageSize: number }>
    >
    sortBy: OverviewSorting
    setSortBy: Dispatch<SetStateAction<OverviewSorting>>
    isFetching?: boolean
    emptyMessage: string
    paginated?: boolean
}

const OverviewTable = ({
    columns,
    rows,
    total,
    pageIndex,
    setPagination,
    sortBy,
    setSortBy,
    isFetching,
    emptyMessage,
    paginated = true,
}: OverviewTableProps) => (
    <div className="mt-6">
        {rows.length ? (
            <Table
                columns={columns}
                data={rows}
                enableSortingRemoval={false}
                enableMultiSort={false}
                limit={paginated ? PAGE_LIMIT : undefined}
                total={paginated ? total : undefined}
                current={pageIndex}
                onPaginationChange={setPagination}
                state={{ sorting: sortBy }}
                onSortingChange={setSortBy}
                manualSorting
                isLoading={isFetching}
            />
        ) : !isFetching ? (
            <span className="italic">{emptyMessage}</span>
        ) : (
            <div className="mt-8 flex justify-center">
                <LoaderSpinner />
            </div>
        )}
    </div>
)

export default OverviewTable
