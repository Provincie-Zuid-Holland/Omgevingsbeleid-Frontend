import { Disclosure } from '@headlessui/react'
import {
    Badge,
    Divider,
    Heading,
    Hyperlink,
    TabItem,
    Tabs,
    Text,
    Tooltip,
} from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import classNames from 'classnames'
import { Fragment, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import { useRevisionsGet, useRevisionsModuleIdGet } from '@/api/fetchers'
import {
    PublicModuleObjectShort,
    PublicModuleShort,
} from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { ModelType, ParentType, parentTypes } from '@/config/objects/types'
import imageRevisions from '@/images/revisions.webp'
import {
    getPublicObjectActionIcon,
    getPublicObjectActionText,
} from '@/utils/dynamicObject'
import { getModuleStatusColor } from '@/utils/module'

const Revisions = () => {
    const { data, isLoading } = useRevisionsGet()

    return (
        <div>
            <Helmet>
                <title>Omgevingsbeleid - Herzieningen</title>
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
                        Wanneer een herziening ter inzage ligt, kan iedere
                        belanghebbende een reactie geven op de wijzigingen. Zo’n
                        reactie noemen we een zienswijze. Op de{' '}
                        <a
                            href="https://www.zuid-holland.nl/onderwerpen/omgevingsbeleid/voortgang-wijzigingen-omgevingsbeleid/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pzh-green underline hover:text-pzh-green-dark">
                            provinciale website
                        </a>{' '}
                        zie je precies welk beleid ter inzage ligt en hoe je een
                        zienswijze kunt indienen.
                    </Text>
                </div>
                <div className="relative col-span-3 hidden lg:block">
                    <img
                        src={imageRevisions}
                        alt=""
                        className="absolute left-0 top-0 inline-block h-[480px] min-w-[50vw] object-cover"
                    />
                </div>
            </Container>
            <Divider className="pzh-container mx-auto my-12" />
            {!isLoading ? (
                data?.results.map(module => (
                    <Fragment key={module.Module_ID}>
                        <Module {...module} />
                        <Divider className="pzh-container mx-auto my-12" />
                    </Fragment>
                ))
            ) : (
                <div className="mb-12 flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
            <Container className="pb-12">
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
                    className={`group mt-2 flex w-full items-center justify-between bg-pzh-pink-dark bg-opacity-10 px-5 py-3 font-bold text-pzh-pink-dark transition-colors duration-200 ease-in ${
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
                <Disclosure.Panel className="rounded-b-md bg-pzh-pink-dark bg-opacity-10 px-5 pb-3 text-pzh-blue-dark">
                    {panelText}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
)

const Module = ({
    Module_ID,
    Title,
    Description,
    Status,
}: PublicModuleShort) => {
    const { data, isLoading } = useRevisionsModuleIdGet(Module_ID)

    /**
     * Disable tabs which have no objects
     */
    const disabledKeys = useMemo(() => {
        const availableKeys: ParentType[] = []

        data?.Objects.forEach(object => {
            const model = models[object.Object_Type as ModelType]
            const { parentType } = model.defaults

            if (parentType && !availableKeys.includes(parentType)) {
                availableKeys.push(parentType)
            }
        })

        return parentTypes.filter(x => !availableKeys.includes(x))
    }, [data?.Objects])

    /**
     * Group objects by parentType
     */
    const groupedObjects = useMemo(() => {
        const groups: { [key in ParentType]: PublicModuleObjectShort[] } =
            {} as any

        // Initialize the groups object with empty arrays for each parentType
        Object.values(parentTypes).forEach(parentType => {
            groups[parentType] = []
        })

        data?.Objects.forEach(object => {
            const model = models[object.Object_Type as ModelType]
            const { parentType } = model.defaults

            if (parentType) {
                groups[parentType].push(object)
            }
        })

        return groups
    }, [data?.Objects])

    return (
        <Container>
            <div className="col-span-6 grid gap-4 lg:col-span-4">
                <div>
                    <span className="text-pzh-gray-600">Module</span>
                    <div className="flex items-center">
                        <Heading level="2">{Title}</Heading>
                        <Badge
                            text={Status?.Status.replace('-', ' ') || ''}
                            variant={getModuleStatusColor(Status?.Status)}
                            upperCase={false}
                            className="-mt-2 ml-3 whitespace-nowrap"
                        />
                    </div>
                </div>
                {Description && <Text>{Description}</Text>}
                <div>
                    {!isLoading ? (
                        <Tabs disabledKeys={disabledKeys}>
                            {parentTypes.map(type => (
                                <TabItem title={type} key={type}>
                                    <div className="mt-3 table border-spacing-y-2">
                                        {groupedObjects[type].map(object => (
                                            <RevisionItem
                                                key={
                                                    object.Object_Type +
                                                    object.Object_ID
                                                }
                                                {...object}
                                            />
                                        ))}
                                    </div>
                                </TabItem>
                            ))}
                        </Tabs>
                    ) : (
                        <div className="flex justify-center">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}

const RevisionItem = ({
    Title,
    Object_Type,
    Module_ID,
    UUID,
    ModuleObjectContext,
}: PublicModuleObjectShort) => {
    const model = models[Object_Type as ModelType]
    const { singularCapitalize, slugOverview, plural } = model.defaults

    const action = getPublicObjectActionText(ModuleObjectContext?.Action)
    const Icon = getPublicObjectActionIcon(ModuleObjectContext?.Action)

    return (
        <div className="table-row">
            <div className="table-cell">
                <div className="flex items-baseline">
                    {Icon && (
                        <Tooltip label={action || ''}>
                            <div
                                className={classNames(
                                    'flex h-4 w-4 cursor-help items-center justify-center rounded',
                                    {
                                        'bg-pzh-green':
                                            ModuleObjectContext?.Action ===
                                            'Create',
                                        'bg-pzh-red':
                                            ModuleObjectContext?.Action ===
                                            'Terminate',
                                        'bg-pzh-blue':
                                            ModuleObjectContext?.Action ===
                                            'Edit',
                                    }
                                )}>
                                <Icon
                                    size={
                                        ModuleObjectContext?.Action === 'Edit'
                                            ? 10
                                            : 14
                                    }
                                    className="text-pzh-white"
                                />
                            </div>
                        </Tooltip>
                    )}
                    <span className="px-2">{singularCapitalize}</span>
                </div>
            </div>
            <Hyperlink
                to={`/${slugOverview}/${plural}/ontwerpversie/${Module_ID}/${UUID}`}
                text={Title}
            />
        </div>
    )
}

export default Revisions
