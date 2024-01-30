import { Button, Heading, Table, formatDate } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoaderSpinner } from '@/components/Loader'
import MutateLayout from '@/templates/MutateLayout'

import { model } from '../model'

const PublicationTemplateOverview = () => {
    const navigate = useNavigate()

    const { plural, pluralCapitalize, prefixNewObject, singularReadable } =
        model.defaults

    const isFetching = false

    const data = useMemo(
        () => [
            {
                Title: 'Visie WWW',
                UUID: '1',
                Instrument: 'Visie',
                Created_Date: '2021-08-09T05:32:29.417000',
            },
            {
                Title: 'Visie Herziening 2024',
                UUID: '2',
                Instrument: 'Visie',
                Created_Date: '2021-08-09T05:32:29.417000',
            },
        ],
        []
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
                accessorKey: 'Instrument',
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
            data?.map(({ Title, Instrument, Created_Date, UUID }) => ({
                Title,
                Instrument,
                Created_Date: (
                    <span className="flex items-center justify-between">
                        {formatDate(
                            new Date(Created_Date + 'Z'),
                            'cccccc d MMMM yyyy, p'
                        )}
                        <AngleRight size={18} />
                    </span>
                ),
                onClick: () => navigate(`/muteer/${plural}/${UUID}`),
            })) || [],
        [data, plural, navigate]
    )

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: pluralCapitalize, isCurrent: true },
    ]

    return (
        <MutateLayout title={pluralCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-6 flex items-center justify-between">
                    <Heading size="xxl">{pluralCapitalize}</Heading>

                    <Button
                        as="a"
                        href={`/muteer/${plural}/nieuw`}
                        variant="cta">
                        {prefixNewObject} {singularReadable}
                    </Button>
                </div>

                <div className="mt-6">
                    {!!formattedData?.length ? (
                        <Table
                            columns={columns}
                            data={formattedData}
                            enableSortingRemoval={false}
                            enableMultiSort={false}
                            manualSorting
                        />
                    ) : !isFetching ? (
                        <span className="italic">
                            Er zijn geen {plural} gevonden
                        </span>
                    ) : (
                        <div className="mt-8 flex justify-center">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            </div>
        </MutateLayout>
    )
}

export default PublicationTemplateOverview
