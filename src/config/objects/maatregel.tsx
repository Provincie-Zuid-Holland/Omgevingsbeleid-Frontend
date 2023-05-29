import { Hyperlink } from '@pzh-ui/components'
import { CalendarCheck } from '@pzh-ui/icons'

import {
    useMaatregelenLatestLineageIdGet,
    useMaatregelenRelationsLineageIdGet,
    useMaatregelenRelationsLineageIdPut,
    useMaatregelenValidGet,
    useMaatregelenValidLineageIdGet,
    useMaatregelenVersionObjectUuidGet,
    useMaatregelStaticLineageIdPost,
    useModulesModuleIdObjectMaatregelLatestLineageIdGet,
    useModulesModuleIdObjectMaatregelLineageIdPatch,
} from '@/api/fetchers'
import {
    MaatregelPatch,
    MaatregelStaticPatchStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useMaatregelenValidGet,
    useGetValidLineage: useMaatregelenValidLineageIdGet,
    useGetVersion: useMaatregelenVersionObjectUuidGet,
    useGetLatestLineage: useMaatregelenLatestLineageIdGet,
    useGetRelations: useMaatregelenRelationsLineageIdGet,
    usePutRelations: useMaatregelenRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectMaatregelLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectMaatregelLineageIdPatch,
    usePatchObject: null,
    usePostStatic: useMaatregelStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
}

const maatregel: DynamicObject<
    typeof fetchers,
    keyof MaatregelPatch,
    (keyof MaatregelStaticPatchStatics)[]
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
        slugOverview: 'omgevingsprogramma/maatregelen',
        description:
            'De maatregelen geven aan wat de provincie gaat doen om de keuzes uit te voeren. De maatregelen zijn een uitwerking van de beleidskeuzes en komen voort uit het Omgevingsprogramma.',
        icon: CalendarCheck,
    },
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [{ type: 'beleidsdoel', key: 'Beleidsdoelen' }],
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            maatregel is veelal gekoppeld met beleidsdoelen. Hieronder een
            overzicht van de beleidsdoelen van deze maatregel. Bekijk voor het
            volledige overzicht het{' '}
            <Hyperlink text="beleidsnetwerk" to="/beleidsnetwerk" />.
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
                    name: 'Accomplish',
                    label: 'Wat wil de provincie bereiken?',
                    description:
                        'Formuleer bondig wat de provincie met deze maatregel wil bewerkstelligen.',
                    type: 'wysiwyg',
                    required: true,
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
                    required: true,
                },
                {
                    name: 'Effect',
                    label: 'Uitwerking',
                    description: 'Beschrijf de uitwerking van de maatregel.',
                    type: 'wysiwyg',
                    required: true,
                },
            ],
        },
        {
            title: 'Werkingsgebied',
            description:
                'Het werkingsgebied geeft het gebied weer waar de maatregel betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld, toegestaan of juist verboden.',
            fields: [
                {
                    name: 'Gebied_UUID',
                    label: 'Selecteer werkingsgebied',
                    description: (
                        <>
                            Selecteer het werkingsgebied wat bij deze maatregel
                            van toepassing is. Heeft jouw maatregel nog geen
                            geschikt werkingsgebied, of moet het huidige gebied
                            aangepast worden? Neem dan contact op via{' '}
                            <a
                                href="mailto:omgevingsbeleid@pzh.nl"
                                className="underline">
                                omgevingsbeleid@pzh.nl
                            </a>
                            .
                        </>
                    ),
                    type: 'area',
                },
            ],
        },
    ],
}

maatregel.validationSchema = generateDynamicSchema(maatregel.dynamicSections)

export default maatregel
