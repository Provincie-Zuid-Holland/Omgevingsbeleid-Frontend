import { Disclosure } from '@headlessui/react'
import { Divider, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare, Plus } from '@pzh-ui/icons'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'

import { usePublicModulesGetPublicListModules } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderSpinner } from '@/components/Loader'
import imageRevisions from '@/images/revisions.webp'

import Module from './components/Module'

const META = {
    title: 'Herzieningen',
    description:
        '“Welk beleid gaat binnenkort worden gewijzigd?” is een veel gehoorde vraag. Op deze pagina laten wij zien welk beleid momenteel herzien wordt en in welke fase van besluitvorming dit zich bevindt.',
}

const Revisions = () => {
    const { data, isLoading } = usePublicModulesGetPublicListModules({
        limit: 100,
    })

    return (
        <div className="flex flex-col gap-12 pb-12">
            <Helmet title={META.title}>
                <meta name="description" content={META.description} />
                <meta name="og:description" content={META.description} />
            </Helmet>

            <Container className="overflow-hidden">
                <div className="col-span-6 pt-8 lg:col-span-3 lg:pt-16">
                    <Heading level="1" size="xxl">
                        Herzieningen
                    </Heading>
                    <Text size="l" className="my-4">
                        “Welk beleid gaat binnenkort worden gewijzigd?” is een
                        veel gehoorde vraag. Op deze pagina laten wij zien welk
                        beleid momenteel herzien wordt en in welke fase van
                        besluitvorming dit zich bevindt.
                    </Text>
                    <Text>
                        Herzieningen van het Omgevingsbeleid zijn vaak modulair.
                        Dat houdt in dat een herziening vaak bestaat uit
                        wijzigingen op één of enkele onderwerpen. In een
                        herziening kunnen zowel de visie, het programma als de
                        verordening wijzigen. Hieronder staat een overzicht van
                        de herzieningen.
                        <br />
                        <br />
                        Wanneer een herziening ter consultatie of ter inzage
                        ligt, kan iedereen een reactie geven op de voorgestelde
                        wijzigingen. Op de{' '}
                        <Hyperlink asChild>
                            <span className="inline-flex items-center gap-1">
                                <a
                                    href="https://www.zuid-holland.nl/onderwerpen/omgevingsbeleid/voortgang-wijzigingen-omgevingsbeleid/"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    provinciale website
                                </a>
                                <ArrowUpRightFromSquare className="-mt-0.5" />
                            </span>
                        </Hyperlink>{' '}
                        zie je precies welk beleid gewijzigd wordt en hoe je een
                        reactie kunt indienen.
                    </Text>
                </div>
                <div className="relative col-span-3 hidden lg:block">
                    <img
                        src={imageRevisions}
                        alt=""
                        className="absolute top-0 left-0 inline-block h-[480px] min-w-[50vw] object-cover"
                    />
                </div>
            </Container>
            <Divider className="pzh-container mx-auto" />
            {!isLoading ? (
                !!data?.results.length ? (
                    data?.results.map(module => (
                        <Fragment key={module.Module_ID}>
                            <Module {...module} />
                            <Divider className="pzh-container mx-auto" />
                        </Fragment>
                    ))
                ) : (
                    <>
                        <Container>
                            <div className="col-span-6 flex flex-col gap-12">
                                <Text className="italic">
                                    Er zijn momenteel geen lopende wijzigingen
                                    wat betreft het Omgevingsbeleid.
                                </Text>
                            </div>
                        </Container>
                        <Divider className="pzh-container mx-auto" />
                    </>
                )
            ) : (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
            <Container>
                <Heading className="col-span-6" level="2">
                    Besluitvormingsproces
                </Heading>
                <Text className="col-span-6 mt-4">
                    Beleid wordt niet van de ene op de andere dag gevormd, dit
                    gaat volgens een heel proces. Zeker als het gaat om de
                    besluitvorming. Hieronder tonen wij een overzicht van de
                    statussen die doorlopen worden. Tussen deze statussen zitten
                    een bepaald aantal weken. Sommige stappen zijn voor de{' '}
                    <strong>procedure</strong>, sommige voor{' '}
                    <strong>participatie</strong> en sommige{' '}
                    <strong>ter inzage</strong>.
                </Text>
                <div className="col-span-6 mt-8 lg:col-span-2">
                    <Heading level="3" size="m">
                        Bevoegdheid GS & PS
                    </Heading>
                    <Text className="mt-4">
                        Wanneer de Omgevingsvisie of Omgevingsverordening wordt
                        gewijzigd moeten zowel Gedeputeerde Staten als de
                        Provinciale Staten een besluit nemen over de stukken.
                        Het proces ziet er dan als volgt uit.
                    </Text>
                </div>
                <div className="col-span-6 mt-4 lg:col-span-4 lg:mt-[92px]">
                    <Dropdown
                        buttonText="Concept ontwerp"
                        panelText="Een beleidsmedewerker van de provincie maakt een concept van het nieuwe beleid of de wijziging van het beleid. Dit concept wordt met verschillende collega’s besproken, waaronder met de desbetreffende portefeuillehouder."
                    />
                    <Dropdown
                        buttonText="Ontwerp Gedeputeerde Staten (GS)"
                        panelText="Als de portefeuillehouder het eens is met het concept wordt het verzonden naar de GS-vergadering. Zij besluiten vervolgens of het concept akkoord is of dat er nog iets moet worden aangepast. Wanneer akkoord, zal het ontwerp opengesteld worden voor inspraak."
                    />
                    <Dropdown
                        buttonText="Ontwerp Provinciale Staten (PS)"
                        panelText="Provinciale Staten kan rondom de inspraak van het ontwerp, ervoor kiezen om het ontwerp te bespreken in een commissievergadering."
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
                <div className="col-span-6 mt-8 lg:col-span-2">
                    <Heading level="3" size="m">
                        Bevoegdheid GS
                    </Heading>
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
                <div className="col-span-6 mt-4 lg:col-span-4 lg:mt-[92px]">
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
                    className={`group bg-pzh-pink-100/10 text-pzh-pink-900 mt-2 flex w-full items-center justify-between px-5 py-3 font-bold transition-colors duration-200 ease-in ${
                        open ? 'rounded-t-md' : 'rounded-md'
                    }`}>
                    <span>{buttonText}</span>

                    <Plus
                        size={20}
                        className={`transition-transform duration-100 ease-in ${
                            open ? 'rotate-45 transform' : ''
                        }`}
                    />
                </Disclosure.Button>
                <Disclosure.Panel className="bg-pzh-pink-100/10 text-pzh-blue-900 rounded-b-md px-5 pb-3">
                    {panelText}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
)

export default Revisions
