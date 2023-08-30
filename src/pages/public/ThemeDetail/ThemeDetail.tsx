import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Breadcrumbs, Heading, Hyperlink, Text } from '@pzh-ui/components'

import { useBeleidsdoelenVersionObjectUuidGet } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'

function ThemeDetail() {
    const { uuid } = useParams<{ uuid: string }>()

    const { data, isLoading } = useBeleidsdoelenVersionObjectUuidGet(uuid!)

    const transformedMaatregelen = useMemo(
        () =>
            data?.Maatregelen?.map(item => ({
                Title: item.Object.Title,
                UUID: item.Object.UUID,
            })),
        [data?.Maatregelen]
    )

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Thematische programma’s',
            path: '/omgevingsprogramma/thematische-programmas',
        },
        {
            name: data?.Title || '',
            path: `/omgevingsprogramma/thematische-programmas/${data?.UUID}`,
        },
    ]

    if (isLoading) return <LoaderContent />

    return (
        <Container className="overflow-hidden pb-20">
            <div className="col-span-6">
                <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
            </div>
            <div className="col-span-6 pt-10 xl:col-span-4 xl:col-start-2">
                <Heading level="1" className="mb-3">
                    {data?.Title}
                </Heading>
                <Text className="mb-4 whitespace-pre-line break-words">
                    {data?.Description}
                </Text>
                <Hyperlink
                    to={`/omgevingsvisie/beleidsdoelen/${data?.UUID}`}
                    text="Lees meer informatie over dit beleidsdoel"
                />

                {!!transformedMaatregelen?.length && (
                    <div className="mt-8">
                        <ObjectList
                            data={transformedMaatregelen}
                            isLoading={isLoading}
                            objectType="maatregelen"
                            objectSlug="omgevingsprogramma/maatregelen"
                            hasSearch={false}
                            title="Maatregelen in dit thematische programma"
                        />
                    </div>
                )}
            </div>
        </Container>
    )
}

export default ThemeDetail
