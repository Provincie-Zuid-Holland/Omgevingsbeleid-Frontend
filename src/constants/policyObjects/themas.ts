import { object, ObjectSchema } from 'yup'

import {
    useCreateThema,
    useReadThemaLineage,
    useUpdateThema,
    useReadValidThemaLineage,
    useReadThemas,
    useReadThemaVersion,
    useReadValidThemas,
} from '@/api/fetchers'
import { ThemaUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryThemas: SchemaMetaQueries = {
    usePost: useCreateThema,
    useGet: useReadThemas,
    useGetVersion: useReadThemaVersion,
    useGetLineage: useReadThemaLineage,
    useGetValidLineage: useReadValidThemaLineage,
    usePatchLineage: useUpdateThema,
    useGetValid: useReadValidThemas,
}

const themasTitles = generateSchemaTitles({
    titleSingular: 'thema',
    titlePlural: 'themas',
    prefixSingular: 'het',
    prefixPlural: 'de',
})

const themasMeta: SchemaMeta<typeof queryThemas> = {
    title: themasTitles,
    slug: {
        overview: 'themas',
    },
    query: queryThemas,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<ThemaUpdate>> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(themasMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryThemas>
export const EMPTY_WRITE_OBJECT: ThemaUpdate = SCHEMA.getDefault()
