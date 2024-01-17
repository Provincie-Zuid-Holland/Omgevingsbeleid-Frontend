import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'

import { useGebiedsprogrammasValidGet } from '@/api/fetchers'
import AreaCard from '@/components/AreaCard'
import { Container } from '@/components/Container'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'

function AreaOverview() {
    const { data, isLoading } = useGebiedsprogrammasValidGet()

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Gebiedsprogramma’s',
            path: '/omgevingsprogramma/gebiedsprogrammas',
        },
    ]

    if (isLoading) return <LoaderContent />

    return (
        <>
            <Helmet title="Gebiedsprogramma’s" />

            <Container className="overflow-hidden pb-20">
                <div className="col-span-6 xl:col-span-3">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                    <Heading level="1" size="xxl" className="mt-10">
                        Gebiedsprogramma’s
                    </Heading>
                    <Text size="l" className="mt-3">
                        Maatregelen worden vaak genomen voor een specifieke
                        regio of een gebied. Hierdoor is het mogelijk om een
                        gebiedsprogramma op te stellen. Een lijstje van deze
                        gebieden (welke soms overlappen) is hieronder te vinden.
                    </Text>
                </div>

                <div className="col-span-6 mt-8">
                    {data ? (
                        <ul className="grid grid-cols-1 gap-9 lg:grid-cols-2 xl:grid-cols-3">
                            {data.results.map(item => (
                                <li key={item.UUID}>
                                    <AreaCard
                                        image={item?.Image}
                                        title={item?.Title || ''}
                                        link={`/omgevingsprogramma/gebiedsprogrammas/${item.UUID}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex w-full items-center justify-center">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default AreaOverview
