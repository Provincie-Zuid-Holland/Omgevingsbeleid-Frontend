import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { useMemo, useState } from 'react'

import { useBeleidsdoelenValidGet } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'

const PAGE_LIMIT = 20

function ThemeOverview() {
    const [currPage, setCurrPage] = useState(1)

    const { isLoading, data } = useBeleidsdoelenValidGet({
        limit: PAGE_LIMIT,
        offset: (currPage - 1) * PAGE_LIMIT,
    })

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        { name: 'Thematische programma’s', path: '/thematische-programmas' },
    ]

    const transformedData = useMemo(
        () => data?.results.map(({ Title, UUID }) => ({ Title, UUID })),
        [data]
    )

    if (isLoading) return <LoaderContent />

    return (
        <div>
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 xl:col-span-3 xl:col-start-2">
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
                                limit={PAGE_LIMIT}
                                onPageChange={setCurrPage}
                                total={data?.total}
                                hasSearch={false}
                            />
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default ThemeOverview
