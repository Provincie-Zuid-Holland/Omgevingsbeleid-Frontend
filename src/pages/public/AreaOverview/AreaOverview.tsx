import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'

import { useGetValidGebiedsprogrammas } from '@/api/fetchers'
import AreaCard from '@/components/AreaCard'
import { Container } from '@/components/Container'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'

function AreaOverview() {
    const { data, isInitialLoading: isLoading } = useGetValidGebiedsprogrammas()

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
        <div>
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6 xl:col-span-3">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                    <Heading level="1" className="mt-10">
                        Gebiedsprogramma’s
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        Maatregelen worden vaak genomen voor een specifieke
                        regio of een gebied. Hierdoor is het mogelijk om een
                        gebiedsprogramma op te stellen. Een lijstje van deze
                        gebieden (welke soms overlappen) is hieronder te vinden.
                    </Text>
                </div>

                <div className="col-span-6 mt-8">
                    {data ? (
                        <ul className="grid gap-9 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                            {data.map(item => (
                                <li key={item.UUID}>
                                    <AreaCard
                                        image={item?.Afbeelding}
                                        title={item?.Titel || ''}
                                        link={`/omgevingsprogramma/gebiedsprogrammas/${item.UUID}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default AreaOverview
