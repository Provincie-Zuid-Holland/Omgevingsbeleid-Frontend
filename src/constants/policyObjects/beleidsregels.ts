import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidsregels,
    useGetBeleidsregelsLineageId,
    usePatchBeleidsregelsLineageId,
    useGetValidBeleidsregelsLineageId,
    useGetBeleidsregels,
    useGetVersionBeleidsregelsObjectUuid,
    useGetValidBeleidsregels,
} from '@/api/fetchers'
import { BeleidsregelsWrite } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsregels: SchemaMetaQueries = {
    usePost: usePostBeleidsregels,
    useGet: useGetBeleidsregels,
    useGetVersion: useGetVersionBeleidsregelsObjectUuid,
    useGetLineage: useGetBeleidsregelsLineageId,
    useGetValidLineage: useGetValidBeleidsregelsLineageId,
    usePatchLineage: usePatchBeleidsregelsLineageId,
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
    slug: {
        overview: 'beleidsregels',
    },
    query: queryBeleidsregels,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsregelsWrite>> =
    object({
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
