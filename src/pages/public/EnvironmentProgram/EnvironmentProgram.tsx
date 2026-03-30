import { Heading, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import PageHero from '@/components/PageHero'
import imgEnvironmentProgram from '@/images/environment-program.webp'

const META = {
    title: 'Omgevingsprogramma',
    description:
        'In het Omgevingsprogramma staat beschreven welke maatregelen de provincie treft om de visie waar te maken. Het Omgevingsprogramma geeft bijvoorbeeld aan voor welke initiatieven subsidies worden verleend en aan welke provinciale wegen wordt gewerkt. Het Omgevingsprogramma is een overzicht van alle maatregelen inclusief de onderliggende activiteiten.',
}

function EnvironmentProgram() {
    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Omgevingsprogramma' },
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
                        Omgevingsprogramma
                    </Heading>
                    <Text size="l" className="mt-3">
                        In het Omgevingsprogramma staat beschreven welke
                        maatregelen de provincie treft om de visie waar te
                        maken. Het Omgevingsprogramma geeft bijvoorbeeld aan
                        voor welke initiatieven subsidies worden verleend en aan
                        welke provinciale wegen wordt gewerkt. Het
                        Omgevingsprogramma is een overzicht van alle maatregelen
                        inclusief de onderliggende activiteiten.
                    </Text>
                    <Heading level="2" className="mt-8">
                        Verplichte programma’s
                    </Heading>
                    <Text className="mt-3">
                        Verplichte programma's zijn meestal een voortzetting van
                        de al bestaande plannen en programma's die volgen uit
                        Europese regelgeving. Het gaat onder meer om de
                        Richtlijn omgevingslawaai, de Kaderrichtlijn Water, de
                        Europese Richtlijn Overstromingsrisico's en de Richtlijn
                        luchtkwaliteit. De artikelen 3.6 tot en met 3.9 van de
                        Omgevingswet verplichten gemeenten, waterschappen,
                        provincies en het Rijk om voor deze domeinen programma's
                        vast te stellen. Voor de provincies (artikel 3.8
                        Omgevingswet) gaat het om het Regionaal waterprogramma,
                        het Beheerplan Natura 2000 en het Actieplan geluid.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-3 block underline"
                        to="/omgevingsprogramma/verplichte-programmas">
                        Bekijk de verplichte programma’s
                    </Link>
                    <Heading level="2" className="mt-8">
                        Thematische programma’s
                    </Heading>
                    <Text className="mt-3">
                        De provincie heeft een aantal beleidsdoelen
                        geformuleerd. Deze beleidsdoelen zijn direct de thema’s
                        voor de thematische programma’s. Een overzicht van alle
                        beleidsdoelen vindt u hier.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-3 block underline"
                        to="/omgevingsprogramma/thematische-programmas">
                        Bekijk de thematische programma’s
                    </Link>
                    <Heading level="2" className="mt-8">
                        Gebiedsprogramma’s
                    </Heading>
                    <Text className="mt-3">
                        Maatregelen worden vaak genomen voor een specifieke
                        regio of een gebied. Hierdoor is het mogelijk om een
                        gebiedsprogramma op te stellen. Een lijstje van deze
                        gebieden (welke soms overlappen) is hieronder te vinden.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-3 block underline"
                        to="/omgevingsprogramma/gebiedsprogrammas">
                        Bekijk de gebiedsprogramma’s
                    </Link>
                    <Heading level="2" className="mt-8">
                        Maatregelen
                    </Heading>
                    <Text className="mt-3">
                        De maatregelen geven aan wat de provincie gaat doen om
                        de keuzes uit te voeren. De maatregelen zijn een
                        uitwerking van de beleidskeuzes en komen voort uit het
                        Omgevingsprogramma.
                    </Text>
                    <Link
                        className="text-pzh-green-500 hover:text-pzh-green-900 mt-3 block underline"
                        to="/omgevingsprogramma/maatregelen">
                        Bekijk de maatregelen
                    </Link>
                </div>
            </Container>
        </>
    )
}

export default EnvironmentProgram
