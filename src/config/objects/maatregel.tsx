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
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            maatregel is veelal gekoppeld met beleidsdoelen. Hieronder een
            overzicht van de beleidsdoelen van deze maatregel. Bekijk voor het
            volledige overzicht het{' '}
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
