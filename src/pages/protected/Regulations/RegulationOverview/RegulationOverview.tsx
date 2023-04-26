import { Button, Heading, Table } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/regulations'
import { ModelType } from '@/config/regulations/types'
import MutateLayout from '@/templates/MutateLayout'

interface RegulationOverviewProps {
    model: typeof models[ModelType]
}

const RegulationOverview = ({ model }: RegulationOverviewProps) => {
    const navigate = useNavigate()

    const { plural, pluralCapitalize, prefixNewObject, singular } =
        model.defaults
    const { useGet } = models.default.fetchers

    const { data, isLoading } = useGet()

    const columns = useMemo(
        () => [
            {
                Header: 'Titel',
                accessor: 'Title',
            },
        ],
        []
    )

    const formattedData = useMemo(
        () =>
            data?.map(({ Title, UUID }) => ({
                Title,
                onClick: () => navigate(`/muteer/${plural}/${UUID}/bewerk`),
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
                <div className="flex items-center justify-between mb-6">
                    <Heading>{pluralCapitalize}</Heading>
                    <Button
                        variant="cta"
                        onPress={() => navigate(`/muteer/${plural}/nieuw`)}>
                        {prefixNewObject} {singular}
                    </Button>
                </div>

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

export default RegulationOverview
