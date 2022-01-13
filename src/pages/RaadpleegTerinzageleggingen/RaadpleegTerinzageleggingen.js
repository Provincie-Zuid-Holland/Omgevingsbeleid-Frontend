import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure } from '@headlessui/react'
import { Link } from 'react-router-dom'

import { Container } from '../../components/Container'
import scrollToElement from '../../utils/scrollToElement'
import Button from './../../components/Button'
import Footer from './../../components/Footer'
import Heading from './../../components/Heading'
import HorizontalDivider from './../../components/HorizontalDivider'
import Text from './../../components/Text'
import terinzageleggingenImage from './../../images/terinzageleggingen.png'

function RaadpleegTerinzageleggingen() {
    return (
        <div>
            <div>
                <Container className="mb-8 overflow-hidden">
                    <div className="col-span-3">
                        <Heading level="1" className="mt-16">
                            Terinzageleggingen
                        </Heading>
                        <Text type="introduction-paragraph" className="mt-3">
                            Het Omgevingsbeleid van de provincie verandert
                            geregeld. Op deze pagina kun je zien welke
                            beleidswijzigingen momenteel ter inzage liggen. Op
                            die manier wordt voor iedereen duidelijk wat er
                            verandert.
                        </Text>
                        <Button
                            text="Bekijk overzicht"
                            className="mt-4"
                            onClick={() =>
                                scrollToElement('op-dit-moment-ter-inzage')
                            }
                        />
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
                                src={terinzageleggingenImage}
                            />
                        </div>
                    </div>
                </Container>
            </div>
            <div className="w-full bg-pzh-blue-dark">
                <Container className="py-16">
                    <div className="col-span-6">
                        <Heading level="2" color="text-white">
                            Hoe werkt de terinzagelegging?
                        </Heading>
                        <Text type="body" color="text-white" className="mt-4">
                            Wanneer de Provinciale Staten akkoord zijn met de
                            voorgestelde beleidswijzigingen besluiten zij om het
                            nieuwe beleid ter inzage te leggen. Vanaf dat moment
                            hebben andere overheden, bedrijven en burgers de
                            gelegenheid om hierop te reageren. Zo&apos;n reactie
                            noemen wordt een zienswijze genoemd. Die zienswijzen
                            kunnen aanleiding zijn om eventuele correcties of
                            andere wijzigingen door te voeren. De
                            terinzagelegging duurt 6 weken.
                        </Text>
                    </div>
                </Container>
            </div>
            <div>
                <Container className="pt-16">
                    <Heading
                        className="col-span-6"
                        level="2"
                        id="op-dit-moment-ter-inzage">
                        Op dit moment ter inzage
                    </Heading>
                    <Text className="col-span-6 mt-4" type="body">
                        In onderstaand overzicht worden alle stukken getoond
                        waar een nieuwere versie van is dan het vigerende stuk.
                        In sommige gevallen is het mogelijk om door te klikken
                        naar de ontwerp-versie van een stuk beleid, deze stukken
                        herken je aan de groene kleur en de lijn onder de tekst.
                        Het overzicht kan eenvoudig worden gesorteerd door op
                        het kopje van de kolom te drukken.
                    </Text>
                    <TableLatestEdits />
                </Container>
                <HorizontalDivider />
                <Container className="py-12">
                    <Heading className="col-span-6" level="2">
                        Besluitvormingsproces
                    </Heading>
                    <Text className="col-span-6 mt-4" type="body">
                        Beleid wordt niet van de ene op de andere dag gevormd.
                        Iedere wijziging in het Omgevingsbeleid gaat het
                        politiek besluitvormingsproces door. Hieronder tonen wij
                        een overzicht van de stappen die doorlopen worden.
                    </Text>
                    <div className="col-span-2 mt-8">
                        <Heading level="3">Bevoegdheid GS & PS</Heading>
                        <Text className="mt-4">
                            Wanneer de Omgevingsvisie of Omgevingsverordening
                            wordt gewijzigd moeten zowel Gedeputeerde Staten als
                            de Provinciale Staten een besluit nemen over de
                            stukken. Het proces ziet er dan als volgt uit.
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
                            wijzigingen wel aan PS voorgelegd zodat zij op de
                            hoogte blijven van alle wijzigingen. Het
                            besluitvormingsproces is vergelijkbaar met de
                            Omgevingsvisie en Omgevingsverordening, maar niet
                            helemaal hetzelfde.
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

                            <Dropdown
                                buttonText="Definitief ontwerp Gedeputeerde Staten (GS)"
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

function TableLatestEdits() {
    const latestEdits = [
        {
            title: 'De provincie Zuid-Holland draagt bij aan het behoud van de wereldpositie die de Rotterdamse haven bezit',
            type: 'Beleidskeuze',
            link: '#',
            status: 'In Ontwerp',
            bewerkt: 'Dinsdag 1 juni 2021',
        },
        {
            title: 'De provincie stimuleert een ‘waterrobuuste’ ruimtelijke inrichting. Het doel daarvan is om de gevolgschade en hersteltijd bij een eventuel...',
            type: 'Beleidskeuze',
            status: 'Vastgesteld',
            bewerkt: 'Dinsdag 1 juni 2021',
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
                                        className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark">
                                        Laatst bewerkt
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestEdits.map(policyObject => (
                                    <tr
                                        key={policyObject.title}
                                        className="border-b border-gray-300">
                                        <td className="py-4 pr-6 text-gray-800">
                                            {policyObject.link ? (
                                                <Link
                                                    to={policyObject.link}
                                                    className="underline text-pzh-green hover:text-pzh-green-dark">
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaadpleegTerinzageleggingen
