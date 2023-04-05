import {
    useAmbitiesLatestLineageIdGet,
    useAmbitiesRelationsLineageIdGet,
    useAmbitiesRelationsLineageIdPut,
    useAmbitieStaticLineageIdPost,
    useAmbitiesValidGet,
    useAmbitiesValidLineageIdGet,
    useAmbitiesVersionObjectUuidGet,
    useModulesModuleIdObjectAmbitieLatestLineageIdGet,
    useModulesModuleIdObjectAmbitieLineageIdPatch,
} from '@/api/fetchers'
import { AmbitiePatch, AmbitieStaticPostStatics } from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useAmbitiesValidGet,
    useGetValidLineage: useAmbitiesValidLineageIdGet,
    useGetVersion: useAmbitiesVersionObjectUuidGet,
    useGetLatestLineage: useAmbitiesLatestLineageIdGet,
    useGetRelations: useAmbitiesRelationsLineageIdGet,
    usePutRelations: useAmbitiesRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectAmbitieLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectAmbitieLineageIdPatch,
    usePostStatic: useAmbitieStaticLineageIdPost,
}

const ambitie: DynamicObject<
    typeof fetchers,
    keyof AmbitiePatch,
    (keyof AmbitieStaticPostStatics)[]
> = {
    defaults: {
        singular: 'ambitie',
        singularCapitalize: 'Ambitie',
        plural: 'ambities',
        pluralCapitalize: 'Ambities',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        slugOverview: 'ambities',
        description:
            'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.',
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    allowedConnections: [{ type: 'beleidsdoel', key: 'Beleidsdoelen' }],
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de ambitie kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de ambitie.',
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
    ],
}

ambitie.validationSchema = generateDynamicSchema(ambitie.dynamicSections)

export default ambitie
