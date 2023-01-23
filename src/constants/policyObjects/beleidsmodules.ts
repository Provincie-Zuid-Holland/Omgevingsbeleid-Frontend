import { object, ObjectSchema } from 'yup'

import {
    useCreateBeleidsmodule,
    useReadBeleidsmoduleLineage,
    useUpdateBeleidsmodule,
    useReadValidBeleidsmoduleLineage,
    useReadBeleidsmodules,
    useReadBeleidsmoduleVersion,
    useReadValidBeleidsmodules,
} from '@/api/fetchers'
import { BeleidsmoduleUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsmodules: SchemaMetaQueries = {
    usePost: useCreateBeleidsmodule,
    useGet: useReadBeleidsmodules,
    useGetVersion: useReadBeleidsmoduleVersion,
    useGetLineage: useReadBeleidsmoduleLineage,
    useGetValidLineage: useReadValidBeleidsmoduleLineage,
    usePatchLineage: useUpdateBeleidsmodule,
    useGetValid: useReadValidBeleidsmodules,
}

const beleidsmodulesTitles = generateSchemaTitles({
    titleSingular: 'beleidsmodule',
    titlePlural: 'beleidsmodules',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const beleidsmodulesMeta: SchemaMeta<typeof queryBeleidsmodules> = {
    title: beleidsmodulesTitles,
    slug: {
        overview: 'beleidsmodules',
    },
    query: queryBeleidsmodules,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsmoduleUpdate>> =
    object({
        Titel: schemaDefaults.Titel,
        Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
        Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
        Beleidskeuzes: schemaDefaults.listReference,
        Maatregelen: schemaDefaults.listReference,
        Besluit_Datum: schemaDefaults.optionalString,
        Gebiedsprogrammas: schemaDefaults.listReference,
    }).meta(beleidsmodulesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsmodules
>

export const EMPTY_WRITE_OBJECT: BeleidsmoduleUpdate = SCHEMA.getDefault()
