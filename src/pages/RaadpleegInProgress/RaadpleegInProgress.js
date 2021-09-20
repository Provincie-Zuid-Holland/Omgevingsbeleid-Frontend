import React from "react"
import { Disclosure } from "@headlessui/react"
import { faPlus } from "@fortawesome/pro-solid-svg-icons"
import { faClock } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import imageInBewerking from "./../../images/in-bewerking.png"

import Footer from "./../../components/Footer"
import Container from "./../../components/Container"
import HorizontalDivider from "./../../components/HorizontalDivider"
import Button from "./../../components/Button"
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"
import { Link } from "react-router-dom"

function RaadpleegInProgress() {
    return (
        <div>
            <Container className="overflow-hidden">
                <div className="col-span-3">
                    <Heading level="1" className="mt-16">
                        In bewerking
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        “Wat speelt er op dit moment?” is een veel gehoorde
                        vraag. Graag laten wij u zien welke onderdelen in
                        bewerking zijn, dit houdt in dat wij alle onderdelen
                        laten zien die in ontwerp zijn.
                    </Text>
                    <Button text="Bekijk overzicht" className="mt-4" />
                </div>
                <div
                    className="relative col-span-3"
                    style={{ minHeight: "480px" }} // To mimick the height of the 480px div with the absolute position
                >
                    <div
                        style={{
                            height: "480px",
                            width: "calc(50vw - 1rem)",
                        }}
                        className={`absolute text-center left-0 top-0 h-full bg-gray-100 sm:inline-block`}
                    >
                        <img
                            alt="Afbeelding van een typemachine"
                            className={`object-cover w-full h-full`}
                            src={imageInBewerking}
                        />
                    </div>
                </div>
            </Container>
            <Container className="pt-8">
                <Heading className="col-span-6" level="2">
                    Laatste bewerkingen
                </Heading>
                <Text className="col-span-6 mt-4" type="body">
                    In onderstaand overzicht worden alle stukken getoond waar
                    een nieuwere versie van is dan het vigerende stuk. In
                    sommige gevallen is het mogelijk om door te klikken naar de
                    ontwerp-versie van een stuk beleid, deze stukken herkent u
                    aan de groene kleur en de lijn onder de tekst. Het overzicht
                    kan eenvoudig worden gesorteerd door op het kopje van de
                    kolom te drukken.
                </Text>
                <TableLatestEdits />
            </Container>
            <HorizontalDivider />
            <Container className="py-12">
                <Heading className="col-span-6" level="2">
                    Besluitvormingsproces
                </Heading>
                <Text className="col-span-6 mt-4" type="body">
                    Beleid wordt niet van de ene op de andere dag gevormd, dit
                    gaat volgens een heel proces. Zeker als het gaat om de
                    besluitvorming. Hieronder tonen wij een overzicht van de
                    statussen die doorlopen worden. Tussen deze statussen zitten
                    een bepaald aantal weken. Sommige stappen zijn voor de
                    procedure, sommige voor{" "}
                    <span className="font-bold">participatie</span> en sommige{" "}
                    <span className="font-bold">ter inzage</span>.
                </Text>
                <div className="col-span-2 mt-8">
                    <Heading level="3">Bevoegdheid GS & PS</Heading>
                    <Text className="mt-4">
                        In het geval van de visie moeten zowel de Gedeputeerde
                        Staten als de Provinciale Staten een besluit nemen over
                        de stukken. Het proces ziet er dan alsvolgt uit.
                    </Text>
                </div>
                <div className="col-span-4 mt-8">
                    {/* Hidden heading to keep the whitespace consistent */}
                    <Heading
                        level="3"
                        className="opacity-0 pointer-events-none"
                    >
                        -
                    </Heading>
                    <div className="mt-4">
                        <Dropdown
                            buttonText="Concept ontwerp"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <Dropdown
                            buttonText="Ontwerp Gedeputeerde Staten (GS)"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <Dropdown
                            buttonText="Ontwerp Provinciale Staten (PS)"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <Dropdown
                            buttonText="Inspraak"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <InspraakNotification />
                        <Dropdown
                            buttonText="Definitief ontwerp Gedeputeerde Staten (GS)"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <Dropdown
                            buttonText="Definitief ontwerp Provinciale Staten (PS)"
                            panelText="Na de inspraak worden de opmerkingen verwerkt en mag ook Gedeputeerde Staten een besluit nemen over de aangepaste stukken. Als laatste stap in het proces, heeft Provinciale staten nog een laatste stem. In deze fase kan x of y nog gebeuren, maar meestal gebeurt z. Dit besluit wordt genomen tijdens een PS-vergadering."
                        />
                        <Dropdown
                            buttonText="Vastgesteld"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                    </div>
                </div>
                <div className="col-span-2 mt-8">
                    <Heading level="3">Bevoegdheid GS</Heading>
                    <Text className="mt-4">
                        Gedeputeerde Staten is bevoegd om besluiten te nemen
                        m.b.t. het omgevingsprogramma. Hiervoor hoeft en kan
                        Provinciale Staten niet mee beslissen. Het proces bij
                        alleen GS ziet er zo uit...
                    </Text>
                </div>
                <div className="col-span-4 mt-8">
                    {/* Hidden heading to keep the whitespace consistent */}
                    <Heading
                        level="3"
                        className="opacity-0 pointer-events-none"
                    >
                        -
                    </Heading>
                    <div className="mt-4">
                        <Dropdown
                            buttonText="Concept ontwerp"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <Dropdown
                            buttonText="Ontwerp Gedeputeerde Staten (GS)"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <Dropdown
                            buttonText="Inspraak"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                        <InspraakNotification />
                        <Dropdown
                            buttonText="Definitief ontwerp Provinciale Staten (PS)"
                            panelText="Na de inspraak worden de opmerkingen verwerkt en mag ook Gedeputeerde Staten een besluit nemen over de aangepaste stukken. Als laatste stap in het proces, heeft Provinciale staten nog een laatste stem. In deze fase kan x of y nog gebeuren, maar meestal gebeurt z. Dit besluit wordt genomen tijdens een PS-vergadering."
                        />
                        <Dropdown
                            buttonText="Vastgesteld"
                            panelText="Felis lectus vehicula dictumst aenean torquent pharetra"
                        />
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    )
}

const InspraakNotification = () => {
    return (
        <div className="px-5 py-2 mt-2 text-sm">
            <FontAwesomeIcon className={`mr-2`} icon={faClock} />
            <span>Een ontwerp ligt minimaal 6 weken ter inspraak</span>
        </div>
    )
}

const Dropdown = ({ buttonText, panelText }) => {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={`flex bg-opacity-10 group items-center justify-between w-full px-5 py-3 font-bold transition-colors duration-200 ease-in text-pzh-pink-dark bg-pzh-pink-dark mt-2 ${
                            open ? "rounded-t-md" : "rounded-md"
                        }`}
                    >
                        <span>{buttonText}</span>
                        <FontAwesomeIcon
                            className={`text-base transition-transform ease-in duration-100 ${
                                open ? "transform rotate-45" : ""
                            }`}
                            icon={faPlus}
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-5 pb-3 text-pzh-blue-dark rounded-b-md bg-pzh-pink-dark bg-opacity-10">
                        {panelText}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

function TableLatestEdits() {
    const latestEdits = [
        {
            title:
                "De provincie Zuid-Holland draagt bij aan het behoud van de wereldpositie die de Rotterdamse haven bezit",
            type: "Beleidskeuze",
            link: "#",
            status: "In Ontwerp",
            bewerkt: "Dinsdag 1 juni 2021",
        },
        {
            title:
                "De provincie stimuleert een ‘waterrobuuste’ ruimtelijke inrichting. Het doel daarvan is om de gevolgschade en hersteltijd bij een eventuel...",
            type: "Beleidskeuze",
            status: "Vastgesteld",
            bewerkt: "Dinsdag 1 juni 2021",
        },
    ]

    return (
        <div className="flex flex-col col-span-6 pb-12 mt-4">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden">
                        <table className="table-fixed">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th
                                        scope="col"
                                        className="w-2/5 py-3 pr-6 font-bold text-left text-pzh-blue-dark"
                                    >
                                        Titel
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark"
                                    >
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark"
                                    >
                                        Laatste Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark"
                                    >
                                        Laatst bewerkt
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestEdits.map(
                                    (policyObject, policyObjectIdx) => (
                                        <tr
                                            key={policyObject.title}
                                            className="border-b border-gray-300"
                                        >
                                            <td className="py-4 pr-6 text-gray-800">
                                                {policyObject.link ? (
                                                    <Link
                                                        to={policyObject.link}
                                                        className="underline text-pzh-green-dark"
                                                    >
                                                        {policyObject.title}
                                                    </Link>
                                                ) : (
                                                    policyObject.title
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800">
                                                {policyObject.type}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800">
                                                {policyObject.status}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800">
                                                {policyObject.bewerkt}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaadpleegInProgress
