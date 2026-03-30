import { Heading, ListLink, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { useVisieAlgemeenListValidLineages } from '@/api/fetchers'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { LoaderSpinner } from '@/components/Loader'
import PageHero from '@/components/PageHero'
import model from '@/config/objects/visieAlgemeen'
import imgEnvironmentProgram from '@/images/environment-program.webp'
import { useWindowSize } from '@react-hookz/web'

const META = {
    title: 'Omgevingsvisie',
    description:
        'De Omgevingsvisie van Zuid-Holland bestaat uit enkele inleidende hoofdstukken, gevolgd door de provinciale ambities, beleidsdoelen en beleidskeuzes.',
}

function EnvironmentVision() {
    const { width } = useWindowSize()

    const { data, isFetching } = useVisieAlgemeenListValidLineages(
        { limit: 100 },
        {
            query: {
                select: data =>
                    data.results.map(item => ({
                        text: item.Title,
                        to: `${model.defaults.plural}/${item.UUID}`,
                    })),
            },
        }
    )

    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Omgevingsvisie' },
    ]

    return (
        <>
            <Helmet title={META.title}>
                <meta name="description" content={META.description} />
                <meta name="og:description" content={META.description} />
            </Helmet>

            <PageHero image={imgEnvironmentProgram} />

            <Container className="overflow-hidden pb-20">
                <div className="col-span-6 lg:col-span-4">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                    <Heading level="1" size="xxl" className="mt-4">
                        Omgevingsvisie
                    </Heading>
                    <Text size="l" className="mt-4">
                        De Omgevingsvisie van Zuid-Holland bestaat uit enkele
                        inleidende hoofdstukken, gevolgd door de provinciale
                        ambities, beleidsdoelen en beleidskeuzes.
                    </Text>
                    <Text className="mt-5">
                        In de inleidende hoofdstukken worden onder andere de
                        sturingsfilosofie en de huidige staat van Zuid-Holland
                        beschreven. Het laatste inleidende hoofdstuk beschrijft
                        waar we als Provincie Zuid-Holland naar toe willen. Dat
                        wordt verder uitgewerkt in de ambities, beleidsdoelen en
                        beleidskeuzes.
                    </Text>
                    <Heading level="2" className="mt-8">
                        Inleidende hoofdstukken
                    </Heading>
                    <div className="mt-3 flex flex-col gap-1">
                        {isFetching ? (
                            <LoaderSpinner />
                        ) : (
                            <ul className="flex flex-col">
                                {data?.map(item => (
                                    <ListLink key={item.to} asChild>
                                        <li>
                                            <Link to={item.to}>
                                                {item.text}
                                            </Link>
                                        </li>
                                    </ListLink>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Heading level="2" className="mt-8">
                        Ambities
                    </Heading>
                    <Text className="mt-3">
                        De ambities geven aan waar de provincie naar wil
                        streven. De ambities komen voort uit het coalitieakkoord
                        en worden vastgesteld in de Omgevingsvisie.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-4 block underline"
                        to="/omgevingsvisie/ambities">
                        Bekijk de ambities
                    </Link>
                    <Heading level="2" className="mt-8">
                        Beleidsdoelen
                    </Heading>
                    <Text className="mt-4">
                        De beleidsdoelen geven aan wat de provincie wil
                        bereiken. De beleidsdoelen zijn een uitwerking van de
                        ambities en komen voort uit de begroting.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-4 block underline"
                        to="/omgevingsvisie/beleidsdoelen">
                        Bekijk de beleidsdoelen
                    </Link>
                    <Heading level="2" className="mt-8">
                        Beleidskeuzes
                    </Heading>
                    <Text className="mt-4">
                        De beleidskeuzes geven aan hoe de provincie haar doelen
                        wil bereiken. De beleidskeuzes zijn een uitwerking van
                        de beleidsdoelen en komen voort uit de Omgevingsvisie.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-4 block underline"
                        to="/omgevingsvisie/beleidskeuzes">
                        Bekijk de beleidskeuzes
                    </Link>
                </div>
            </Container>
        </>
    )
}

export default EnvironmentVision
