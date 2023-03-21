import {
    useMaatregelenLatestLineageIdGet,
    useMaatregelenRelationsLineageIdGet,
    useMaatregelenRelationsLineageIdPut,
    useMaatregelenValidGet,
    useMaatregelenValidLineageIdGet,
    useMaatregelenVersionObjectUuidGet,
    useModulesModuleIdObjectMaatregelLatestLineageIdGet,
    useModulesModuleIdObjectMaatregelLineageIdPatch,
} from '@/api/fetchers'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useMaatregelenValidGet,
    useGetValidLineage: useMaatregelenValidLineageIdGet,
    useGetVersion: useMaatregelenVersionObjectUuidGet,
    useGetLatestLineage: useMaatregelenLatestLineageIdGet,
    useGetRelations: useMaatregelenRelationsLineageIdGet,
    usePutRelations: useMaatregelenRelationsLineageIdPut,
    useGetLatestObjectInModule:
        useModulesModuleIdObjectMaatregelLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectMaatregelLineageIdPatch,
}

const maatregel: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'maatregel',
        singularCapitalize: 'Maatregel',
        plural: 'maatregelen',
        pluralCapitalize: 'Maatregelen',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        slugOverview: 'maatregelen',
        description:
            'De maatregelen geven aan wat de provincie gaat doen om de keuzes uit te voeren. De maatregelen zijn een uitwerking van de beleidskeuzes en komen voort uit het Omgevingsprogramma.',
    },
    fetchers,
    dynamicSections: [
        {
            type: 'description',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’. Maak indien nodig gebruik van tekstopmaak.',
            fieldDescription:
                'Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid. Formuleer wat de provincie gaat realiseren, of de maatregel voor een specifiek gebied van toepassing is, aan welke beleidskeuzes de maatregel bijdraagt en in welke rol de provincie op zich neemt.',
        },
    ],
}

export default maatregel
