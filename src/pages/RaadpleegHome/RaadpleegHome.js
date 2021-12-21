import React from "react"
import { Link } from "react-router-dom"
import { faFilePdf } from "@fortawesome/pro-regular-svg-icons"
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons"

// Import Components
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"
import Container from "./../../components/Container"
import Footer from "./../../components/Footer"

import SearchSection from "./SearchSection"
import ReleaseItem from "./ReleaseItem"
import DocumentLink from "./DocumentLink"

import {
    getResponsiveImageHeight,
    getResponsiveImageOffset,
} from "./../../utils/responsiveImage"

/**
 * Landing page component.
 */
const RaadpleegHome = () => {
    const responsiveImageHeight = getResponsiveImageHeight()
    const responsiveImageOffset = getResponsiveImageOffset()

    return (
        <>
            <Container
                style={{
                    minHeight: "576px",
                }}
                className="overflow-hidden"
            >
                <div className="col-span-6 mb-8 lg:mb-16 lg:col-span-3">
                    <Heading
                        level="1"
                        className="mt-4 text-3xl font-bold md:mt-12 lg:mt-16 text-pzh-blue"
                    >
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
                <div className="relative hidden col-span-3 lg:block">
                    <div
                        className={`inline-block absolute bg-cover bg-no-repeat bg-center left-0 top-0 h-full image-home-1 text-white bg-gray-100`}
                        style={{
                            height: "480px",
                            width: "50vw",
                        }}
                    />
                </div>
            </Container>

            <div className="block w-full h-64 bg-center bg-no-repeat bg-cover bg-pzh-blue lg:hidden image-home-1"></div>

            <Container className="py-6 border-t border-gray-300 md:py-8 lg:py-16">
                <div className="col-span-6 lg:col-span-2">
                    <Heading
                        level="2"
                        id="homepage-zoeken"
                        className="font-bold"
                    >
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
                            Omgevingsbeleid in staat: de{" "}
                            <span
                                className="underline cursor-pointer"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            "#omgevingsvisie-section"
                                        )
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                Omgevingsvisie
                            </span>
                            , het{" "}
                            <span
                                className="underline cursor-pointer"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            "#omgevingsprogramma-section"
                                        )
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                Omgevingsprogramma
                            </span>{" "}
                            en de{" "}
                            <span
                                className="underline cursor-pointer"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            "#omgevingsverordening-section"
                                        )
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                Omgevingsverordening
                            </span>
                            . Zo staat het beleid niet meer in tientallen
                            documenten, maar in één systeem bij elkaar. Dit
                            maakt het allemaal een stuk overzichtelijker.
                        </Text>
                    </div>
                </Container>
            </div>

            <Container
                className="pt-0 pb-3 md:pt-12 md:pb-6 lg:pt-16 lg:pb-8 lg:flex-col"
                id="omgevingsvisie-section"
            >
                <div
                    className={`inline-block mb-8 lg:hidden bg-cover col-span-6 lg:col-span-4 bg-no-repeat bg-center image-home-2 text-white bg-gray-100 md:relative absolute left-0 w-screen md:w-auto`}
                    style={responsiveImageHeight}
                />
                <div
                    className="flex flex-col justify-center col-span-6 pt-6 lg:col-span-2 md:pt-0"
                    style={responsiveImageOffset}
                >
                    <Heading level="2">Omgevingsvisie</Heading>
                    <Text type="body" className="mt-4">
                        De visie van de provincie Zuid-Holland geeft aan waar de
                        provincie voor staat. Het beschrijft hoe de provincie de
                        toekomst van Zuid-Holland voor zich ziet. De
                        Omgevingsvisie bevat verschillende onderdelen: in de{" "}
                        <Link
                            className="underline text-pzh-green hover:text-pzh-green-dark"
                            to="/overzicht/ambities"
                        >
                            ambities
                        </Link>{" "}
                        wordt omschreven waar we als provincie heen willen, de{" "}
                        <Link
                            className="underline text-pzh-green hover:text-pzh-green-dark"
                            to="/overzicht/beleidsdoelen"
                        >
                            beleidsdoelen
                        </Link>{" "}
                        geven hier richting aan en de{" "}
                        <Link
                            className="underline text-pzh-green hover:text-pzh-green-dark"
                            to="/overzicht/beleidskeuzes"
                        >
                            beleidskeuzes
                        </Link>{" "}
                        bepalen hoe de ambities bereikt dienen te worden.
                    </Text>
                </div>
                <div
                    className={`hidden lg:inline-block bg-cover col-span-6 lg:col-span-4 bg-no-repeat bg-center image-home-2 text-white bg-gray-100`}
                    style={responsiveImageHeight}
                />
            </Container>

            <Container
                className="md:py-6 lg:py-8"
                id="omgevingsprogramma-section"
            >
                <div
                    className={`lg:mb-0 mb-8 inline-block bg-cover col-span-6 lg:col-span-4 bg-no-repeat bg-center image-home-3 text-white bg-gray-100`}
                    style={responsiveImageHeight}
                />
                <div className="flex flex-col justify-center col-span-6 lg:col-span-2 ">
                    <Heading level="2" color="text-pzh-yellow-dark">
                        Omgevingsprogramma
                    </Heading>
                    <Text type="body" className="mt-4">
                        In het Omgevingsprogramma staat beschreven welke{" "}
                        <Link
                            className="underline text-pzh-green hover:text-pzh-green-dark"
                            to="/overzicht/maatregelen"
                        >
                            maatregelen
                        </Link>{" "}
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
                id="omgevingsverordening-section"
            >
                <div
                    className={`inline-block mb-8 lg:hidden bg-cover col-span-6 lg:col-span-4 bg-no-repeat bg-center image-home-4 text-white bg-gray-100`}
                    style={responsiveImageHeight}
                />
                <div className="flex flex-col justify-center col-span-6 lg:col-span-2">
                    <Heading level="2" color="text-pzh-red-dark">
                        Omgevingsverordening
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
                        leefomgeving zijn ondergebracht in de{" "}
                        <Link
                            className="underline text-pzh-green hover:text-pzh-green-dark"
                            to="/detail/verordening"
                        >
                            Omgevingsverordening
                        </Link>
                        .
                    </Text>
                </div>
                <div
                    className={`hidden lg:inline-block bg-cover col-span-6 lg:col-span-4 bg-no-repeat bg-center image-home-4 text-white bg-gray-100`}
                    style={responsiveImageHeight}
                />
            </Container>

            <Container className="py-12 border-t border-gray-300">
                <div className="col-span-6">
                    <Heading
                        level="3"
                        className="mb-4 text-2xl font-bold text-pzh-blue"
                    >
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
                <ul className="grid grid-cols-6 col-span-6 lg:col-span-4">
                    <DocumentLink
                        href="docs/Omgevingsvisie_Zuid-Holland_Deel_1.pdf"
                        iconLeft={faFilePdf}
                        title="Omgevingsvisie Zuid-Holland Deel 1"
                        rel="noopener noreferrer"
                        className="col-span-6 mt-2 lg:col-span-3 lg:mt-0"
                    />
                    <DocumentLink
                        href="https://lta.zuid-holland.nl/"
                        iconLeft={faExternalLinkAlt}
                        title="De Lange Termijn Agenda Omgevingsbeleid"
                        rel="noopener noreferrer"
                        className="col-span-6 mt-2 lg:col-span-3 lg:mt-0"
                    />
                </ul>
            </Container>

            <div className="w-full bg-pzh-blue-dark">
                <Container className="py-12">
                    <div className="col-span-6 lg:col-span-2">
                        <Heading level="2" color="text-white">
                            Een digitaal systeem, continu in ontwikkeling
                        </Heading>
                        <Text type="body" color="text-white" className="mt-4">
                            We ontwikkelen zelf een systeem voor het opstellen
                            van digitaal beleid. Deze raadpleegomgeving is daar
                            onderdeel van.
                        </Text>
                        <Text type="body" color="text-white" className="mt-4">
                            Hiernaast tonen wij een overzicht met recent
                            opgeleverde functionaliteiten.
                        </Text>
                    </div>
                    <div className="col-span-6 mt-6 lg:mt-0 lg:col-span-4">
                        <div className="grid grid-cols-4 gap-3 text-white md:gap-10">
                            <ReleaseItem
                                date="Vrijdag 1 maart"
                                releaseNumber="31"
                                releaseNotes={[
                                    "Mogelijk gemaakt om te zoeken op de kaart",
                                    "Vanuit een ambitie, beleidsdoel en maatregel is het nu mogelijk om gekoppelde onderdelen in te zien",
                                ]}
                            />
                            <ReleaseItem
                                date="Vrijdag 1 maart"
                                releaseNumber="31"
                                releaseNotes={[
                                    "Mogelijk gemaakt om te zoeken op de kaart",
                                    "Vanuit een ambitie, beleidsdoel en maatregel is het nu mogelijk om gekoppelde onderdelen in te zien",
                                ]}
                            />
                            <div className="col-span-4 mt-8 md:col-span-3 md:col-start-2 md:mt-0">
                                <Text
                                    type="body"
                                    className="underline"
                                    color="text-white"
                                >
                                    <Link to="/planning-en-releases">
                                        Bekijk alle releases & planning
                                    </Link>
                                </Text>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Footer />
        </>
    )
}

export default RaadpleegHome
