import { Heading, Table, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import MutateLayout from '@/templates/MutateLayout'

interface DynamicOverviewProps {
    model: typeof models[ModelType]
}

const DynamicOverview = ({ model }: DynamicOverviewProps) => {
    const navigate = useNavigate()

    const { plural, pluralCapitalize } = model.defaults
    const { useGetValid } = model.fetchers

    const { data, isLoading } = useGetValid()

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
            {
                Header: 'Status',
                accessor: 'Status',
            },
            {
                Header: 'Laatst gewijzigd',
                accessor: 'Modified_Date',
                sortType: customSortType,
            },
        ],
        []
    )

    const formattedData = useMemo(
        () =>
            data?.map(({ Title, Modified_Date, Object_ID }) => ({
                Title,
                Status: 'TODO: Status implementeren',
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
                onClick: () => navigate(`/muteer/${plural}/${Object_ID}`),
            })) || [],
        [data, plural, navigate]
    )

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        { name: pluralCapitalize || '', isCurrent: true },
    ]

    return (
        <MutateLayout title={pluralCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <Heading className="mb-6">{pluralCapitalize}</Heading>

                {isLoading ? (
                    <div className="flex justify-center">
                        <LoaderSpinner />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={formattedData}
                        // @ts-ignore
                        disableSortRemove
                        disableMultiSort
                    />
                )}
            </div>
        </MutateLayout>
    )
}

export default DynamicOverview
