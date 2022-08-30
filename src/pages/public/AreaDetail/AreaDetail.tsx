import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import { useGetVersionGebiedsprogrammasObjectuuid } from '@/api/fetchers'
import { Container } from '@/components/Container'

function AreaDetail() {
    const { id } = useParams<{ id: string }>()
    const { data } = useGetVersionGebiedsprogrammasObjectuuid(id!)

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Gebiedsprogramma’s',
            path: '/omgevingsprogramma/gebiedsprogrammas',
        },
        {
            name: data?.Titel || '',
            path: `/omgevingsprogramma/gebiedsprogrammas/${data?.UUID}`,
        },
    ]

    return (
        <div>
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 md:col-span-4 md:col-start-2">
                    <Heading level="1" className="mt-10 mb-3">
                        {data?.Titel}
                    </Heading>
                    <Text className="mb-8 break-words whitespace-pre-line">
                        {data?.Omschrijving}
                    </Text>
                    {data?.Afbeelding && (
                        <figure className="mb-8">
                            <img
                                src={`data:image/jpeg;base64,${data.Afbeelding}`}
                                alt={data?.Titel}
                            />
                            <figcaption className="mt-2 text-sm text-pzh-blue-dark">
                                Indicatieve weergave gebied ‘{data?.Titel}’.
                            </figcaption>
                        </figure>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default AreaDetail
