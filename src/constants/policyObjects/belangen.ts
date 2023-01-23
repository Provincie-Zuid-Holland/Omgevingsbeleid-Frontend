import { object, ObjectSchema } from 'yup'

import {
    useCreateBelang,
    useReadBelangLineage,
    useUpdateBelang,
    useReadValidBelangLineage,
    useReadBelangen,
    useReadBelangVersion,
    useReadValidBelangen,
} from '@/api/fetchers'
import { BelangUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBelangen: SchemaMetaQueries = {
    usePost: useCreateBelang,
    useGet: useReadBelangen,
    useGetVersion: useReadBelangVersion,
    useGetLineage: useReadBelangLineage,
    useGetValidLineage: useReadValidBelangLineage,
    usePatchLineage: useUpdateBelang,
    useGetValid: useReadValidBelangen,
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

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BelangUpdate>> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Type: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(belangenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryBelangen>

export const EMPTY_WRITE_OBJECT: BelangUpdate = SCHEMA.getDefault()
