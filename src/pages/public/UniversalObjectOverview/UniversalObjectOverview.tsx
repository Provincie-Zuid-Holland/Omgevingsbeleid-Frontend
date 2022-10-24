import { Heading, Text } from '@pzh-ui/components'
import { ArrowLeft } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import ObjectList from '@/components/ObjectList'
import { DetailPageValidEndpoint } from '@/utils/detailPages'

interface UniversalObjectOverviewProps {
    dataModel?: {
        API_ENDPOINT_VIGEREND?: string
        TITLE_PLURAL: string
        DESCRIPTION?: string | null
        SLUG_OVERVIEW: string
    }
    dataEndpoint?: DetailPageValidEndpoint
}

function UniversalObjectOverview({
    dataModel,
    dataEndpoint,
}: UniversalObjectOverviewProps) {
    const { isInitialLoading: isLoading, data: allObjects } = useQuery(
        [dataModel?.API_ENDPOINT_VIGEREND || ''],
        () =>
            dataEndpoint?.().then(data =>
                data
                    .map(({ Titel, UUID }) => ({ Titel, UUID }))
                    .sort((a, b) => a.Titel!.localeCompare(b.Titel!))
            )
    )

    return (
        <div>
            <Container className="pb-16 mb-8">
                <div className="col-span-6 sm:col-span-1">
                    <Link
                        to="/"
                        className="inline-block mt-4 duration-100 ease-in opacity-75 cursor-pointer focus-within:transition sm:mt-8 text-pzh-blue hover:opacity-100">
                        <ArrowLeft className="mr-2 -mt-0.5 inline-block" />
                        <span>Start</span>
                    </Link>
                </div>
                <div className="col-span-6 sm:col-span-4">
                    <Heading className="mt-4 sm:mt-8" level="1">
                        {dataModel?.TITLE_PLURAL}
                    </Heading>
                    <Text className="mt-3 md:mt-4">
                        {dataModel?.DESCRIPTION}
                    </Text>
                    <div className="mt-8">
                        {allObjects && (
                            <ObjectList
                                data={allObjects}
                                isLoading={isLoading}
                                objectSlug={dataModel?.SLUG_OVERVIEW || ''}
                                objectType={
                                    dataModel?.TITLE_PLURAL.toLowerCase() || ''
                                }
                            />
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default UniversalObjectOverview
