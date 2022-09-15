import { object, ObjectSchema } from 'yup'

import {
    useGetAmbities,
    useGetAmbitiesLineageid,
    useGetValidAmbities,
    useGetValidAmbitiesLineageid,
    useGetVersionAmbitiesObjectuuid,
    usePatchAmbitiesLineageid,
    usePostAmbities,
} from '@/api/fetchers'
import { AmbitiesWrite } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryAmbities: SchemaMetaQueries = {
    usePost: usePostAmbities,
    useGet: useGetAmbities,
    useGetVersion: useGetVersionAmbitiesObjectuuid,
    useGetLineage: useGetAmbitiesLineageid,
    useGetValidLineage: useGetValidAmbitiesLineageid,
    usePatchLineage: usePatchAmbitiesLineageid,
    useGetValid: useGetValidAmbities,
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

export const SCHEMA: ObjectSchema<MutatedPolicySchema<AmbitiesWrite>> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(ambitiesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryAmbities>
export const EMPTY_WRITE_OBJECT: AmbitiesWrite = SCHEMA.getDefault()
