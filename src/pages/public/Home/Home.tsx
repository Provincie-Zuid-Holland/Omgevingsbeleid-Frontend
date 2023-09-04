import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare, FilePdf } from '@pzh-ui/icons'

import { Container } from '@/components/Container'
import imageLanding from '@/images/landing-1.webp'
import {
    getResponsiveImageHeight,
    getResponsiveImageOffset,
} from '@/utils/responsiveImage'

import DocumentLink from './DocumentLink'
import SearchSection from './SearchSection'

/**
 * Landing page component.
 */
const Home = () => {
    const responsiveImageHeight = getResponsiveImageHeight()
    const responsiveImageOffset = getResponsiveImageOffset()

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Provincie Zuid-Holland heeft haar beleid eenvoudiger,
                        transparanter en toegankelijker gemaakt. Via deze
                        website kan je al het Omgevingsbeleid van de provincie
                        Zuid-Holland inzien. Denk bijvoorbeeld aan de
                        provinciale ambities voor een duurzame economie, de
                        regelgeving rondom gevaarlijke gassen of aan de
                        maatregelen die de provincie neemt om natuur te
                        herstellen."
                />
            </Helmet>

            <Container className="overflow-hidden lg:min-h-[576px]">
                <div className="col-span-6 mb-8 lg:col-span-3 lg:mb-16">
                    <Heading
                        level="1"
                        className="mt-4 text-3xl font-bold text-pzh-blue md:mt-12 lg:mt-16">
                        Omgevingsbeleid
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        Provincie Zuid-Holland heeft haar beleid eenvoudiger,
                        transparanter en toegankelijker gemaakt. Via deze
                        website kan je al het Omgevingsbeleid van de provincie
                        Zuid-Holland inzien. Denk bijvoorbeeld aan de
                        provinciale ambities voor een duurzame economie, de
                        regelgeving rondom gevaarlijke gassen of aan de
                        maatregelen die de provincie neemt om natuur te
                        herstellen.
                    </Text>
                    <Text type="body" className="mt-8">
                        Zo wordt voor iedereen zichtbaar waar de provincie aan
                        wil werken en wat binnen de provinciegrenzen is
                        toegestaan. Daarnaast kan het Omgevingsbeleid digitaal
                        worden aangepast zodat het altijd up-to-date is.
                    </Text>
                </div>
                <div className="relative col-span-3 hidden lg:block">
                    <img
                        src={imageLanding}
                        alt=""
                        className="absolute left-0 top-0 inline-block h-[480px] min-w-[50vw] object-cover"
                    />
                </div>
            </Container>

            <img
                src={imageLanding}
                alt=""
                className="left-0 top-0 block h-64 w-full object-cover lg:hidden"
            />

            <Container className="border-t border-gray-300 py-6 md:py-8 lg:py-16">
                <div className="col-span-6 lg:col-span-2">
                    <Heading
                        level="2"
                        id="homepage-zoeken"
                        className="font-bold">
                        Zoeken in het beleid
                    </Heading>
                    <Text type="body" className="mt-4">
                        Hier kan je zoeken in het Omgevingsbeleid van
                        Zuid-Holland. Je kan zowel zoeken op tekst als op
                        locatie.
                    </Text>
                </div>

                <SearchSection />
            </Container>

            <div className="w-full bg-pzh-blue">
                <Container className="py-12">
                    <div className="col-span-6">
                        <Heading level="2" color="text-white">
                            Opbouw van het beleid
                        </Heading>
                        <Text type="body" color="text-white" className="mt-4">
                            De Omgevingswet streeft ernaar om al het beleid over
                            de fysieke leefomgeving te vereenvoudigen zodat het
                            voor iedereen is te begrijpen. Daarom zet de
                            provincie drie instrumenten in waar al het
                            Omgevingsbeleid in staat: de{' '}
                            <button
                                className="cursor-pointer underline"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            '#omgevingsvisie-section'
                                        )
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }>
                                Omgevingsvisie
                            </button>
                            , het{' '}
                            <button
                                className="cursor-pointer underline"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            '#omgevingsprogramma-section'
                                        )
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }>
                                Omgevingsprogramma
                            </button>{' '}
                            en de{' '}
                            <button
                                className="cursor-pointer underline"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            '#omgevingsverordening-section'
                                        )
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }>
                                Omgevingsverordening
                            </button>
                            . Zo staat het beleid niet meer in tientallen
                            documenten, maar in één systeem bij elkaar. Dit
                            maakt het allemaal een stuk overzichtelijker.
                        </Text>
                    </div>
                </Container>
            </div>

            <Container
                className="pb-3 pt-0 md:pb-6 md:pt-12 lg:flex-col lg:pb-8 lg:pt-16"
                id="omgevingsvisie-section">
                <div
                    className="image-home-2 absolute left-0 col-span-6 mb-8 inline-block w-screen bg-gray-100 bg-cover bg-center bg-no-repeat text-white md:relative md:w-auto lg:col-span-4 lg:hidden"
                    style={responsiveImageHeight}
                />
                <div
                    className="col-span-6 flex flex-col justify-center pt-6 md:pt-0 lg:col-span-2"
                    style={responsiveImageOffset}>
                    <Heading level="2">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Omgevings­visie
                    </Heading>
                    <Text type="body" className="mt-4">
                        De visie van de provincie Zuid-Holland geeft aan waar de
                        provincie voor staat. Het beschrijft hoe de provincie de
                        toekomst van Zuid-Holland voor zich ziet. De
                        Omgevingsvisie bevat verschillende onderdelen: in de{' '}
                        <Hyperlink
                            text="ambities"
                            to="/omgevingsvisie/ambities"
                        />{' '}
                        wordt omschreven waar we als provincie heen willen, de{' '}
                        <Hyperlink
                            text="beleidsdoelen"
                            to="/omgevingsvisie/beleidsdoelen"
                        />{' '}
                        geven hier richting aan en de{' '}
                        <Hyperlink
                            text="beleidskeuzes"
                            to="/omgevingsvisie/beleidskeuzes"
                        />{' '}
                        bepalen hoe de ambities bereikt dienen te worden.
                    </Text>
                </div>
                <div
                    className="image-home-2 col-span-6 hidden bg-gray-100 bg-cover bg-center bg-no-repeat text-white lg:col-span-4 lg:inline-block"
                    style={responsiveImageHeight}
                />
            </Container>

            <Container
                className="md:py-6 lg:py-8"
                id="omgevingsprogramma-section">
                <div
                    className="image-home-3 col-span-6 mb-8 inline-block bg-gray-100 bg-cover bg-center bg-no-repeat text-white lg:col-span-4 lg:mb-0"
                    style={responsiveImageHeight}
                />
                <div className="col-span-6 flex flex-col justify-center lg:col-span-2 ">
                    <Heading level="2" color="text-pzh-blue">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Omgevings­programma
                    </Heading>
                    <Text type="body" className="mt-4">
                        In het{' '}
                        <Link
                            className="text-pzh-green underline hover:text-pzh-green-dark"
                            to="omgevingsprogramma">
                            Omgevingsprogramma
                        </Link>{' '}
                        staat beschreven welke{' '}
                        <Link
                            className="text-pzh-green underline hover:text-pzh-green-dark"
                            to="omgevingsprogramma/maatregelen">
                            maatregelen
                        </Link>{' '}
                        de provincie treft om de visie waar te maken. Het
                        Omgevingsprogramma geeft bijvoorbeeld aan voor welke
                        initiatieven subsidies worden verleend en aan welke
                        provinciale wegen wordt gewerkt. Het Omgevingsprogramma
                        is een overzicht van alle maatregelen inclusief de
                        onderliggende activiteiten.
                    </Text>
                </div>
            </Container>

            <Container
                className="pb-8 lg:pt-16"
                id="omgevingsverordening-section">
                <div
                    className="image-home-4 col-span-6 mb-8 inline-block bg-gray-100 bg-cover bg-center bg-no-repeat text-white lg:col-span-4 lg:hidden"
                    style={responsiveImageHeight}
                />
                <div className="col-span-6 flex flex-col justify-center lg:col-span-2">
                    <Heading level="2" color="text-pzh-blue">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Omgevings­verordening
                    </Heading>
                    <Text type="body" className="mt-4">
                        Voor het in stand houden van goede omgevingskwaliteit
                        zijn er regels nodig over wat wel en niet is toegestaan
                        binnen de provinciegrenzen. Denk bijvoorbeeld aan regels
                        in stiltegebieden of ter bescherming van cultureel
                        erfgoed. Het merendeel van deze regels betreffen
                        instructieregels die voorschrijven hoe waterschappen en
                        gemeenten bepaalde onderwerpen op moeten nemen in hun
                        plannen. Daarnaast zijn er een aantal direct werkende
                        regels waar burgers en bedrijven zich aan moeten houden.
                        Al deze regels van de provincie over de fysieke
                        leefomgeving zijn ondergebracht in de{' '}
                        <a
                            className="text-pzh-green underline hover:text-pzh-green-dark"
                            href="https://www.ruimtelijkeplannen.nl/web-roo/transform/NL.IMRO.9928.OVerordening2019-GC10/pt_NL.IMRO.9928.OVerordening2019-GC10.xml"
                            rel="noopener noreferrer"
                            target="_blank">
                            Omgevingsverordening
                        </a>
                        .
                    </Text>
                </div>
                <div
                    className="image-home-4 col-span-6 hidden bg-gray-100 bg-cover bg-center bg-no-repeat text-white lg:col-span-4 lg:inline-block"
                    style={responsiveImageHeight}
                />
            </Container>

            <Container className="border-t border-gray-300 py-12">
                <div className="col-span-6">
                    <Heading
                        level="3"
                        className="mb-4 text-2xl font-bold text-pzh-blue">
                        Documenten & Links
                    </Heading>
                </div>
                <div className="col-span-6 lg:col-span-2">
                    <Text type="body">
                        We zijn hard bezig met het vullen van onze database.
                        Sommige onderdelen bieden we op dit moment nog aan als
                        PDF’s of via een externe bron.
                    </Text>
                </div>
                <ul className="col-span-6 grid grid-cols-6 lg:col-span-4">
                    <DocumentLink
                        href="docs/Omgevingsvisie_Zuid-Holland_Deel_1.pdf"
                        iconLeft={<FilePdf />}
                        title="Omgevingsvisie Zuid-Holland Deel 1"
                        className="col-span-6 mt-2 lg:col-span-3 lg:mt-0"
                    />
                    <DocumentLink
                        href="https://lta.zuid-holland.nl/"
                        iconLeft={<ArrowUpRightFromSquare />}
                        title="De Lange Termijn Agenda Omgevingsbeleid"
                        className="col-span-6 mt-2 lg:col-span-3 lg:mt-0"
                    />
                </ul>
            </Container>
        </>
    )
}

export default Home
