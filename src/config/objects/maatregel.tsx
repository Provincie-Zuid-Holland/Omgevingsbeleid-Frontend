import { Hyperlink } from '@pzh-ui/components'
import { AngleDown, CalendarCheck } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    useMaatregelStaticLineageIdPost,
    useMaatregelenLatestLineageIdGet,
    useMaatregelenRelationsLineageIdGet,
    useMaatregelenRelationsLineageIdPut,
    useMaatregelenValidGet,
    useMaatregelenValidLineageIdGet,
    useMaatregelenVersionObjectUuidGet,
    useModulesModuleIdObjectMaatregelLatestLineageIdGet,
    useModulesModuleIdObjectMaatregelLineageIdPatch,
    useModulesObjectsMaatregelActiveLineageIdGet,
    useRevisionsModuleIdMaatregelVersionObjectUuidGet,
} from '@/api/fetchers'
import {
    MaatregelPatch,
    MaatregelStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useMaatregelenValidGet,
    useGetValidLineage: useMaatregelenValidLineageIdGet,
    useGetVersion: useMaatregelenVersionObjectUuidGet,
    useGetLatestLineage: useMaatregelenLatestLineageIdGet,
    useGetRevision: useRevisionsModuleIdMaatregelVersionObjectUuidGet,
    useGetRelations: useMaatregelenRelationsLineageIdGet,
    usePutRelations: useMaatregelenRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectMaatregelLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectMaatregelLineageIdPatch,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useMaatregelStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useModulesObjectsMaatregelActiveLineageIdGet,
}

const maatregel: DynamicObject<
    typeof fetchers,
    keyof MaatregelPatch,
    (keyof MaatregelStaticPostStatics)[]
> = {
    defaults: {
        singular: 'maatregel',
        singularReadable: 'maatregel',
        singularCapitalize: 'Maatregel',
        plural: 'maatregelen',
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
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de maatregel.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
            ],
        },
        {
            title: 'Beleidstekst',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct welke keuze de provincie maakt en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
            fields: [
                {
                    name: 'Description',
                    label: 'Wat gaat de provincie doen?',
                    description:
                        'Formuleer bondig wat de provincie met deze maatregel wil bewerkstelligen.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['image', 'table'],
                    imageOptions: {
                        maxSize: 819200,
                    },
                },
                {
                    name: 'Role',
                    label: 'Rol',
                    description: 'Welke rol...',
                    placeholder: 'Kies de rol',
                    type: 'select',
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
                    description: 'Beschrijf de uitwerking van de maatregel.',
                    type: 'wysiwyg',
                    hasAreaSelect: true,
                    customMenuOptions: ['image', 'table'],
                    imageOptions: {
                        maxSize: 819200,
                    },
                },
            ],
        },
        {
            title: 'Werkingsgebied',
            description:
                'Het werkingsgebied geeft het gebied weer waar de maatregel betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld, toegestaan of juist verboden.',
            fields: [
                {
                    name: 'Ambtsgebied',
                    label: 'Selecteer het gebied',
                    description: (
                        <>
                            Is op deze maatregel het ambtsgebied van toepassing
                            of een specifiek werkingsgebied? Heeft jouw
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
                    name: 'Werkingsgebied_Code',
                    label: 'Werkingsgebied',
                    type: 'search',
                    status: 'all',
                    placeholder: 'Selecteer een werkingsgebied',
                    filterType: ['werkingsgebied'],
                    objectKey: 'Werkingsgebied_Code',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    conditionalField: 'Ambtsgebied',
                },
            ],
        },
        {
            title: 'Primaire koppeling',
            fields: [
                {
                    name: 'Hierarchy_Code',
                    label: 'Beleidskeuze',
                    type: 'search',
                    required: true,
                    objectKey: 'Hierarchy_Code',
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
            ],
        },
        {
            title: 'Document/bijlage',
            fields: [
                {
                    name: 'Documents',
                    fieldName: 'Documents',
                    label: 'Selecteer één of meerdere documenten',
                    type: 'search',
                    filterType: ['document'],
                    objectKey: 'Document_Code',
                    isMulti: true,
                    closeMenuOnSelect: false,
                    status: 'all',
                    placeholder: 'Kies een of meerdere opties',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    // @ts-ignore
                    validation: schemaDefaults.optionalArray,
                },
            ],
        },
    ],
}

maatregel.validationSchema = generateDynamicSchema(maatregel.dynamicSections)

export default maatregel
