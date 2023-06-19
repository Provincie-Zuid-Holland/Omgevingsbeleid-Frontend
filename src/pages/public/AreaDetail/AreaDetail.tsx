import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useGebiedsprogrammasVersionObjectUuidGet } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'

function AreaDetail() {
    const { uuid } = useParams<{ uuid: string }>()
    const { data, isLoading } = useGebiedsprogrammasVersionObjectUuidGet(uuid!)

    const transformedMaatregelen = useMemo(
        () =>
            data?.Maatregelen?.map(({ Object }) => ({
                Title: Object?.Title,
                UUID: Object?.UUID,
            })),
        [data?.Maatregelen]
    )

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Gebiedsprogramma’s',
            path: '/omgevingsprogramma/gebiedsprogrammas',
        },
        {
            name: data?.Title || '',
            path: `/omgevingsprogramma/gebiedsprogrammas/${data?.UUID}`,
        },
    ]

    if (isLoading) return <LoaderContent />

    return (
        <div>
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" className="mt-10 mb-3">
                        {data?.Title}
                    </Heading>
                    <Text className="mb-8 break-words whitespace-pre-line">
                        {data?.Description}
                    </Text>
                    {data?.Image && (
                        <figure>
                            <img src={data.Image} alt={data?.Title} />
                            <figcaption className="mt-2 text-sm text-pzh-blue-dark">
                                Indicatieve weergave gebied ‘{data?.Title}’.
                            </figcaption>
                        </figure>
                    )}
                    {!!transformedMaatregelen?.length && (
                        <div className="mt-8">
                            <ObjectList
                                data={transformedMaatregelen}
                                isLoading={isLoading}
                                objectType="maatregelen"
                                objectSlug="omgevingsprogramma/maatregelen"
                                advancedSearch={false}
                                hasFilter={false}
                                title="Maatregelen in dit gebiedsprogramma"
                            />
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default AreaDetail
