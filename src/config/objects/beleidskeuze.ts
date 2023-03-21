import {
    useBeleidskeuzesLatestLineageIdGet,
    useBeleidskeuzesRelationsLineageIdGet,
    useBeleidskeuzesRelationsLineageIdPut,
    useBeleidskeuzesValidGet,
    useBeleidskeuzesValidLineageIdGet,
    useBeleidskeuzesVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
} from '@/api/fetchers'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidskeuzesValidGet,
    useGetValidLineage: useBeleidskeuzesValidLineageIdGet,
    useGetVersion: useBeleidskeuzesVersionObjectUuidGet,
    useGetLatestLineage: useBeleidskeuzesLatestLineageIdGet,
    useGetRelations: useBeleidskeuzesRelationsLineageIdGet,
    usePutRelations: useBeleidskeuzesRelationsLineageIdPut,
    useGetLatestObjectInModule:
        useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
}

const beleidskeuze: DynamicObject<typeof fetchers> = {
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
    dynamicSections: [
        {
            type: 'description',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’. Maak indien nodig gebruik van tekstopmaak.',
            fieldDescription:
                'Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid. Formuleer wat de provincie gaat realiseren, of de maatregel voor een specifiek gebied van toepassing is, aan welke beleidskeuzes de maatregel bijdraagt en in welke rol de provincie op zich neemt.',
        },
        {
            type: 'connections',
            allowedConnections: ['beleidskeuze'],
            description:
                'De maatregel kan worden gekoppeld aan een beleidskeuze (waardoor de maatregel indirect is gekoppeld aan een thematisch programma) en aan een gebiedsprogramma.',
            fieldDescription:
                'Geef aan welke beleidskeuzes en gebiedsprogramma’s te maken hebben met deze maatregel.',
        },
    ],
}

export default beleidskeuze
