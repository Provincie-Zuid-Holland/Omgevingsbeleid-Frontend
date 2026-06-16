import nsobImage from '@/images/nsob-rollen.png'
import { Hyperlink } from '@pzh-ui/components'
import { AngleDown, CalendarCheck } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    useGetRevisionsMaatregelVersion,
    useMaatregelEditObjectStatic,
    useMaatregelGetListActiveModuleObjects,
    useMaatregelGetRelationsList,
    useMaatregelListValidLineageTree,
    useMaatregelListValidLineages,
    useMaatregelPostModulePatchObject,
    useMaatregelPostRelationsOverwrite,
    useMaatregelViewModuleObjectLatest,
    useMaatregelViewObjectLatest,
    useMaatregelViewObjectVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { Text } from '@pzh-ui/react'
import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useMaatregelListValidLineages,
    useGetValidLineage: useMaatregelListValidLineageTree,
    useGetVersion: useMaatregelViewObjectVersion,
    useGetLatestLineage: useMaatregelViewObjectLatest,
    useGetRevision: useGetRevisionsMaatregelVersion,
    useGetRelations: useMaatregelGetRelationsList,
    usePutRelations: useMaatregelPostRelationsOverwrite,
    useGetLatestLineageInModule: useMaatregelViewModuleObjectLatest,
    usePatchObjectInModule: useMaatregelPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useMaatregelEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useMaatregelGetListActiveModuleObjects,
}

const maatregel: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'maatregel',
        singularReadable: 'maatregel',
        singularCapitalize: 'Maatregel',
        plural: 'maatregelen',
        pluralReadable: 'maatregelen',
        pluralCapitalize: 'Maatregelen',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        slugOverview: 'omgevingsprogramma',
        slugOverviewPublic: true,
        description:
            'De maatregelen geven aan wat de provincie gaat doen om de keuzes uit te voeren. De maatregelen zijn een uitwerking van de beleidskeuzes en komen voort uit het Omgevingsprogramma.',
        icon: CalendarCheck,
        parentType: 'Programma',
    },
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [
        { type: 'beleidskeuze', key: 'Beleidskeuzes' },
        { type: 'gebiedsprogramma', key: 'Gebiedsprogrammas' },
    ],
    connectionsDescription: object => (
        <>
            Deze maatregel hoort bij de beleidskeuze '{object}'. Een maatregel
            beschrijft wat de provincie doet om de beleidskeuze tot uitvoering
            brengen. Daarnaast kan deze maatregel ook uitvoering geven aan
            andere beleidskeuzes. Bekijk voor het volledige overzicht het{' '}
            <Hyperlink asChild>
                <Link to="/beleidsnetwerk">beleidsnetwerk</Link>
            </Hyperlink>
            .
        </>
    ),
    fetchers,
    dynamicSections: [
        {
            description:
                'Een maatregel beschrijft aan de hand van prestaties/acties/handelingen (output) hoe de provincie de beleidskeuze tot uitvoering brengt. De output draagt bij aan het beoogde effect en dient daarmee een doel. In de maatregel werkt Gedeputeerde Staten uit hoe zij de gekozen rolneming invullen. Een maatregel richt zich op de korte termijn (zo’n 3 jaar).',
            notification: {
                title: 'Tips voor het schrijven van beleid',
                children: (
                    <>
                        <ul>
                            <li>
                                Schrijf actief, dus hoe je de maatregel
                                uitvoert. Niet hoe je de maatregel zou kunnen
                                uitvoeren.
                            </li>
                            <li>
                                Schrijf vanuit ‘de provincie’, gebruik dus géén
                                we/wij. Spreek verder over de provincie in
                                ze/zij of haar.
                            </li>
                            <li>
                                Schrijf zo veel mogelijk tijdloos. Gebruik dus
                                zo min mogelijk jaartallen zodat het beleid
                                niet, om deze reden, hoeft te worden herzien.
                                Lange termijn doelstellingen kunnen wel, maar
                                voorkom herhaling van het beleidsdoel.
                            </li>
                            <li>
                                Klik op het ‘i’ icoon voor toelichting over het
                                invullen van het veld.
                            </li>
                        </ul>
                        <i>
                            Let op! Het monitoren en evalueren van beleid is
                            geen maatregel. Monitoren en evalueren van een
                            maatregel/programmatische aanpak gebeurt in de
                            beleidscyclus. Deze handeling heeft geen (directe)
                            externe werking. De LTA biedt ruimte om trajecten
                            weer te geven waarin beleidsmatige sturing wordt
                            uitgewerkt of onderzocht.
                        </i>
                    </>
                ),
            },
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Gebruik in de titel ten minste één werkwoord. Het gekozen werkwoord zegt over het algemeen iets over de rolkeuze uit het NSOB-kwadrant. ',
                    placeholder:
                        "Bijv. 'Samenwerken aan regionale energiestrategieën'",
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Output/prestaties',
                    description: (
                        <>
                            Een output/prestatie is de telbare eigen inzet die
                            een effect tot gevolg heeft. Benoem hierbij geen
                            geldbedragen en noem geen namen van collega’s of
                            afdelingen.
                            <br />
                            <br />
                            Gebruik ieder van deze punten voor de gelijknamige
                            tweede W vraag (Wat gaat de provincie doen?) in de
                            begroting.
                        </>
                    ),
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image', 'table'],
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
                    name: 'Role',
                    label: 'Beleidsrol',
                    description:
                        'Kies één van de NSOB rollen. Heb je het gevoel dat er meerdere rollen worden ingenomen bij het uitvoeren van dit beleid? Kies dan de meest uitgesproken rol. ',
                    notification: {
                        title: 'Overzicht NSOB rollen',
                        className: 'prose-img:my-0 mt-2',
                        children: (
                            <>
                                <Text size="s">
                                    Het kan zo zijn dat de overige rollen worden
                                    ondervangen door complementaire
                                    beleidsinstrumenten zoals de beleidskeuze of
                                    verordening. De LTA biedt ruimte om
                                    trajecten weer te geven waarin beleidsmatige
                                    sturden wordt uitgewerkt of onderzocht.
                                </Text>
                                <img
                                    src={nsobImage}
                                    alt="Overzicht van NSOB rollen"
                                    className="border-pzh-gray-300 rounded-lg border"
                                />
                            </>
                        ),
                    },
                    placeholder: 'Kies een NSOB rol',
                    type: 'select',
                    isSearchable: false,
                    options: [
                        { label: 'Presterend', value: 'Presterend' },
                        { label: 'Samenwerkend', value: 'Samenwerkend' },
                        { label: 'Rechtmatig', value: 'Rechtmatig' },
                        { label: 'Responsief', value: 'Responsief' },
                    ],
                },
                {
                    name: 'Effect',
                    label: 'Nadere uitwerking',
                    description:
                        'Licht de invulling van de beleidsrol toe. Werk uit hoe je de genoemde prestaties/acties/handelingen vormgeeft.',
                    notification: {
                        title: 'Overzicht beleidsinstrumenten',
                        children: (
                            <>
                                <Text size="s">
                                    Welke van de onderstaande zes typen
                                    beleidsinstrumenten zet je in om het doel te
                                    bereiken en werk uit waarom er is gekozen
                                    voor dit instrument. Geef per doel aan
                                    welk(e) type(n) instrument je inzet
                                </Text>
                                <ul>
                                    <li>
                                        Regelgeving (zoals verordening,
                                        beleidsregels, beleidstoetsing)
                                    </li>
                                    <li>
                                        Financiering (zoals subsidie,
                                        opdrachten, inkoop en cofinanciering)
                                    </li>
                                    <li>
                                        Kennis en informatie opbouwen en delen
                                        (zoals monitoren, kennis opbouw en
                                        delen, voorlichting)
                                    </li>
                                    <li>
                                        Samenwerken (zoals netwerken bouwen,
                                        lobby’s organiseren en laten uitvoeren,
                                        regisseren en faciliteren)
                                    </li>
                                    <li>
                                        Zelf uitvoeren (zoals toezicht houden,
                                        projectbesluit, onderhoud uitvoeren,
                                        aanleg)
                                    </li>
                                    <li>Overig</li>
                                </ul>
                            </>
                        ),
                    },
                    type: 'wysiwyg',
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image', 'table'],
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
                            Is op deze maatregel het ambtsgebied van toepassing
                            of een specifieke gebiedengroep? Heeft jouw
                            maatregel nog geen geschikt gebied, of moet het
                            huidige gebied aangepast worden? Neem dan contact op
                            via{' '}
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
                            label: 'Op deze maatregel is het ambtsgebied van toepassing',
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
                    label: 'Koppel aan beleidskeuze',
                    description:
                        'Geef aan uit welke beleidskeuze deze maatregel voortkomt.',
                    type: 'search',
                    required: true,
                    objectKey: 'Object_Code',
                    filterType: ['beleidskeuze'],
                    status: 'all',
                    placeholder: 'Kies de beleidskeuze',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                },
                {
                    name: 'Documents',
                    fieldName: 'Documents',
                    label: 'Documenten',
                    description:
                        'Dienen er bijlagen mee gepubliceerd te worden, voeg ze dan hier toe. Deze bijlagen volgen de besluitvorming van de herziening. Dit kan alleen in overleg met team omgevingsbeleid.',
                    type: 'search',
                    filterType: ['document'],
                    objectKey: 'Object_Code',
                    isMulti: true,
                    closeMenuOnSelect: false,
                    status: 'all',
                    placeholder: 'Kies een of meerdere documenten',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    validation: schemaDefaults.options,
                },
            ],
        },
    ],
}

maatregel.validationSchema = generateDynamicSchema(maatregel.dynamicSections)

export default maatregel
