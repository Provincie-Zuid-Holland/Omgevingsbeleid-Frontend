import { object, ObjectSchema } from 'yup'

import {
    useCreateMaatregel,
    useReadMaatregelLineage,
    useUpdateMaatregel,
    useReadValidMaatregelLineage,
    useReadMaatregelen,
    useReadMaatregelVersion,
    useReadValidMaatregelen,
} from '@/api/fetchers'
import { MaatregelUpdate, Maatregel } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryMaatregelen: SchemaMetaQueries = {
    useGet: useReadMaatregelen,
    useGetVersion: useReadMaatregelVersion,
    useGetLineage: useReadMaatregelLineage,
    useGetValidLineage: useReadValidMaatregelLineage,
    usePost: useCreateMaatregel,
    usePatchLineage: useUpdateMaatregel,
    useGetValid: useReadValidMaatregelen,
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
    MutatedPolicySchema<MaatregelUpdate | Maatregel>
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

export const EMPTY_WRITE_OBJECT: MaatregelUpdate = SCHEMA.getDefault()
