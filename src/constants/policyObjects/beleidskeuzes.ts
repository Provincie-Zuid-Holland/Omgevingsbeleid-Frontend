import { object, ObjectSchema } from 'yup'

import {
    useCreateBeleidskeuze,
    useReadBeleidskeuzeLineage,
    useUpdateBeleidskeuze,
    useReadValidBeleidskeuzeLineage,
    useReadBeleidskeuzes,
    useReadBeleidskeuzeVersion,
    useReadValidBeleidskeuzes,
} from '@/api/fetchers'
import { BeleidskeuzeUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryBeleidskeuzes: SchemaMetaQueries = {
    usePost: useCreateBeleidskeuze,
    useGet: useReadBeleidskeuzes,
    useGetVersion: useReadBeleidskeuzeVersion,
    useGetLineage: useReadBeleidskeuzeLineage,
    useGetValidLineage: useReadValidBeleidskeuzeLineage,
    usePatchLineage: useUpdateBeleidskeuze,
    useGetValid: useReadValidBeleidskeuzes,
}

const beleidskeuzesTitles = generateSchemaTitles({
    titleSingular: 'beleidskeuze',
    titlePlural: 'beleidskeuzes',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const beleidskeuzesMeta: SchemaMeta<typeof queryBeleidskeuzes> = {
    title: beleidskeuzesTitles,
    slug: {
        overview: 'beleidskeuzes',
    },
    query: queryBeleidskeuzes,
}

type BeleidskeuzeSchema = ObjectSchema<MutatedPolicySchema<BeleidskeuzeUpdate>>

export const beleidskeuzeStatussesWithStartValidity = ['Ontwerp GS Concept']

export const SCHEMA: BeleidskeuzeSchema = object({
    Titel: schemaDefaults.Titel,
    Aanleiding: schemaDefaults.optionalString,
    Aanpassing_Op: schemaDefaults.optionalString,
    Afweging: schemaDefaults.optionalString,
    Besluitnummer: schemaDefaults.optionalString,
    Eigenaar_1_UUID: schemaDefaults.optionalString,
    Eigenaar_2_UUID: schemaDefaults.optionalString,
    Modified_By: schemaDefaults.optionalString,
    Omschrijving_Keuze: schemaDefaults.optionalString,
    Omschrijving_Werking: schemaDefaults.optionalString,
    Opdrachtgever_UUID: schemaDefaults.optionalString,
    Portefeuillehouder_1_UUID: schemaDefaults.optionalString,
    Portefeuillehouder_2_UUID: schemaDefaults.optionalString,
    Provinciaal_Belang: schemaDefaults.optionalString,
    Tags: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Status: schemaDefaults.Status,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.requiredBasedOnStatusses(
        beleidskeuzeStatussesWithStartValidity
    ),
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
    Ambities: schemaDefaults.listReference,
    Belangen: schemaDefaults.listReference,
    Beleidsdoelen: schemaDefaults.listReference,
    Beleidsprestaties: schemaDefaults.listReference,
    Beleidsregels: schemaDefaults.listReference,
    Maatregelen: schemaDefaults.listReference,
    Themas: schemaDefaults.listReference,
    Verordeningen: schemaDefaults.listReference,
    Werkingsgebieden: schemaDefaults.listReference,
}).meta(beleidskeuzesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidskeuzes
>

export const EMPTY_WRITE_OBJECT: MutatedPolicySchema<BeleidskeuzeUpdate> =
    SCHEMA.getDefault()
