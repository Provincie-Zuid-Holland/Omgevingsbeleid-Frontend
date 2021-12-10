import React from "react"
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import imagePlanningAndReleases from "./../../images/planning-and-releases.png"

import Footer from "./../../components/Footer"
import Container from "./../../components/Container"
import HorizontalDivider from "./../../components/HorizontalDivider"
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"

function RaadpleegPlanningAndReleases() {
    return (
        <div>
            <Container className="overflow-hidden">
                <div className="col-span-6 mb-0 lg:col-span-3 sm:mb-16 lg:mb-0">
                    <Heading
                        level="1"
                        className="mt-1 sm:mt-8 md:mt-12 lg:mt-16"
                    >
                        Planning & Releases
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        Digitaal Omgevingsbeleid is altijd in ontwikkeling,
                        benieuwd waar we aan werken? Op deze pagina vindt u de
                        recent opgeleverde functionaliteiten en een planning
                        voor de langere termijn.
                    </Text>
                    <Text type="body" className="mt-4 sm:mt-8">
                        Uiteraard vinden wij het fijn om feedback en input te
                        ontvangen van onze gebruikers. Heeft u vragen, ideeën of
                        suggesties? Neem gerust contact op met ons via
                        omgevingsbeleid@pzh.nl.
                    </Text>
                </div>
                <div
                    className="relative hidden col-span-3 lg:block"
                    style={{ minHeight: "480px" }} // To mimick the height of the 480px div with the absolute position
                >
                    <div
                        style={{
                            height: "480px",
                            width: "calc(50vw)",
                        }}
                        className={`absolute text-center left-0 top-0 h-full bg-gray-100 sm:inline-block`}
                    >
                        <img
                            alt="Afbeelding van twee maquettes"
                            className={`object-cover w-full h-full`}
                            src={imagePlanningAndReleases}
                        />
                    </div>
                </div>
            </Container>
            <img
                src={imagePlanningAndReleases}
                alt="Afbeelding van twee maquettes"
                className="block w-full h-64 mt-6 bg-center bg-no-repeat bg-cover bg-pzh-blue lg:hidden image-home-1"
            />
            <Container className="pb-8 lg:pb-12">
                <Heading className="col-span-6 mt-6 sm:mt-8" level="2">
                    Belangrijke ontwikkelingen
                </Heading>
                <Text type="body" className="col-span-6 mt-4">
                    Ons ontwikkelteam werkt volgens de Agile methodiek, korte
                    iteraties (sprints) waar na elke iteratie iets wordt
                    opgeleverd. Na een aantal sprints wordt er een groter geheel
                    opgeleverd. Deze grotere onderdelen hebben wij op een
                    roadmap staan.
                </Text>
                <OntwikkelingenList>
                    <OntwikkelingenListItem title="Export automatisch kunnen laten verlopen">
                        Dit is eigenlijk het hoofddoel van Digitaal
                        Omgevingsbeleid. De behandelend ambtenaar stelt beleid
                        op binnen dit systeem, waarna een export kan worden
                        gemaakt naar de landelijke voorzieningen.
                    </OntwikkelingenListItem>
                    <OntwikkelingenListItem title="Digitoegankelijk">
                        Zorgen dat alle gebruikers met het systeem kunnen
                        werken, duidelijk contrast tussen tekst en achtergrond
                        en bijvoorbeeld geen afleidende, knipperende onderdelen.
                    </OntwikkelingenListItem>
                    <OntwikkelingenListItem title="Open Source">
                        De code die wordt geschreven door ons team, stellen we
                        ook beschikbaar aan andere overheden. Het zou zonde zijn
                        als iedereen het wiel opnieuw gaat uitvinden.
                    </OntwikkelingenListItem>
                    <OntwikkelingenListItem title="Zoeken op de kaart">
                        Het is wel zo handig om de verordening en visie op een
                        kaart te kunnen zien, zeker op een specifiek punt of
                        gebied. Daarom gaan we aan de slag met het zoeken op de
                        kaart. Hiermee kun je een gebied tekenen of een punt op
                        de kaart zetten om te zoeken, en daarna de resultaten
                        visueel gepresenteerd krijgen.
                    </OntwikkelingenListItem>
                    <OntwikkelingenListItem title="Inhoudelijke verrijking">
                        Het complete omgevingsbeleid moet straks terug te vinden
                        zijn in deze omgeving. Daarom zullen we de komende tijd
                        aan de slag gaan om de database uit te breiden.
                    </OntwikkelingenListItem>
                    <OntwikkelingenListItem title="Integraal werken">
                        Modulair werken noemen wij dat, het kunnen aanbieden van
                        verschillende beleidsobjecten, als een groep documenten.
                    </OntwikkelingenListItem>
                </OntwikkelingenList>
            </Container>
            <HorizontalDivider />
            <Container className="pt-8 lg:pt-12">
                <Heading className="col-span-6" level="2">
                    Releases
                </Heading>
                <Text type="body" className="col-span-6 mt-4">
                    Wanneer er onderdelen ontwikkeld en getest zijn door ons
                    team, dan zetten wij deze nieuwe onderdelen online.
                    Hieronder ziet u een overzicht van de releases inclusief de
                    onmschrijving wat er wanneer online is gekomen.
                </Text>
                <ReleaseList>
                    <ReleaseListItem
                        title="Release 41"
                        date="Donderdag 14 juni 2021"
                        description="Deze periode stond in het teken van het ontwikkelen van een netwerkvisualisatie en het kunnen vergelijk van versies van beleid (revisie-overzicht)."
                        items={{
                            Ontwikkelingen: [
                                "Netwerkvisualisatie voor het complete omgevingsbeleid",
                                "Netwerkvisualisatie vanuit beleidsobjecten",
                                "Revisie-overzicht en het kunnen vergelijken van meerdere versies van één beleidsobject",
                            ],
                            Bugfixes: [
                                "Zoeken werkt nu ook op geformateerde inhoud",
                                "Het binnenhalen van het adres gebeurt nu veel sneller",
                            ],
                        }}
                    />
                    <ReleaseListItem
                        title="Release 40"
                        date="Dinsdag 1 maart 2021"
                        description="Deze periode stond in het teken van het opschonen van de code."
                        items={{
                            Ontwikkelingen: [
                                "Vernieuwde API endpoints, de logica en structuur zijn behoorlijk verbeterd",
                                "Front-end code is enorm opgeschoond",
                            ],
                            Bugfixes: [
                                "Zoeken werkt nu ook op geformateerde inhoud",
                                "Het binnenhalen van het adres gebeurt nu veel sneller",
                            ],
                        }}
                    />
                </ReleaseList>
            </Container>
            <Footer />
        </div>
    )
}

const ReleaseList = ({ children }) => {
    return (
        <ul className="grid grid-cols-6 col-span-6 gap-x-10 gap-y-0">
            {children}
            <li className="col-span-6 py-4 underline lg:col-span-5 lg:col-start-2 text-pzh-green">
                Toon meer releases
            </li>
        </ul>
    )
}

const ReleaseListItem = ({ title, description, date, items }) => {
    return (
        <li className="relative col-span-6 pb-8 mt-4 border-b border-gray-300 sm:mt-8">
            <div className="grid grid-cols-6 col-span-6 gap-x-10 gap-y-0">
                <div className="col-span-6 opacity-50 lg:col-span-1 text-pzh-blue-dark">
                    {date}
                </div>
                <div className="col-span-6 lg:col-span-5">
                    <Heading
                        className="mt-4 text-pzh-pink-dark lg:mt-0"
                        level="3"
                    >
                        {title}
                    </Heading>
                    <Text className="mt-3" type="body">
                        {description}
                    </Text>
                    {Object.keys(items).map((key) => (
                        <div className="mt-6">
                            <span className="inline-block font-bold">
                                {key}
                            </span>
                            <ul className="pl-6">
                                {items[key].map((item) => (
                                    <li className="pl-1 list-disc list-outside">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </li>
    )
}

const OntwikkelingenList = ({ children }) => {
    return (
        <ul className="grid grid-cols-6 col-span-6 gap-x-10 gap-y-0">
            {children}
        </ul>
    )
}

const OntwikkelingenListItem = ({ children, title, icon }) => {
    return (
        <li className="relative col-span-6 pl-8 mt-6 lg:col-span-3 sm:mt-8">
            <span className="absolute top-0 left-0 w-4 h-4">
                <FontAwesomeIcon
                    className="text-lg text-pzh-pink-dark"
                    icon={icon ? icon : faExternalLinkAlt}
                />
            </span>
            <div>
                <Heading level="3" className="text-pzh-pink-dark">
                    {title}
                </Heading>
                <p className="mt-2">{children}</p>
            </div>
        </li>
    )
}

export default RaadpleegPlanningAndReleases
