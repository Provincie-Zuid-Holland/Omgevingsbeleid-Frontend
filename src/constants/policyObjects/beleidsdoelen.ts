import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidsdoelen,
    useGetBeleidsdoelenLineageid,
    usePatchBeleidsdoelenLineageid,
    useGetValidBeleidsdoelenLineageid,
    useGetBeleidsdoelen,
    useGetVersionBeleidsdoelenObjectuuid,
    useGetValidBeleidsdoelen,
} from '@/api/fetchers'
import { BeleidsdoelenWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/schema'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsdoelen: SchemaMetaQueries = {
    usePost: usePostBeleidsdoelen,
    useGet: useGetBeleidsdoelen,
    useGetVersion: useGetVersionBeleidsdoelenObjectuuid,
    useGetLineage: useGetBeleidsdoelenLineageid,
    useGetValidLineage: useGetValidBeleidsdoelenLineageid,
    usePatchLineage: usePatchBeleidsdoelenLineageid,
    useGetValid: useGetValidBeleidsdoelen,
}

const beleidsdoelenTitles = generateSchemaTitles({
    titleSingular: 'beleidsdoel',
    titlePlural: 'beleidsdoelen',
    prefixSingular: 'het',
    prefixPlural: 'de',
})

const beleidsdoelenMeta: SchemaMeta<typeof queryBeleidsdoelen> = {
    title: beleidsdoelenTitles,
    description:
        'De beleidsdoelen geven aan wat de provincie wil bereiken. De beleidsdoelen zijn een uitwerking van de ambities en komen voort uit de begroting.',
    slug: {
        overview: 'beleidsdoelen',
        new: 'nieuw-beleidsdoel',
    },
    query: queryBeleidsdoelen,
}

// TODO: @Jordy add null type to eind & begin dates
export const SCHEMA: ObjectSchema<BeleidsdoelenWrite> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(beleidsdoelenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsdoelen
>

export const EMPTY_WRITE_OBJECT: BeleidsdoelenWrite = SCHEMA.getDefault()
