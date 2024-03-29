import { BookBookmark } from '@pzh-ui/icons'

import {
    useWettelijkeTaakLatestLineageIdGet,
    useWettelijkeTaakLineageIdDelete,
    useWettelijkeTaakLineageIdPost,
    useWettelijkeTaakPost,
    useWettelijkeTaakRelationsLineageIdGet,
    useWettelijkeTaakRelationsLineageIdPut,
    useWettelijkeTaakValidGet,
} from '@/api/fetchers'
import {
    WettelijkeTaakEdit,
    WettelijkeTaakStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useWettelijkeTaakValidGet,
    useGetValidLineage: null,
    useGetVersion: null,
    useGetLatestLineage: useWettelijkeTaakLatestLineageIdGet,
    useGetRevision: null,
    useGetRelations: useWettelijkeTaakRelationsLineageIdGet,
    usePutRelations: useWettelijkeTaakRelationsLineageIdPut,
    useGetLatestLineageInModule: null,
    usePatchObjectInModule: null,
    usePatchObject: useWettelijkeTaakLineageIdPost,
    useDeleteObject: useWettelijkeTaakLineageIdDelete,
    usePostStatic: null,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: useWettelijkeTaakPost,
    useGetActiveModules: null,
}

const wettelijkeTaak: DynamicObject<
    typeof fetchers,
    keyof WettelijkeTaakEdit,
    (keyof WettelijkeTaakStaticPostStatics)[]
> = {
    defaults: {
        singular: 'wettelijke_taak',
        singularReadable: 'wettelijke taak',
        singularCapitalize: 'Wettelijke taak',
        plural: 'wettelijke-taken',
        pluralCapitalize: 'Wettelijke taken',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        atemporal: true,
        icon: BookBookmark,
    },
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'Formuleer in enkele woorden de titel van de wettelijke taak.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Weblink',
                    label: 'Link naar wetten.nl',
                    type: 'url',
                    // @ts-ignore
                    validation: schemaDefaults.optionalUrl,
                },
            ],
        },
    ],
}

wettelijkeTaak.validationSchema = generateDynamicSchema(
    wettelijkeTaak.dynamicSections
)

export default wettelijkeTaak
