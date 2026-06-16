import { Hyperlink } from '@pzh-ui/components'
import { AngleDown, Split } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    getBeleidskeuzeGetAcknowledgedRelationListQueryKey,
    useBeleidskeuzeEditObjectStatic,
    useBeleidskeuzeGetAcknowledgedRelationList,
    useBeleidskeuzeGetAcknowledgedRelationRequest,
    useBeleidskeuzeGetListActiveModuleObjects,
    useBeleidskeuzeGetRelationsList,
    useBeleidskeuzeListValidLineageTree,
    useBeleidskeuzeListValidLineages,
    useBeleidskeuzePostAcknowledgedRelationEdit,
    useBeleidskeuzePostModulePatchObject,
    useBeleidskeuzePostRelationsOverwrite,
    useBeleidskeuzeViewModuleObjectLatest,
    useBeleidskeuzeViewObjectLatest,
    useBeleidskeuzeViewObjectVersion,
    useGetRevisionsBeleidskeuzeVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidskeuzeListValidLineages,
    useGetValidLineage: useBeleidskeuzeListValidLineageTree,
    useGetVersion: useBeleidskeuzeViewObjectVersion,
    useGetLatestLineage: useBeleidskeuzeViewObjectLatest,
    useGetRevision: useGetRevisionsBeleidskeuzeVersion,
    useGetRelations: useBeleidskeuzeGetRelationsList,
    usePutRelations: useBeleidskeuzePostRelationsOverwrite,
    useGetLatestLineageInModule: useBeleidskeuzeViewModuleObjectLatest,
    usePatchObjectInModule: useBeleidskeuzePostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useBeleidskeuzeEditObjectStatic,
    useGetAcknowledgedRelations: useBeleidskeuzeGetAcknowledgedRelationList,
    usePostAcknowledgedRelations: useBeleidskeuzeGetAcknowledgedRelationRequest,
    usePatchAcknowledgedRelations: useBeleidskeuzePostAcknowledgedRelationEdit,
    usePostObject: null,
    useGetActiveModules: useBeleidskeuzeGetListActiveModuleObjects,
}

const queryKeys = {
    getAcknowledgedRelations:
        getBeleidskeuzeGetAcknowledgedRelationListQueryKey,
}

const beleidskeuze: DynamicObject<typeof fetchers, typeof queryKeys> = {
    defaults: {
        singular: 'beleidskeuze',
        singularReadable: 'beleidskeuze',
        singularCapitalize: 'Beleidskeuze',
        plural: 'beleidskeuzes',
        pluralReadable: 'beleidskeuzes',
        pluralCapitalize: 'Beleidskeuzes',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        slugOverview: 'omgevingsvisie',
        description:
            'De beleidskeuzes geven aan hoe de provincie haar doelen wil bereiken. De beleidskeuzes zijn een uitwerking van de beleidsdoelen en komen voort uit de Omgevingsvisie.',
        icon: Split,
        parentType: 'Visie',
        slugOverviewPublic: true,
    },
    fetchers,
    queryKeys,
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [
        { type: 'wettelijke_taak', key: 'WettelijkeTaken' },
        { type: 'nationaal_belang', key: 'NationaleBelangen' },
        { type: 'beleidsdoel', key: 'Beleidsdoelen' },
    ],
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            relatie wordt aangegaan tussen beleidskeuzes inclusief een
            duidelijke motivering en een koppeling kan met alle niveaus binnen
            het omgevingsbeleid. Bekijk voor het volledige overzicht het{' '}
            <Hyperlink asChild>
                <Link to="/beleidsnetwerk">beleidsnetwerk</Link>
            </Hyperlink>
            .
        </>
    ),
    acknowledgedRelation: 'beleidskeuze',
    dynamicSections: [
        {
            description:
                'Een beleidskeuze is een uitwerking van het beleidsdoel. Een beleidskeuze beschrijft welk effect (outcome) wordt beoogd en wat er nodig is om van de huidige naar de gewenste situatie te komen. In de beleidskeuze wordt door PS bepaald wat de provinciale rol is die wordt ingenomen om het gewenste effect te bereiken. Om een beleidsdoel te bereiken kan PS meerdere Maatregelen maken. Een beleidskeuze richt zich op de middellange termijn (zo’n 5 jaar).',
            notification: {
                title: 'Tips voor het schrijven van beleid',
                children: (
                    <ul>
                        <li>
                            Schrijf actief, de provincie maakt een beleidskeuze.
                        </li>
                        <li>
                            Schrijf vanuit ‘de provincie’, gebruik dus géén
                            we/wij. Spreek verder over de provincie in ze/zij of
                            haar.
                        </li>
                        <li>
                            Schrijf zo veel mogelijk tijdloos. Gebruik dus zo
                            min mogelijk jaartallen zodat het beleid niet, om
                            deze reden, hoeft te worden herzien. Lange termijn
                            doelstellingen kunnen wel, maar voorkom herhaling
                            van het beleidsdoel.
                        </li>
                        <li>
                            Benoem tussentijdse doelstellingen en werk deze
                            realistisch en tijdgebonden uit.
                        </li>
                        <li>
                            Klik op het ‘i’ icoon voor toelichting over het
                            invullen van het veld.
                        </li>
                    </ul>
                ),
            },
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'De titel moet de lading dekken van het onderwerp en een richting aangeven in maximaal 10 woorden.',
                    placeholder:
                        "Bijv. 'Transitie havencomplex', ’Nieuwe natuur realiseren’, ‘Stikstofreductie’",
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Wat wil de provincie bereiken?',
                    description: (
                        <>
                            Beperk je tot de hoofdlijnen en werk het beleid
                            verder uit onder het kopje ‘Nadere uitwerking’, of
                            breng de invulling van het beleid onder in het
                            programma (GS).
                            <br />
                            <br />
                            Benut voor het schrijven van dit onderdeel de
                            beleidstheorie. Beschrijf de effecten wat bij
                            anderen/in de maatschappij wordt beoogd en wordt
                            veroorzaakt door onze inzet. Gebruik hiervoor zo’n
                            10 zinnen.
                        </>
                    ),
                    notification: {
                        title: 'Denk bij het schrijven van dit stuk aan het beantwoorden van de volgende vragen:',
                        children: (
                            <ul>
                                <li>Wat is de maatschappelijke opgave?</li>
                                <li>
                                    Wat is de verandering in de maatschappij die
                                    de provincie te weeg wil brengen?
                                </li>
                                <li>
                                    In welke mate verwacht de provincie hieraan
                                    bij de kunnen dragen?
                                </li>
                            </ul>
                        ),
                    },
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
                    imageOptions: {
                        options: {
                            allowBase64: true,
                            inline: true,
                        },
                        uploadOptions: {
                            maxSize: 819200,
                        },
                    },
                },
                {
                    name: 'Cause',
                    label: 'Inhoudelijke aanleiding',
                    description:
                        'Beschrijf beknopt de inhoudelijke aanleiding van de beleidskeuze. Welk probleem/dreiging of welke kans ligt ten grondslag aan deze beleidskeuze? Met andere woorden, waarom vinden wij dit belangrijk?',
                    notification: {
                        title: 'Wettelijke taak of nationaal belang',
                        children:
                            'Het kan ook zijn dat er sprake is van een wettelijke taak of een nationaal belang waarin de provincie wordt opgedragen in actie komen. Verwoord dan letterlijk de wettelijke taak die de provincie toebedeeld heeft gekregen.',
                    },
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
                    imageOptions: {
                        options: {
                            allowBase64: true,
                            inline: true,
                        },
                        uploadOptions: {
                            maxSize: 819200,
                        },
                    },
                },
                {
                    name: 'Provincial_Interest',
                    label: 'Provinciaal belang',
                    description:
                        'Beschrijf waarom de provincie een rol voor zichzelf ziet bij het oplossen van deze maatschappelijke opgave.',
                    notification: {
                        title: 'Alleen wanneer nodig',
                        children:
                            'In de Omgevingswet (zie artikel 2.3) staat dat een provincie een taak of bevoegdheid alleen uitoefent wanneer dit nodig is. Dit doen zij met het oog op een provinciaal belang en met de overtuiging dat dit belang niet op een doelmatige en doeltreffende wijze door het gemeentebestuur kan worden behartigd.',
                    },
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
                    imageOptions: {
                        options: {
                            allowBase64: true,
                            inline: true,
                        },
                        uploadOptions: {
                            maxSize: 819200,
                        },
                    },
                },
                {
                    name: 'Explanation',
                    label: 'Nadere uitwerking',
                    description: (
                        <>
                            Een uitwerking in dit veld is noodzakelijk wanneer
                            er bij ‘Wat wil de provincie bereiken?’ niet
                            voldoende ruimte is. Naast een uitwerking in de
                            beleidskeuze heeft PS ook de mogelijkheid om sturing
                            aan te brengen in de verordening.
                            <br />
                            <br />
                            Werk op hoofdlijnen uit met welke instrumenteninzet
                            en rolkeuze de provincie de beleidskeuze wil
                            bereiken.
                        </>
                    ),
                    notification: {
                        title: 'Invulling van de rolkeuze',
                        children:
                            'Nadere invulling van de rolkeuze is GS-bevoegdheid. Deze invulling is mogelijk in een maatregel van het Omgevingsprogramma. In het kader van leesbaarheid is het niet nodig om tekst in verschillende instrumenten van het omgevingsbeleid te zetten.',
                    },
                    type: 'wysiwyg',
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
                    imageOptions: {
                        options: {
                            allowBase64: true,
                            inline: true,
                        },
                        uploadOptions: {
                            maxSize: 819200,
                        },
                    },
                },
                {
                    name: 'Ambtsgebied',
                    label: 'Selecteer de gebiedengroep',
                    description: (
                        <>
                            Is op deze beleidskeuze het ambtsgebied van
                            toepassing of een specifieke gebiedengroep? Heeft
                            jouw beleidskeuze nog geen geschikt gebied, of moet
                            het huidige gebied aangepast worden? Neem dan
                            contact op via{' '}
                            <a
                                href="mailto:omgevingsbeleid@pzh.nl"
                                className="underline">
                                omgevingsbeleid@pzh.nl
                            </a>
                            .
                        </>
                    ),
                    type: 'checkbox',
                    options: [
                        {
                            label: 'Op deze beleidskeuze is het ambtsgebied van toepassing',
                            value: 'true',
                        },
                    ],
                },
                {
                    name: 'Gebiedengroep_Code',
                    label: 'Gebiedengroep',
                    type: 'search',
                    status: 'all',
                    placeholder: 'Selecteer een gebiedengroep',
                    filterType: ['gebiedengroep'],
                    objectKey: 'Object_Code',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    conditionalField: 'Ambtsgebied',
                },
                {
                    name: 'Hierarchy_Code',
                    label: 'Koppel aan beleidsdoel',
                    description:
                        'Geef aan uit welk beleidsdoel deze beleidskeuze voortkomt.',
                    type: 'search',
                    required: true,
                    objectKey: 'Object_Code',
                    filterType: ['beleidsdoel'],
                    status: 'all',
                    placeholder: 'Kies het beleidsdoel',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                },
            ],
        },
    ],
}

beleidskeuze.validationSchema = generateDynamicSchema(
    beleidskeuze.dynamicSections
)

export default beleidskeuze
