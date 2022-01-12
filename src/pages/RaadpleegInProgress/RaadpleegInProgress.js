import {
    faClock,
    faSortAmountDownAlt,
    faSortAmountUpAlt,
} from '@fortawesome/pro-regular-svg-icons'
import { faPlus, faInfoCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure } from '@headlessui/react'
import Tippy from '@tippyjs/react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import 'tippy.js/dist/tippy.css'

import { Container } from '../../components/Container'
import { LoaderCard } from '../../components/Loader'
import axios from './../../API/axios'
import Button from './../../components/Button'
import Footer from './../../components/Footer'
import Heading from './../../components/Heading'
import HorizontalDivider from './../../components/HorizontalDivider'
import Text from './../../components/Text'
import imageInBewerking from './../../images/in-bewerking.png'

function RaadpleegInProgress() {
    const { isLoading, data: edits } = useQuery('/edits', () =>
        axios
            .get('/edits')
            .then(res =>
                res.data.length > 10 ? res.data.slice(0, 10) : res.data
            )
    )

    return (
        <div>
            <Container className="overflow-hidden">
                <div className="col-span-3">
                    <Heading level="1" className="mt-16">
                        In bewerking
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        “Wat speelt er op dit moment?” is een veel gehoorde
                        vraag. Graag laten wij je zien welke onderdelen in
                        bewerking zijn, dit houdt in dat wij alle onderdelen
                        laten zien die in ontwerp zijn.
                    </Text>
                    <Button text="Bekijk overzicht" className="mt-4" />
                </div>
                <div
                    className="relative col-span-3"
                    style={{ minHeight: '480px' }} // To mimick the height of the 480px div with the absolute position
                >
                    <div
                        style={{
                            height: '480px',
                            width: 'calc(50vw - 1rem)',
                        }}
                        className={`absolute text-center left-0 top-0 h-full bg-gray-100 sm:inline-block`}>
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
                <TableLatestEdits edits={edits} isLoading={isLoading} />
            </Container>
            <HorizontalDivider />
            <Container className="py-12">
                <Heading
                    id="besluitvormingsproces"
                    className="col-span-6"
                    level="2">
                    Besluitvormingsproces
                </Heading>
                <Text className="col-span-6 mt-4" type="body">
                    Beleid wordt niet van de ene op de andere dag gevormd.
                    Iedere wijziging in het Omgevingsbeleid gaat het politiek
                    besluitvormingsproces door. Hieronder tonen wij een
                    overzicht van de stappen die doorlopen worden.
                </Text>
                <div className="col-span-2 mt-8">
                    <Heading level="3">Bevoegdheid GS & PS</Heading>
                    <Text className="mt-4">
                        Wanneer de Omgevingsvisie of Omgevingsverordening wordt
                        gewijzigd moeten zowel Gedeputeerde Staten als de
                        Provinciale Staten een besluit nemen over de stukken.
                        Het proces ziet er dan als volgt uit.
                    </Text>
                </div>
                <div className="col-span-4 mt-8">
                    {/* Hidden heading to keep the whitespace consistent */}
                    <Heading
                        level="3"
                        className="opacity-0 pointer-events-none">
                        -
                    </Heading>
                    <div className="mt-4">
                        <Dropdown
                            buttonText="Concept ontwerp"
                            panelText="Een beleidsmedewerker van de provincie maakt een concept van het nieuwe beleid of de wijziging van het beleid. Dit concept wordt met verschillende collega’s besproken, waaronder met de desbetreffende portefeuillehouder."
                        />
                        <Dropdown
                            buttonText="Ontwerp Gedeputeerde Staten (GS)"
                            panelText="Als de portefeuillehouder het eens is met het concept wordt het verzonden naar de GS-vergadering. Zij besluiten vervolgens of het concept akkoord is of dat er nog iets moet worden aangepast."
                        />
                        <Dropdown
                            buttonText="Ontwerp Provinciale Staten (PS)"
                            panelText="Vervolgens wordt het ontwerp in een vergadering van de Provinciale Staten besproken. Zij kunnen vervolgens besluiten om het open te stellen voor inspraak."
                        />
                        <Dropdown
                            buttonText="Inspraak"
                            panelText="De provincie legt haar beleid vervolgens ter inzage voor een periode van zes weken. Tijdens deze periode kan iedereen officieel een reactie geven op de wijzigingen in het provinciaal beleid. Die reactie noemen we een zienswijze. Zienswijzen worden meestal ingediend door andere gemeenten, waterschappen, bedrijven en belangenorganisaties, maar ook inwoners kunnen hun mening geven."
                        />
                        <InspraakNotification />
                        <Dropdown
                            buttonText="Definitief ontwerp Gedeputeerde Staten (GS)"
                            panelText="Na de terinzagelegging wordt antwoord gegeven op alle binnengekomen zienswijzen. De zienswijzen kunnen daarnaast aanleiding zijn om de wijzigingen in het provinciaal beleid nogmaals tegen het licht te houden of eventuele fouten te corrigeren. De definitieve versie wordt vervolgens besproken in de vergadering van de Gedeputeerde Staten."
                        />
                        <Dropdown
                            buttonText="Definitief ontwerp Provinciale Staten (PS)"
                            panelText="Wanneer de Gedeputeerde Staten de definitieve wijzigingen goedkeuren wordt het voor de laatste keer voorgelegd aan de Provinciale Staten. Zij kunnen de definitieve versie vervolgens vaststellen of besluiten om niet akkoord te gaan met de wijzigingen."
                        />
                        <Dropdown
                            buttonText="Vastgesteld"
                            panelText="Het beleid is vastgesteld; de wijzigingen worden doorgevoerd in het Omgevingsbeleid van de provincie. De wijzigingen worden gepubliceerd in het provinciaal blad en treden daarna officieel in werking."
                        />
                    </div>
                </div>
                <div className="col-span-2 mt-8">
                    <Heading level="3">Bevoegdheid GS</Heading>
                    <Text className="mt-4">
                        Gedeputeerde Staten zijn bevoegd om zelf het
                        omgevingsprogramma te wijzigen zonder besluit van de
                        Provinciale Staten. In de praktijk worden die
                        wijzigingen wel aan PS voorgelegd zodat zij op de hoogte
                        blijven van alle wijzigingen. Het besluitvormingsproces
                        is vergelijkbaar met de Omgevingsvisie en
                        Omgevingsverordening, maar niet helemaal hetzelfde.
                    </Text>
                </div>
                <div className="col-span-4 mt-8">
                    {/* Hidden heading to keep the whitespace consistent */}
                    <Heading
                        level="3"
                        className="opacity-0 pointer-events-none">
                        -
                    </Heading>
                    <div className="mt-4">
                        <Dropdown
                            buttonText="Concept ontwerp"
                            panelText="Een beleidsmedewerker van de provincie maakt een concept van het nieuwe beleid of de wijziging van het beleid. Dit concept wordt met verschillende collega’s besproken, waaronder met de desbetreffende portefeuillehouder."
                        />
                        <Dropdown
                            buttonText="Ontwerp Gedeputeerde Staten (GS)"
                            panelText="Als de portefeuillehouder het eens is met het concept wordt het verzonden naar de GS-vergadering. Zij besluiten vervolgens of het concept akkoord is of dat er nog iets moet worden aangepast."
                        />
                        <Dropdown
                            buttonText="Inspraak"
                            panelText="De provincie legt haar beleid vervolgens ter inzage voor een periode van zes weken. Tijdens deze periode kan iedereen officieel een reactie geven over de wijzigingen in het provinciaal beleid. Die reactie noemen we een zienswijze. Zienswijzen worden meestal ingediend door andere gemeenten, waterschappen, bedrijven en belangenorganisaties, maar ook inwoners kunnen hun mening geven."
                        />
                        <InspraakNotification />
                        <Dropdown
                            buttonText="Definitief ontwerp Provinciale Staten (PS)"
                            panelText="Na de terinzagelegging wordt antwoord gegeven op eventuele vragen die in de zienswijzen zijn gesteld. De zienswijzen kunnen daarnaast aanleiding zijn om de wijzigingen in het provinciaal beleid nogmaals tegen het licht te houden of eventuele fouten te corrigeren. De definitieve versie wordt vervolgens besproken in de vergadering van de Gedeputeerde Staten."
                        />
                        <Dropdown
                            buttonText="Vastgesteld"
                            panelText="Het beleid is vastgesteld; de wijzigingen worden doorgevoerd in het Omgevingsbeleid van de provincie. De wijzigingen worden gepubliceerd in het provinciaal blad en treden daarna officieel in werking."
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
                            open ? 'rounded-t-md' : 'rounded-md'
                        }`}>
                        <span>{buttonText}</span>
                        <FontAwesomeIcon
                            className={`text-base transition-transform ease-in duration-100 ${
                                open ? 'transform rotate-45' : ''
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

function TableLatestEdits({ edits = [], isLoading }) {
    // ascending descending state
    const [ascending, setAscending] = useState(true)

    const sortedEdits = ascending
        ? edits.sort(
              (a, b) => new Date(b.Modified_Date) - new Date(a.Modified_Date)
          )
        : edits
              .sort(
                  (a, b) =>
                      new Date(b.Modified_Date) - new Date(a.Modified_Date)
              )
              .reverse()

    if (isLoading) {
        return (
            <div className="col-span-6 my-8">
                <LoaderCard mb="mb-2" height="30" />
                <LoaderCard mb="mb-2" height="60" />
                <LoaderCard mb="mb-2" height="60" />
                <LoaderCard mb="mb-2" height="60" />
            </div>
        )
    } else {
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
                                            className="w-2/5 py-3 pr-6 font-bold text-left text-pzh-blue-dark">
                                            Titel
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark">
                                            Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark">
                                            Laatste Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-1/5 px-6 py-3 font-bold text-left cursor-pointer text-pzh-blue-dark">
                                            <button
                                                onClick={() =>
                                                    setAscending(!ascending)
                                                }>
                                                Laatst bewerkt{' '}
                                                <FontAwesomeIcon
                                                    className={`ml-2 text-base relative -mt-2`}
                                                    icon={
                                                        ascending
                                                            ? faSortAmountDownAlt
                                                            : faSortAmountUpAlt
                                                    }
                                                />
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedEdits.map(policyObject => (
                                        <tr
                                            key={policyObject.UUID}
                                            className="border-b border-gray-300">
                                            <td className="py-4 pr-6 text-gray-800">
                                                {policyObject.UUID ? (
                                                    <Link
                                                        to={policyObject.UUID}
                                                        className="underline text-pzh-green hover:text-pzh-green-dark">
                                                        {policyObject.Titel}
                                                    </Link>
                                                ) : (
                                                    policyObject.Titel
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800">
                                                {policyObject.Type}
                                            </td>

                                            <td className="px-6 py-4 text-gray-800">
                                                <StatusComponent
                                                    policyObject={policyObject}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-gray-800">
                                                {new Intl.DateTimeFormat(
                                                    'nl-NL',
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }
                                                ).format(
                                                    new Date(
                                                        policyObject.Modified_Date
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const StatusComponent = ({ policyObject }) => {
    const [tippyOpen, setTippyOpen] = useState(false)

    return (
        <span onClick={() => setTippyOpen(!tippyOpen)}>
            {policyObject.Status}{' '}
            <Tippy
                visible={tippyOpen}
                content={
                    <a
                        onClick={() => setTippyOpen(false)}
                        className="text-sm pointer-events-auto"
                        href="#besluitvormingsproces">
                        <span className="block font-bold">
                            {policyObject.Status}
                        </span>
                        <span className="block">
                            Bekijk de uitleg en betekenis van statussen{' '}
                            <span className="underline">hier</span>
                        </span>
                    </a>
                }>
                <div className="inline-block ml-1 transition-colors duration-500 ease-in cursor-pointer text-pzh-dark-blue opacity-40 hover:opacity-80">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
            </Tippy>
        </span>
    )
}

export default RaadpleegInProgress
