import { object, ObjectSchema } from 'yup'

import {
    useCreateGebiedsprogramma,
    useReadGebiedsprogrammaLineage,
    useUpdateGebiedsprogramma,
    useReadValidGebiedsprogrammaLineage,
    useReadGebiedsprogrammas,
    useReadGebiedsprogrammaVersion,
    useReadValidGebiedsprogrammas,
} from '@/api/fetchers'
import { GebiedsprogrammaUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryGebiedsprogrammas: SchemaMetaQueries = {
    usePost: useCreateGebiedsprogramma,
    useGet: useReadGebiedsprogrammas,
    useGetVersion: useReadGebiedsprogrammaVersion,
    useGetLineage: useReadGebiedsprogrammaLineage,
    useGetValidLineage: useReadValidGebiedsprogrammaLineage,
    usePatchLineage: useUpdateGebiedsprogramma,
    useGetValid: useReadValidGebiedsprogrammas,
}

const ambitiesTitles = generateSchemaTitles({
    titleSingular: 'gebiedsprogramma',
    titlePlural: "gebiedsprogramma's",
    prefixSingular: 'het',
    prefixPlural: 'de',
})

const gebiedsprogrammasMeta: SchemaMeta<typeof queryGebiedsprogrammas> = {
    title: ambitiesTitles,
    slug: {
        overview: 'gebiedsprogrammas',
    },
    query: queryGebiedsprogrammas,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<GebiedsprogrammaUpdate>> =
    object({
        Titel: schemaDefaults.Titel,
        Afbeelding: schemaDefaults.requiredString(
            'Een afbeelding is verplicht'
        ),
        Maatregelen: schemaDefaults.listReference,
        Omschrijving: schemaDefaults.requiredString(
            'Een omschrijving is verplicht'
        ),
        Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
        Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
        Status: schemaDefaults.Status,
        Besluitnummer: schemaDefaults.optionalString,
        Opdrachtgever_UUID: schemaDefaults.optionalString,
        Portefeuillehouder_1_UUID: schemaDefaults.optionalString,
        Portefeuillehouder_2_UUID: schemaDefaults.optionalString,
        Eigenaar_1_UUID: schemaDefaults.optionalString,
        Eigenaar_2_UUID: schemaDefaults.optionalString,
        Weblink: schemaDefaults.optionalString,
    }).meta(gebiedsprogrammasMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryGebiedsprogrammas
>
export const EMPTY_WRITE_OBJECT: GebiedsprogrammaUpdate = SCHEMA.getDefault()
