import { Divider, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare, FilePdf } from '@pzh-ui/icons'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import imageLanding from '@/images/landing-1.webp'
import imageVisie from '@/images/landing-2.webp'
import imageProgramma from '@/images/landing-3.webp'
import imageVerordening from '@/images/landing-4.webp'

import DocumentLink from './DocumentLink'
import SearchSection from './SearchSection'

/**
 * Landing page component.
 */
const Home = () => (
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
                    size="xxl"
                    className="mt-4 md:mt-12 lg:mt-16">
                    Omgevingsbeleid
                </Heading>
                <Text size="l" className="mt-3">
                    Provincie Zuid-Holland heeft haar beleid eenvoudiger,
                    transparanter en toegankelijker gemaakt. Via deze website
                    kan je al het Omgevingsbeleid van de provincie Zuid-Holland
                    inzien. Denk bijvoorbeeld aan de provinciale ambities voor
                    een duurzame economie, de regelgeving rondom gevaarlijke
                    gassen of aan de maatregelen die de provincie neemt om
                    natuur te herstellen.
                </Text>
                <Text className="mt-8">
                    Zo wordt voor iedereen zichtbaar waar de provincie aan wil
                    werken en wat binnen de provinciegrenzen is toegestaan.
                    Daarnaast kan het Omgevingsbeleid digitaal worden aangepast
                    zodat het altijd up-to-date is.
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

        <Divider className="my-0" />

        <Container className="py-6 md:py-8 lg:py-16">
            <div className="col-span-6 lg:col-span-2">
                <Heading level="2" id="homepage-zoeken" className="font-bold">
                    Zoeken in het beleid
                </Heading>
                <Text className="mt-4">
                    Hier kan je zoeken in het Omgevingsbeleid van Zuid-Holland.
                    Je kan zowel zoeken op tekst als op locatie.
                </Text>
            </div>

            <SearchSection />
        </Container>

        <div className="bg-pzh-blue">
            <Container className="py-12">
                <div className="col-span-6">
                    <Heading level="2" color="text-white">
                        Opbouw van het beleid
                    </Heading>
                    <Text color="text-white" className="mt-4">
                        De Omgevingswet streeft ernaar om al het beleid over de
                        fysieke leefomgeving te vereenvoudigen zodat het voor
                        iedereen is te begrijpen. Daarom zet de provincie drie
                        instrumenten in waar al het Omgevingsbeleid in staat: de{' '}
                        <a
                            href="#omgevingsvisie-section"
                            className="cursor-pointer underline">
                            Omgevingsvisie
                        </a>
                        , het{' '}
                        <a
                            href="#omgevingsprogramma-section"
                            className="cursor-pointer underline">
                            Omgevingsprogramma
                        </a>{' '}
                        en de{' '}
                        <a
                            href="#omgevingsverordening-section"
                            className="cursor-pointer underline">
                            Omgevingsverordening
                        </a>
                        . Zo staat het beleid niet meer in tientallen
                        documenten, maar in één systeem bij elkaar. Dit maakt
                        het allemaal een stuk overzichtelijker.
                    </Text>
                </div>
            </Container>
        </div>

        <div className="flex flex-col gap-5 pb-8 md:gap-12 md:py-12 lg:gap-20 lg:py-20">
            <Container
                className="flex items-center"
                id="omgevingsvisie-section">
                <div className="order-2 col-span-6 lg:order-1 lg:col-span-2">
                    <Heading level="2">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Omgevings­visie
                    </Heading>
                    <Text className="mt-4">
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
                <div className="order-1 col-span-6 -mx-5 mb-8 md:mx-0 lg:order-2 lg:col-span-4 lg:mb-0">
                    <img
                        src={imageVisie}
                        alt=""
                        className="h-[250px] w-full object-cover md:h-[300px] lg:h-[522px]"
                    />
                </div>
            </Container>

            <Container
                className="flex items-center"
                id="omgevingsprogramma-section">
                <div className="order-2 col-span-6 lg:col-span-2">
                    <Heading level="2">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Omgevings­programma
                    </Heading>
                    <Text className="mt-4">
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
                <div className="order-1 col-span-6 -mx-5 mb-8 md:mx-0 lg:col-span-4 lg:mb-0">
                    <img
                        src={imageProgramma}
                        alt=""
                        className="h-[250px] w-full object-cover md:h-[300px] lg:h-[522px]"
                    />
                </div>
            </Container>

            <Container
                className="flex items-center"
                id="omgevingsverordening-section">
                <div className="order-2 col-span-6 lg:order-1 lg:col-span-2">
                    <Heading level="2">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Omgevings­verordening
                    </Heading>
                    <Text className="mt-4">
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
                            href="https://www.zuid-holland.nl/onderwerpen/omgevingsbeleid/zuid-hollandse-omgevingsverordening/"
                            rel="noopener noreferrer"
                            target="_blank">
                            Omgevingsverordening
                        </a>
                        .
                    </Text>
                </div>
                <div className="order-1 col-span-6 -mx-5 mb-8 md:mx-0 lg:order-2 lg:col-span-4 lg:mb-0">
                    <img
                        src={imageVerordening}
                        alt=""
                        className="h-[250px] w-full object-cover md:h-[300px] lg:h-[522px]"
                    />
                </div>
            </Container>
        </div>

        <Divider className="my-0" />

        <Container className="py-12">
            <div className="col-span-6">
                <Heading level="3" size="m" className="mb-4">
                    Documenten & Links
                </Heading>
            </div>
            <div className="col-span-6 lg:col-span-2">
                <Text>
                    We zijn hard bezig met het vullen van onze database. Sommige
                    onderdelen bieden we op dit moment nog aan als PDF’s of via
                    een externe bron.
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

export default Home
