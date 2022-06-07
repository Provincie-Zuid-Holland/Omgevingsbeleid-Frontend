import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidsregels,
    useGetBeleidsregelsLineageid,
    usePatchBeleidsregelsLineageid,
    useGetValidBeleidsregelsLineageid,
    useGetBeleidsregels,
    useGetVersionBeleidsregelsObjectuuid,
    useGetValidBeleidsregels,
} from '@/api/fetchers'
import { BeleidsregelsWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/schema'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsregels: SchemaMetaQueries = {
    usePost: usePostBeleidsregels,
    useGet: useGetBeleidsregels,
    useGetVersion: useGetVersionBeleidsregelsObjectuuid,
    useGetLineage: useGetBeleidsregelsLineageid,
    useGetValidLineage: useGetValidBeleidsregelsLineageid,
    usePatchLineage: usePatchBeleidsregelsLineageid,
    useGetValid: useGetValidBeleidsregels,
}

const beleidsregelsTitles = generateSchemaTitles({
    titleSingular: 'beleidsregel',
    titlePlural: 'beleidsregels',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const beleidsregelsMeta: SchemaMeta<typeof queryBeleidsregels> = {
    title: beleidsregelsTitles,
    description:
        'De beleidsregels geven aan waar de provincie zich minimaal voor moet inspannen. De beleidsregels zijn individuele regels die de provincie zelf vaststelt.',
    slug: {
        overview: 'beleidsregels',
        new: 'nieuw-beleidsregel',
    },
    query: queryBeleidsregels,
}

// TODO: @Jordy add null type to eind & begin dates
export const SCHEMA: ObjectSchema<BeleidsregelsWrite> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Externe_URL: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(beleidsregelsMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsregels
>

export const EMPTY_WRITE_OBJECT: BeleidsregelsWrite = SCHEMA.getDefault()
