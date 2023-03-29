import {
    useBeleidskeuzesLatestLineageIdGet,
    useBeleidskeuzesRelationsLineageIdGet,
    useBeleidskeuzesRelationsLineageIdPut,
    useBeleidskeuzeStaticLineageIdPost,
    useBeleidskeuzesValidGet,
    useBeleidskeuzesValidLineageIdGet,
    useBeleidskeuzesVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
} from '@/api/fetchers'
import { BeleidskeuzeStaticPatch } from '@/api/fetchers.schemas'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidskeuzesValidGet,
    useGetValidLineage: useBeleidskeuzesValidLineageIdGet,
    useGetVersion: useBeleidskeuzesVersionObjectUuidGet,
    useGetLatestLineage: useBeleidskeuzesLatestLineageIdGet,
    useGetRelations: useBeleidskeuzesRelationsLineageIdGet,
    usePutRelations: useBeleidskeuzesRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
    usePostStatic: useBeleidskeuzeStaticLineageIdPost,
}

const beleidskeuze: DynamicObject<
    typeof fetchers,
    (keyof BeleidskeuzeStaticPatch)[]
> = {
    defaults: {
        singular: 'beleidskeuze',
        singularCapitalize: 'Beleidskeuze',
        plural: 'beleidskeuzes',
        pluralCapitalize: 'Beleidskeuzes',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        slugOverview: 'beleidskeuzes',
        description:
            'De beleidskeuzes geven aan hoe de provincie haar doelen wil bereiken. De beleidskeuzes zijn een uitwerking van de beleidsdoelen en komen voort uit de Omgevingsvisie.',
    },
    fetchers,
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [
        { type: 'beleidskeuze', key: 'Beleidskeuzes' },
        { type: 'beleidsdoel', key: 'Beleidsdoelen' },
    ],
    dynamicSections: [
        {
            type: 'description',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
            fieldDescription:
                'Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid. Formuleer wat de provincie gaat realiseren, of de maatregel voor een specifiek gebied van toepassing is, aan welke beleidskeuzes de maatregel bijdraagt en in welke rol de provincie op zich neemt.',
        },
    ],
}

export default beleidskeuze
