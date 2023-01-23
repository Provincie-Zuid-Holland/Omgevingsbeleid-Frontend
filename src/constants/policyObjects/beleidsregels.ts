import { object, ObjectSchema } from 'yup'

import {
    useCreateBeleidsregel,
    useReadBeleidsregelLineage,
    useUpdateBeleidsregel,
    useReadValidBeleidsregelLineage,
    useReadBeleidsregels,
    useReadBeleidsregelVersion,
    useReadValidBeleidsregels,
} from '@/api/fetchers'
import { BeleidsregelUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsregels: SchemaMetaQueries = {
    usePost: useCreateBeleidsregel,
    useGet: useReadBeleidsregels,
    useGetVersion: useReadBeleidsregelVersion,
    useGetLineage: useReadBeleidsregelLineage,
    useGetValidLineage: useReadValidBeleidsregelLineage,
    usePatchLineage: useUpdateBeleidsregel,
    useGetValid: useReadValidBeleidsregels,
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

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsregelUpdate>> =
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

export const EMPTY_WRITE_OBJECT: BeleidsregelUpdate = SCHEMA.getDefault()
