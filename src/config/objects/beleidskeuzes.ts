import {
    useBeleidskeuzesLatestLineageIdGet,
    useBeleidskeuzesRelationsLineageIdGet,
    useBeleidskeuzesRelationsLineageIdPut,
    useBeleidskeuzesValidGet,
    useBeleidskeuzesValidLineageIdGet,
    useBeleidskeuzesVersionObjectUuidGet,
} from '@/api/fetchers'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidskeuzesValidGet,
    useGetValidLineage: useBeleidskeuzesValidLineageIdGet,
    useGetVersion: useBeleidskeuzesVersionObjectUuidGet,
    useGetLatestLineage: useBeleidskeuzesLatestLineageIdGet,
    useGetRelations: useBeleidskeuzesRelationsLineageIdGet,
    usePutRelations: useBeleidskeuzesRelationsLineageIdPut,
}

const beleidskeuzes: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'beleidskeuze',
        plural: 'beleidskeuzes',
        pluralCapitalize: 'Beleidskeuzes',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
    },
    fetchers,
}

export default beleidskeuzes
