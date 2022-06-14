import { object, ObjectSchema } from 'yup'

import {
    usePostAmbities,
    useGetAmbitiesLineageid,
    usePatchAmbitiesLineageid,
    useGetValidAmbitiesLineageid,
    useGetAmbities,
    useGetVersionAmbitiesObjectuuid,
    useGetValidAmbities,
} from '@/api/fetchers'
import { AmbitiesWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/schema'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

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
    description:
        'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.',
    slug: {
        overview: 'ambities',
        new: 'nieuwe-ambitie',
    },
    query: queryAmbities,
}

// TODO: @Jordy add null types
export const SCHEMA: ObjectSchema<AmbitiesWrite> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(ambitiesMeta)
export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryAmbities>
export const EMPTY_WRITE_OBJECT: AmbitiesWrite = SCHEMA.getDefault()
