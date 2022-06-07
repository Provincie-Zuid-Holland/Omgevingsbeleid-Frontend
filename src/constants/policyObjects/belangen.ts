import { object, ObjectSchema } from 'yup'

import {
    usePostBelangen,
    useGetBelangenLineageid,
    usePatchBelangenLineageid,
    useGetValidBelangenLineageid,
    useGetBelangen,
    useGetVersionBelangenObjectuuid,
    useGetValidBelangen,
} from '@/api/fetchers'
import { BelangenWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/schema'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBelangen: SchemaMetaQueries = {
    usePost: usePostBelangen,
    useGet: useGetBelangen,
    useGetVersion: useGetVersionBelangenObjectuuid,
    useGetLineage: useGetBelangenLineageid,
    useGetValidLineage: useGetValidBelangenLineageid,
    usePatchLineage: usePatchBelangenLineageid,
    useGetValid: useGetValidBelangen,
}

const belangenTitles = generateSchemaTitles({
    titleSingular: 'belang',
    titlePlural: 'belangen',
    prefixSingular: 'het',
    prefixPlural: 'de',
})

const belangenMeta: SchemaMeta<typeof queryBelangen> = {
    title: belangenTitles,
    description: null,
    slug: {
        overview: 'belangen',
        new: 'nieuw-belang',
    },
    query: queryBelangen,
}

// TODO: @Jordy add null type to eind & begin dates
export const SCHEMA: ObjectSchema<BelangenWrite> = object({
    Titel: schemaDefaults.Titel,
    Omschrijving: schemaDefaults.optionalString,
    Type: schemaDefaults.optionalString,
    Weblink: schemaDefaults.optionalString,
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(belangenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryBelangen>

export const EMPTY_WRITE_OBJECT: BelangenWrite = SCHEMA.getDefault()
