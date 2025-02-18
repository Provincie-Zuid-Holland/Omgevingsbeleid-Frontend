import { Heading, Text } from '@pzh-ui/components'
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { useBeleidsdoelenValidGet } from '@/api/fetchers'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'

const META = {
    title: 'Thematische programma’s',
    description:
        'De provincie heeft een aantal beleidsdoelen geformuleerd. Deze beleidsdoelen zijn direct de thema’s voor de thematische programma’s. Een overzicht van alle thematische programma’s vindt u hier.',
}

const PAGE_LIMIT = 20

function ThemeOverview() {
    const [currPage, setCurrPage] = useState(1)

    const { isLoading, data } = useBeleidsdoelenValidGet(
        {
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Omgevingsprogramma', to: '/omgevingsprogramma' },
        { name: 'Thematische programma’s' },
    ]

    const transformedData = useMemo(
        () => data?.results.map(({ Title, UUID }) => ({ Title, UUID })),
        [data]
    )

    if (isLoading) return <LoaderContent />

    return (
        <>
            <Helmet title={META.title}>
                <meta name="description" content={META.description} />
                <meta name="og:description" content={META.description} />
            </Helmet>

            <Container className="overflow-hidden pb-20">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 xl:col-span-3 xl:col-start-2">
                    <Heading level="1" size="xxl" className="mt-10">
                        Thematische programma’s
                    </Heading>
                    <Text size="l" className="mt-3">
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
                                limit={PAGE_LIMIT}
                                onPageChange={setCurrPage}
                                total={data?.total}
                                hasSearch={false}
                            />
                        )}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default ThemeOverview
