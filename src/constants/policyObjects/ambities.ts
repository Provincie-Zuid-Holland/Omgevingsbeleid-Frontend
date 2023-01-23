import { object, ObjectSchema } from 'yup'

import {
    useReadAmbities,
    useReadAmbitieLineage,
    useReadValidAmbities,
    useReadValidAmbitieLineage,
    useReadAmbitieVersion,
    useUpdateAmbitie,
    useCreateAmbitie,
} from '@/api/fetchers'
import { AmbitieUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryAmbities: SchemaMetaQueries = {
    usePost: useCreateAmbitie,
    useGet: useReadAmbities,
    useGetVersion: useReadAmbitieVersion,
    useGetLineage: useReadAmbitieLineage,
    useGetValidLineage: useReadValidAmbitieLineage,
    usePatchLineage: useUpdateAmbitie,
    useGetValid: useReadValidAmbities,
}

const ambitiesTitles = generateSchemaTitles({
    titleSingular: 'ambitie',
    titlePlural: 'ambities',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const ambitiesMeta: SchemaMeta<typeof queryAmbities> = {
    title: ambitiesTitles,
    slug: {
        overview: 'ambities',
    },
    query: queryAmbities,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<AmbitieUpdate>> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(ambitiesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryAmbities>
export const EMPTY_WRITE_OBJECT: AmbitieUpdate = SCHEMA.getDefault()
