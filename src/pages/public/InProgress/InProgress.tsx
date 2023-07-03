import { Disclosure } from '@headlessui/react'
import { Button, Divider, Heading, Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'
import imageInBewerking from '@/images/in-bewerking.webp'
import { scrollToElementByID } from '@/utils/scrollToElementByID'

function InProgress() {
    return (
        <div>
            <Helmet>
                <title>Omgevingsbeleid - In bewerking</title>
            </Helmet>
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
                    <Button
                        onPress={() =>
                            scrollToElementByID('laatste-bewerkingen')
                        }
                        className="mt-4">
                        Bekijk overzicht
                    </Button>
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
                <Heading
                    id="laatste-bewerkingen"
                    className="col-span-6"
                    level="2">
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
            </Container>
            <Divider />
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
        </div>
    )
}

const Dropdown = ({
    buttonText,
    panelText,
}: {
    buttonText: string
    panelText: string
}) => (
    <Disclosure>
        {({ open }) => (
            <>
                <Disclosure.Button
                    className={`flex bg-opacity-10 group items-center justify-between w-full px-5 py-3 font-bold transition-colors duration-200 ease-in text-pzh-pink-dark bg-pzh-pink-dark mt-2 ${
                        open ? 'rounded-t-md' : 'rounded-md'
                    }`}>
                    <span>{buttonText}</span>

                    <Plus
                        size={20}
                        className={`transition-transform ease-in duration-100 ${
                            open ? 'transform rotate-45' : ''
                        }`}
                    />
                </Disclosure.Button>
                <Disclosure.Panel className="px-5 pb-3 text-pzh-blue-dark rounded-b-md bg-pzh-pink-dark bg-opacity-10">
                    {panelText}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
)

export default InProgress
