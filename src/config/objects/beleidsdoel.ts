import {
    useBeleidsdoelenLatestLineageIdGet,
    useBeleidsdoelenRelationsLineageIdGet,
    useBeleidsdoelenRelationsLineageIdPut,
    useBeleidsdoelenValidGet,
    useBeleidsdoelenValidLineageIdGet,
    useBeleidsdoelenVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidsdoelenValidGet,
    useGetValidLineage: useBeleidsdoelenValidLineageIdGet,
    useGetVersion: useBeleidsdoelenVersionObjectUuidGet,
    useGetLatestLineage: useBeleidsdoelenLatestLineageIdGet,
    useGetRelations: useBeleidsdoelenRelationsLineageIdGet,
    usePutRelations: useBeleidsdoelenRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
}

const beleidsdoel: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'beleidsdoel',
        singularCapitalize: 'Beleidsdoel',
        plural: 'beleidsdoelen',
        pluralCapitalize: 'Beleidsdoelen',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        slugOverview: 'beleidsdoelen',
        description:
            'De beleidsdoelen geven aan wat de provincie wil bereiken. De beleidsdoelen zijn een uitwerking van de ambities en komen voort uit de begroting.',
    },
    fetchers,
    allowedConnections: [
        { type: 'ambitie', key: 'Ambities' },
        { type: 'beleidskeuze', key: 'Beleidskeuzes' },
    ],
    dynamicSections: [
        {
            type: 'description',
            description:
                'Een beleidsdoel bevindt zich op tactisch niveau, tussen het niveau van de ambities en de beleidskeuzes.',
            fieldDescription:
                'Geef een korte omschrijving van dit beleidsdoel.',
        },
    ],
}

beleidsdoel.validationSchema = generateDynamicSchema(
    beleidsdoel.dynamicSections!
)

export default beleidsdoel
