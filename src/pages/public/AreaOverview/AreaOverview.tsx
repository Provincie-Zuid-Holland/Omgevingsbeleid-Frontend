import { Breadcrumbs, Button, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { useGetValidGebiedsprogrammas } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'

function AreaOverview() {
    const { data, isLoading } = useGetValidGebiedsprogrammas()

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
                                    <div className="rounded-t overflow-hidden h-full flex flex-col">
                                        <img
                                            src="https://via.placeholder.com/500x200"
                                            alt={item.Titel}
                                            className="h-40 object-cover"
                                        />
                                        <div className="rounded-b border border-pzh-gray-400 p-6 flex flex-1 flex-col">
                                            <Heading level="3">
                                                {item.Titel}
                                            </Heading>
                                            <Text
                                                type="body-small"
                                                className="block mb-4">
                                                80 maatregelen
                                            </Text>
                                            <Link
                                                to={`/omgevingsprogramma/gebiedsprogrammas/${item.UUID}`}
                                                className="mt-auto">
                                                <Button label="Bekijk gebiedsprogramma" />
                                            </Link>
                                        </div>
                                    </div>
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
