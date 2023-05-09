import {
    useNationaalBelangLatestLineageIdGet,
    useNationaalBelangLineageIdPost,
    useNationaalBelangPost,
    useNationaalBelangRelationsLineageIdGet,
    useNationaalBelangRelationsLineageIdPut,
    useNationaalBelangValidGet,
} from '@/api/fetchers'
import {
    NationaalBelangEdit,
    NationaalBelangStaticEditStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useNationaalBelangValidGet,
    useGetValidLineage: null,
    useGetVersion: null,
    useGetLatestLineage: useNationaalBelangLatestLineageIdGet,
    useGetRelations: useNationaalBelangRelationsLineageIdGet,
    usePutRelations: useNationaalBelangRelationsLineageIdPut,
    useGetLatestLineageInModule: null,
    usePatchObjectInModule: null,
    usePatchObject: useNationaalBelangLineageIdPost,
    usePostStatic: null,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: useNationaalBelangPost,
}

const nationaalBelang: DynamicObject<
    typeof fetchers,
    keyof NationaalBelangEdit,
    (keyof NationaalBelangStaticEditStatics)[]
> = {
    defaults: {
        singular: 'nationaal_belang',
        singularReadable: 'nationaal belang',
        singularCapitalize: 'Nationaal belang',
        plural: 'nationale_belangen',
        pluralCapitalize: 'Nationale belangen',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        atemporal: true,
    },
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'Formuleer in enkele woorden de titel van het nationale belang.',
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
                    required: true,
                    validation: schemaDefaults.url(),
                },
            ],
        },
    ],
}

nationaalBelang.validationSchema = generateDynamicSchema(
    nationaalBelang.dynamicSections
)

export default nationaalBelang
