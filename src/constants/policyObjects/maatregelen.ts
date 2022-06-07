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
import { MaatregelenWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/schema'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryMaatregelen: SchemaMetaQueries = {
    usePost: usePostMaatregelen,
    useGet: useGetMaatregelen,
    useGetVersion: useGetVersionMaatregelenObjectuuid,
    useGetLineage: useGetMaatregelenLineageid,
    useGetValidLineage: useGetValidMaatregelenLineageid,
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
    description:
        'De maatregelen geven aan wat de provincie gaat doen om de keuzes uit te voeren. De maatregelen zijn een uitwerking van de beleidskeuzes en komen voort uit het Omgevingsprogramma.',
    slug: {
        overview: 'maatregelen',
        new: 'nieuw-maatregel',
    },
    query: queryMaatregelen,
}

// TODO: @Jordy add null type to eind & begin dates
export const SCHEMA: ObjectSchema<MaatregelenWrite> = object({
    Titel: schemaDefaults.Titel,
    Aanpassing_Op: schemaDefaults.optionalString,
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
