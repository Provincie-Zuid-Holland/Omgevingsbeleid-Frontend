import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidsmodules,
    useGetBeleidsmodulesLineageid,
    usePatchBeleidsmodulesLineageid,
    useGetValidBeleidsmodulesLineageid,
    useGetBeleidsmodules,
    useGetVersionBeleidsmodulesObjectuuid,
    useGetValidBeleidsmodules,
} from '@/api/fetchers'
import { BeleidsmodulesWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsmodules: SchemaMetaQueries = {
    usePost: usePostBeleidsmodules,
    useGet: useGetBeleidsmodules,
    useGetVersion: useGetVersionBeleidsmodulesObjectuuid,
    useGetLineage: useGetBeleidsmodulesLineageid,
    useGetValidLineage: useGetValidBeleidsmodulesLineageid,
    usePatchLineage: usePatchBeleidsmodulesLineageid,
    useGetValid: useGetValidBeleidsmodules,
}

const beleidsmodulesTitles = generateSchemaTitles({
    titleSingular: 'beleidsmodule',
    titlePlural: 'beleidsmodules',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const beleidsmodulesMeta: SchemaMeta<typeof queryBeleidsmodules> = {
    title: beleidsmodulesTitles,
    description: null,
    slug: {
        overview: 'beleidsmodules',
        new: 'nieuw-beleidsmodule',
    },
    query: queryBeleidsmodules,
}

// TODO: @Jordy add null type to eind & begin dates
export const SCHEMA: ObjectSchema<BeleidsmodulesWrite> = object({
    Titel: schemaDefaults.Titel,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
    Beleidskeuzes: schemaDefaults.listReference,
    Maatregelen: schemaDefaults.listReference,
}).meta(beleidsmodulesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsmodules
>

export const EMPTY_WRITE_OBJECT: BeleidsmodulesWrite = SCHEMA.getDefault()