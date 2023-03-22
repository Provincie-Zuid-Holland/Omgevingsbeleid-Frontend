import {
    useAmbitiesLatestLineageIdGet,
    useAmbitiesRelationsLineageIdGet,
    useAmbitiesRelationsLineageIdPut,
    useAmbitiesValidGet,
    useAmbitiesValidLineageIdGet,
    useAmbitiesVersionObjectUuidGet,
    useModulesModuleIdObjectAmbitieLatestLineageIdGet,
    useModulesModuleIdObjectAmbitieLineageIdPatch,
} from '@/api/fetchers'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useAmbitiesValidGet,
    useGetValidLineage: useAmbitiesValidLineageIdGet,
    useGetVersion: useAmbitiesVersionObjectUuidGet,
    useGetLatestLineage: useAmbitiesLatestLineageIdGet,
    useGetRelations: useAmbitiesRelationsLineageIdGet,
    usePutRelations: useAmbitiesRelationsLineageIdPut,
    useGetLatestObjectInModule:
        useModulesModuleIdObjectAmbitieLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectAmbitieLineageIdPatch,
}

const ambitie: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'ambitie',
        singularCapitalize: 'Ambitie',
        plural: 'ambities',
        pluralCapitalize: 'Ambitie',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        slugOverview: 'ambities',
        description:
            'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.',
    },
    fetchers,
    dynamicSections: [
        {
            type: 'description',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de ambitie kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
            fieldDescription: 'Geef een korte omschrijving van deze ambitie.',
        },
    ],
}

export default ambitie
