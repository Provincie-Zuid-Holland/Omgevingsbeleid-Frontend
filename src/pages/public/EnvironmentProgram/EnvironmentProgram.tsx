import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import imgEnvironmentProgram from '@/images/environment-program.webp'

function EnvironmentProgram() {
    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
    ]

    return (
        <div>
            <div
                className="hidden w-full h-[288px] bg-center bg-no-repeat bg-cover bg-pzh-blue md:block"
                style={{
                    backgroundImage: `url(${imgEnvironmentProgram})`,
                }}
            />
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6 lg:col-span-4">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                    <Heading level="1" className="mt-4">
                        Omgevingsprogramma
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        In het Omgevingsprogramma staat beschreven welke
                        maatregelen de provincie treft om de visie waar te
                        maken. Het Omgevingsprogramma geeft bijvoorbeeld aan
                        voor welke initiatieven subsidies worden verleend en aan
                        welke provinciale wegen wordt gewerkt. Het
                        Omgevingsprogramma is een overzicht van alle maatregelen
                        inclusief de onderliggende activiteiten.
                    </Text>
                    <Heading level="2" className="mt-8">
                        Thematische programma’s
                    </Heading>
                    <Text type="body" className="mt-3">
                        De provincie heeft een aantal beleidsdoelen
                        geformuleerd. Deze beleidsdoelen zijn direct de thema’s
                        voor de thematische programma’s. Een overzicht van alle
                        beleidsdoelen vindt u hier.
                    </Text>
                    <Link
                        className="block mt-3 underline text-pzh-green hover:text-pzh-green-dark"
                        to="/omgevingsprogramma/thematische-programmas">
                        Bekijk de thematische programma’s
                    </Link>
                    <Heading level="2" className="mt-8">
                        Gebiedsprogramma’s
                    </Heading>
                    <Text type="body" className="mt-3">
                        Maatregelen worden vaak genomen voor een specifieke
                        regio of een gebied. Hierdoor is het mogelijk om een
                        gebiedsprogramma op te stellen. Een lijstje van deze
                        gebieden (welke soms overlappen) is hieronder te vinden.
                    </Text>
                    <Link
                        className="block mt-3 underline text-pzh-green hover:text-pzh-green-dark"
                        to="/omgevingsprogramma/gebiedsprogrammas">
                        Bekijk de gebiedsprogramma’s
                    </Link>
                    <Heading level="2" className="mt-8">
                        Maatregelen
                    </Heading>
                    <Text type="body" className="mt-3">
                        De maatregelen geven aan wat de provincie gaat doen om
                        de keuzes uit te voeren. De maatregelen zijn een
                        uitwerking van de beleidskeuzes en komen voort uit het
                        Omgevingsprogramma.
                    </Text>
                    <Link
                        className="block mt-3 underline text-pzh-green hover:text-pzh-green-dark"
                        to="/omgevingsprogramma/maatregelen">
                        Bekijk de maatregelen
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default EnvironmentProgram
