import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'
import { gebiedsprogramma } from '@/config/objects'

function AreaDetail() {
    const { moduleId, uuid } = useParams()

    const { useGetVersion, useGetRevision } = gebiedsprogramma.fetchers

    const versionData = useGetVersion(uuid!, {
        query: { enabled: !!uuid && !moduleId },
    })
    const revisionData = useGetRevision(parseInt(moduleId!), uuid!, {
        query: { enabled: !!uuid && !!moduleId },
    })

    const objectData = useMemo(() => {
        if (!!moduleId && !!uuid) {
            return revisionData
        }

        return versionData
    }, [moduleId, uuid, versionData, revisionData])

    const { data, isLoading } = objectData

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
            <Container className="overflow-hidden pb-20">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" size="xxl" className="mb-3 mt-10">
                        {data?.Title}
                    </Heading>
                    <Text className="mb-8 whitespace-pre-line break-words">
                        {data?.Description}
                    </Text>
                    {data?.Image && (
                        <figure>
                            <img src={data.Image} alt={data?.Title} />
                            <figcaption className="mt-2 text-s text-pzh-blue-dark">
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
                                hasSearch={false}
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
