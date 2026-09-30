import { useMemo, useState } from 'react'

import { Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

import { useUpdateEffect } from '@react-hookz/web'

import { Annotation } from '@/config/annotations/types'

import OverviewTable, { OverviewRow, PAGE_LIMIT } from './OverviewTable'

interface AnnotationOverviewTableProps {
    annotation: Annotation
    query: string
    refreshKey: number
    onEdit: (id: string) => void
}

const AnnotationOverviewTable = ({
    annotation,
    query,
    refreshKey,
    onEdit,
}: AnnotationOverviewTableProps) => {
    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })
    const [sortBy, setSortBy] = useState([
        {
            id: annotation.overview.defaultSortColumn,
            desc: false,
        },
    ])

    const { plural, pluralReadable } = annotation.defaults
    const { columns, idKey } = annotation.overview
    const sortColumn = sortBy[0]?.id || annotation.overview.defaultSortColumn
    const sortOrder: 'ASC' | 'DESC' = sortBy[0]?.desc ? 'DESC' : 'ASC'
    const { data, isFetching } = annotation.api.useOverview({
        limit: PAGE_LIMIT,
        offset: (pageIndex - 1) * PAGE_LIMIT,
        query,
        refreshKey,
        sortColumn,
        sortOrder,
    })

    useUpdateEffect(() => {
        setPagination({ pageIndex: 1, pageSize: PAGE_LIMIT })
    }, [plural, query])

    const rows = useMemo(
        () =>
            data?.results.map(item => {
                const row = columns.reduce<OverviewRow>(
                    (result, column, index) => ({
                        ...result,
                        [column.accessorKey]:
                            index === 0 ? (
                                <Text bold color="text-pzh-blue-500">
                                    {String(item[column.accessorKey] ?? '')}
                                </Text>
                            ) : index === columns.length - 1 ? (
                                <span className="flex items-center justify-between">
                                    <span>
                                        {String(item[column.accessorKey] ?? '')}
                                    </span>
                                    <AngleRight size={20} />
                                </span>
                            ) : (
                                item[column.accessorKey]
                            ),
                    }),
                    {}
                )
                const id = item[idKey]

                if (typeof id === 'string') {
                    row.onClick = () => onEdit(id)
                }

                return row
            }) ?? [],
        [columns, data?.results, idKey, onEdit]
    )

    return (
        <OverviewTable
            columns={columns}
            rows={rows}
            total={data?.total}
            pageIndex={pageIndex}
            setPagination={setPagination}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isFetching={isFetching}
            emptyMessage={
                query
                    ? `Er zijn geen resultaten gevonden voor '${query}'`
                    : `Er zijn geen ${pluralReadable} gevonden`
            }
        />
    )
}

export default AnnotationOverviewTable
