import { CircleExclamation } from '@pzh-ui/icons'

import {
    useVerplichtProgrammaLatestLineageIdGet,
    useVerplichtProgrammaLineageIdPost,
    useVerplichtProgrammaPost,
    useVerplichtProgrammaRelationsLineageIdGet,
    useVerplichtProgrammaRelationsLineageIdPut,
    useVerplichtProgrammaValidGet,
} from '@/api/fetchers'
import {
    VerplichtProgrammaEdit,
    VerplichtProgrammaStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useVerplichtProgrammaValidGet,
    useGetValidLineage: null,
    useGetVersion: null,
    useGetLatestLineage: useVerplichtProgrammaLatestLineageIdGet,
    useGetRelations: useVerplichtProgrammaRelationsLineageIdGet,
    usePutRelations: useVerplichtProgrammaRelationsLineageIdPut,
    useGetLatestLineageInModule: null,
    usePatchObjectInModule: null,
    usePatchObject: useVerplichtProgrammaLineageIdPost,
    usePostStatic: null,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: useVerplichtProgrammaPost,
    useGetActiveModules: null,
}

const verplichtProgramma: DynamicObject<
    typeof fetchers,
    keyof VerplichtProgrammaEdit | 'connections',
    (keyof VerplichtProgrammaStaticPostStatics)[]
> = {
    defaults: {
        singular: 'verplicht_programma',
        singularReadable: 'verplicht programma',
        singularCapitalize: 'Verplicht programma',
        plural: 'verplichte-programmas',
        pluralCapitalize: "Verplichte programma's",
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        atemporal: true,
        icon: CircleExclamation,
    },
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'Formuleer in enkele woorden de titel van het verplichte programma.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    description:
                        'Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
        {
            title: 'Koppelingen',
            description:
                'Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een verplicht programma is veelal gekoppeld met maatregelen en wettelijke taken.',
            fields: [
                {
                    name: 'connections',
                    label: 'Koppelingen',
                    type: 'connections',
                    description:
                        'Geef aan welke onderdelen gekoppeld moeten worden aan dit verplichte programma.',
                    allowedConnections: [
                        {
                            key: 'Maatregelen',
                            type: 'maatregel',
                        },
                        {
                            key: 'WettelijkeTaken',
                            type: 'wettelijke_taak',
                        },
                    ],
                },
            ],
        },
    ],
}

verplichtProgramma.validationSchema = generateDynamicSchema(
    verplichtProgramma.dynamicSections
)

export default verplichtProgramma
