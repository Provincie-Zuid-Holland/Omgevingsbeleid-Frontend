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
    useGetLatestObjectInModule:
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
    dynamicSections: [
        {
            type: 'description',
            description:
                'Een beleidsdoel bevindt zich op tactisch niveau, tussen het niveau van de ambities en de beleidskeuzes.',
            fieldDescription:
                'Geef een korte omschrijving van dit beleidsdoel.',
        },
        {
            type: 'connections',
            description:
                'De belangrijkste onderdelen in een beleidsdoel zijn de ambities. In dit gedeelte kunnen de maatregelen worden gekoppeld aan dit gebiedsprogramma.',
            fieldDescription:
                'Geef aan welke ambities onderdeel zijn van dit beleidsdoel.',
            allowedConnections: ['ambitie', 'beleidskeuze'],
        },
    ],
}

beleidsdoel.validationSchema = generateDynamicSchema(
    beleidsdoel.dynamicSections!
)

export default beleidsdoel
