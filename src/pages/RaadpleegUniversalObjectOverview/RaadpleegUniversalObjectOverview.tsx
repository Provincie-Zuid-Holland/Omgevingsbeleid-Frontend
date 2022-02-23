import { faAngleRight } from '@fortawesome/pro-light-svg-icons'
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import Heading from '@/components/Heading'
import { LoaderCard, LoaderSpinner } from '@/components/Loader'
import Text from '@/components/Text'
import { DetailPageValidEndpoint } from '@/utils/detailPages'

interface RaadpleegUniversalObjectOverviewProps {
    dataModel: {
        API_ENDPOINT_VIGEREND?: string
        TITLE_PLURAL: string
        DESCRIPTION?: string | null
        SLUG_OVERVIEW: string
    }
    dataEndpoint: DetailPageValidEndpoint
}

function RaadpleegUniversalObjectOverview({
    dataModel,
    dataEndpoint,
}: RaadpleegUniversalObjectOverviewProps) {
    const { isLoading, data: allObjects } = useQuery(
        dataModel.API_ENDPOINT_VIGEREND || '',
        () =>
            dataEndpoint().then(data =>
                data.sort((a, b) => a.Titel!.localeCompare(b.Titel!))
            )
    )

    return (
        <div>
            <Container className="pb-16 mb-8">
                <div className="col-span-6 sm:col-span-1">
                    <Link
                        to="/"
                        className="inline-block mt-4 duration-100 ease-in opacity-50 cursor-pointer focus-within:transition sm:mt-8 text-pzh-blue-dark hover:opacity-75">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        <span>Start</span>
                    </Link>
                </div>
                <div className="col-span-6 sm:col-span-4">
                    <Heading className="mt-4 sm:mt-8" level="1">
                        {dataModel.TITLE_PLURAL}
                    </Heading>
                    <Text className="mt-3 md:mt-4">
                        {dataModel.DESCRIPTION}
                    </Text>
                    <div className="mt-8">
                        <div className="flex flex-col justify-between sm:flex-row">
                            <Heading level="3">
                                {isLoading
                                    ? `De ${dataModel.TITLE_PLURAL.toLowerCase()} worden geladen`
                                    : `De ${allObjects?.length} ${dataModel.TITLE_PLURAL}`}
                                {isLoading ? (
                                    <LoaderSpinner className="ml-2" />
                                ) : null}
                            </Heading>
                            <Link
                                className="block mt-2 mb-1 sm:mb-0 sm:mt-0"
                                to="/zoekresultaten">
                                <Text
                                    className="underline"
                                    color="text-pzh-green hover:text-pzh-green-dark">
                                    uitgebreid zoeken
                                </Text>
                            </Link>
                        </div>
                        <ul className="mt-2">
                            {isLoading ? (
                                <div className="mt-6">
                                    <LoaderCard height="25" />
                                    <LoaderCard height="25" />
                                    <LoaderCard height="25" />
                                </div>
                            ) : (
                                allObjects?.map((obj, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start py-1 transition-colors duration-100 ease-in text-pzh-blue hover:text-pzh-blue-dark">
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className="relative mr-2 text-lg"
                                            style={{ marginTop: '0.1rem' }}
                                        />
                                        <Link
                                            to={`/detail/${dataModel.SLUG_OVERVIEW}/${obj.UUID}`}
                                            className="underline underline-thin">
                                            {obj.Titel}
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default RaadpleegUniversalObjectOverview
