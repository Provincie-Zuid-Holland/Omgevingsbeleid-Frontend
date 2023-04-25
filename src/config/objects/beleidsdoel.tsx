import { Hyperlink } from '@pzh-ui/components'

import {
    useBeleidsdoelenLatestLineageIdGet,
    useBeleidsdoelenRelationsLineageIdGet,
    useBeleidsdoelenRelationsLineageIdPut,
    useBeleidsdoelenValidGet,
    useBeleidsdoelenValidLineageIdGet,
    useBeleidsdoelenVersionObjectUuidGet,
    useBeleidsdoelStaticLineageIdPost,
    useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
} from '@/api/fetchers'
import {
    BeleidsdoelPatch,
    BeleidsdoelStaticPatchStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

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
    usePostStatic: useBeleidsdoelStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
}

const beleidsdoel: DynamicObject<
    typeof fetchers,
    keyof BeleidsdoelPatch,
    (keyof BeleidsdoelStaticPatchStatics)[]
> = {
    defaults: {
        singular: 'beleidsdoel',
        singularCapitalize: 'Beleidsdoel',
        plural: 'beleidsdoelen',
        pluralCapitalize: 'Beleidsdoelen',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        slugOverview: 'beleidsdoelen',
        description:
            'De beleidsdoelen geven aan wat de provincie wil bereiken. De beleidsdoelen zijn een uitwerking van de ambities en komen voort uit de begroting.',
    },
    fetchers,
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    allowedConnections: [
        { type: 'ambitie', key: 'Ambities' },
        { type: 'beleidskeuze', key: 'Beleidskeuzes' },
    ],
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            beleidsdoel komt voort uit een ambitie, en wordt uitgewerkt in één
            of meerdere beleidskeuzes. Hieronder een overzicht van de ambitie(s)
            en beleidskeuze(s). Bekijk voor het volledige overzicht het{' '}
            <Hyperlink text="beleidsnetwerk" to="/beleidsnetwerk" />.
        </>
    ),
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot het beleidsdoel kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de beleidskeuze.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    description:
                        'Geef een korte omschrijving van dit beleidsdoel.',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
    ],
}

beleidsdoel.validationSchema = generateDynamicSchema(
    beleidsdoel.dynamicSections
)

export default beleidsdoel
