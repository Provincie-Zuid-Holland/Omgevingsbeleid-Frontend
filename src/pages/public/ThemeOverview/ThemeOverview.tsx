import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import { useGetValidBeleidsdoelen } from '@/api/fetchers'
import { Container } from '@/components/Container'
import ObjectList from '@/components/ObjectList'

function ThemeOverview() {
    const { isLoading, data } = useGetValidBeleidsdoelen()

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        { name: 'Thematische programma’s', path: '/thematische-programmas' },
    ]

    const transformedData = useMemo(
        () => data?.map(({ Titel, UUID }) => ({ Titel, UUID })),
        [data]
    )

    return (
        <div>
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 md:col-span-3 md:col-start-2">
                    <Heading level="1" className="mt-10">
                        Thematische programma’s
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        De provincie heeft een aantal beleidsdoelen
                        geformuleerd. Deze beleidsdoelen zijn direct de thema’s
                        voor de thematische programma’s. Een overzicht van alle
                        thematische programma’s vindt u hier.
                    </Text>

                    <div className="mt-8">
                        {transformedData && (
                            <ObjectList
                                data={transformedData}
                                isLoading={isLoading}
                                objectType="thematische programma’s"
                                objectSlug="omgevingsprogramma/thematische-programmas"
                                advancedSearch={false}
                            />
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default ThemeOverview
