import { object, ObjectSchema } from 'yup'

import {
    useGetThemas,
    useGetThemasLineageid,
    useGetValidThemas,
    useGetValidThemasLineageid,
    useGetVersionThemasObjectuuid,
    usePatchThemasLineageid,
    usePostThemas,
} from '@/api/fetchers'
import { ThemasWrite } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryThemas: SchemaMetaQueries = {
    usePost: usePostThemas,
    useGet: useGetThemas,
    useGetVersion: useGetVersionThemasObjectuuid,
    useGetLineage: useGetThemasLineageid,
    useGetValidLineage: useGetValidThemasLineageid,
    usePatchLineage: usePatchThemasLineageid,
    useGetValid: useGetValidThemas,
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

export const SCHEMA: ObjectSchema<MutatedPolicySchema<ThemasWrite>> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(themasMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryThemas>
export const EMPTY_WRITE_OBJECT: ThemasWrite = SCHEMA.getDefault()
