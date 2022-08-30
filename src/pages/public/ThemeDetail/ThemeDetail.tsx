import { Breadcrumbs, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import { useGetVersionBeleidsdoelenObjectuuid } from '@/api/fetchers'
import { Container } from '@/components/Container'

function ThemeDetail() {
    const { id } = useParams<{ id: string }>()
    const { data } = useGetVersionBeleidsdoelenObjectuuid(id!)

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Thematische programma’s',
            path: '/omgevingsprogramma/thematische-programmas',
        },
        {
            name: data?.Titel || '',
            path: `/omgevingsprogramma/thematische-programmas/${data?.UUID}`,
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
                    <Text className="mb-4 break-words whitespace-pre-line">
                        {data?.Omschrijving}
                    </Text>
                    <Hyperlink
                        to={`/beleidsdoelen/${data?.UUID}`}
                        text="Lees meer informatie over dit beleidsdoel"
                    />
                </div>
            </Container>
        </div>
    )
}

export default ThemeDetail
