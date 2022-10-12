import { object, ObjectSchema } from 'yup'

import {
    usePostMaatregelen,
    useGetMaatregelenLineageid,
    usePatchMaatregelenLineageid,
    useGetValidMaatregelenLineageid,
    useGetMaatregelen,
    useGetVersionMaatregelenObjectuuid,
    useGetValidMaatregelen,
} from '@/api/fetchers'
import { MaatregelenWrite, MaatregelenRead } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryMaatregelen: SchemaMetaQueries = {
    useGet: useGetMaatregelen,
    useGetVersion: useGetVersionMaatregelenObjectuuid,
    useGetLineage: useGetMaatregelenLineageid,
    useGetValidLineage: useGetValidMaatregelenLineageid,
    usePost: usePostMaatregelen,
    usePatchLineage: usePatchMaatregelenLineageid,
    useGetValid: useGetValidMaatregelen,
}

const maatregelenTitles = generateSchemaTitles({
    titleSingular: 'maatregel',
    titlePlural: 'maatregelen',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const maatregelenMeta: SchemaMeta<typeof queryMaatregelen> = {
    title: maatregelenTitles,
    slug: {
        overview: 'maatregelen',
    },
    query: queryMaatregelen,
}

export const SCHEMA: ObjectSchema<
    MutatedPolicySchema<MaatregelenWrite | MaatregelenRead>
> = object({
    Titel: schemaDefaults.Titel,
    Aanpassing_Op: schemaDefaults.optionalString,
    Gebied: schemaDefaults.gebied,
    Gebied_Duiding: schemaDefaults.optionalString,
    Tags: schemaDefaults.optionalString,
    Toelichting_Raw: schemaDefaults.optionalString,
    Eigenaar_1: schemaDefaults.optionalString,
    Eigenaar_2: schemaDefaults.optionalString,
    Opdrachtgever: schemaDefaults.optionalString,
    Portefeuillehouder_1: schemaDefaults.optionalString,
    Portefeuillehouder_2: schemaDefaults.optionalString,
    Omschrijving: schemaDefaults.optionalString,
    Toelichting: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
    Status: schemaDefaults.Status,
    Weblink: schemaDefaults.optionalString,
}).meta(maatregelenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryMaatregelen
>

export const EMPTY_WRITE_OBJECT: MaatregelenWrite = SCHEMA.getDefault()
