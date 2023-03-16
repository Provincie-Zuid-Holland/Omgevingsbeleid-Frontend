import {
    getModulesModuleIdObjectBeleidsdoelLatestLineageIdGetQueryKey,
    useBeleidsdoelenLatestLineageIdGet,
    useBeleidsdoelenRelationsLineageIdGet,
    useBeleidsdoelenRelationsLineageIdPut,
    useBeleidsdoelenValidGet,
    useBeleidsdoelenValidLineageIdGet,
    useBeleidsdoelenVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
} from '@/api/fetchers'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidsdoelenValidGet,
    useGetValidLineage: useBeleidsdoelenValidLineageIdGet,
    useGetVersion: useBeleidsdoelenVersionObjectUuidGet,
    useGetLatestLineage: useBeleidsdoelenLatestLineageIdGet,
    useGetRelations: useBeleidsdoelenRelationsLineageIdGet,
    usePutRelations: useBeleidsdoelenRelationsLineageIdPut,
    useGetLatestObjectInModule:
        useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
}

const queryKeys = {
    getLatestObjectInModuleQueryKey:
        getModulesModuleIdObjectBeleidsdoelLatestLineageIdGetQueryKey,
}

const beleidsdoel: DynamicObject<typeof fetchers, typeof queryKeys> = {
    defaults: {
        singular: 'beleidsdoel',
        singularCapitalize: 'Beleidsdoel',
        plural: 'beleidsdoelen',
        pluralCapitalize: 'Beleidsdoelen',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
    },
    fetchers,
    queryKeys,
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

export default beleidsdoel
