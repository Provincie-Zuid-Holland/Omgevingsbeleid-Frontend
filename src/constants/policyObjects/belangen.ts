import { object, ObjectSchema } from 'yup'

import {
    usePostBelangen,
    useGetBelangenLineageId,
    usePatchBelangenLineageId,
    useGetValidBelangenLineageId,
    useGetBelangen,
    useGetVersionBelangenObjectUuid,
    useGetValidBelangen,
} from '@/api/fetchers'
import { BelangenWrite } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBelangen: SchemaMetaQueries = {
    usePost: usePostBelangen,
    useGet: useGetBelangen,
    useGetVersion: useGetVersionBelangenObjectUuid,
    useGetLineage: useGetBelangenLineageId,
    useGetValidLineage: useGetValidBelangenLineageId,
    usePatchLineage: usePatchBelangenLineageId,
    useGetValid: useGetValidBelangen,
}

const belangenTitles = generateSchemaTitles({
    titleSingular: 'belang',
    titlePlural: 'belangen',
    prefixSingular: 'het',
    prefixPlural: 'de',
})

const belangenMeta: SchemaMeta<typeof queryBelangen> = {
    title: belangenTitles,
    slug: {
        overview: 'belangen',
    },
    query: queryBelangen,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BelangenWrite>> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Type: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(belangenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryBelangen>

export const EMPTY_WRITE_OBJECT: BelangenWrite = SCHEMA.getDefault()
