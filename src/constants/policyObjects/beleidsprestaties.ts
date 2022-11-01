import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidsprestaties,
    useGetBeleidsprestatiesLineageId,
    usePatchBeleidsprestatiesLineageId,
    useGetValidBeleidsprestatiesLineageId,
    useGetBeleidsprestaties,
    useGetVersionBeleidsprestatiesObjectUuid,
    useGetValidBeleidsprestaties,
} from '@/api/fetchers'
import { BeleidsprestatiesWrite } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsprestaties: SchemaMetaQueries = {
    usePost: usePostBeleidsprestaties,
    useGet: useGetBeleidsprestaties,
    useGetVersion: useGetVersionBeleidsprestatiesObjectUuid,
    useGetLineage: useGetBeleidsprestatiesLineageId,
    useGetValidLineage: useGetValidBeleidsprestatiesLineageId,
    usePatchLineage: usePatchBeleidsprestatiesLineageId,
    useGetValid: useGetValidBeleidsprestaties,
}

const beleidsprestatiesTitles = generateSchemaTitles({
    titleSingular: 'beleidsprestatie',
    titlePlural: 'beleidsprestaties',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const beleidsprestatiesMeta: SchemaMeta<typeof queryBeleidsprestaties> = {
    title: beleidsprestatiesTitles,
    slug: {
        overview: 'beleidsprestaties',
    },
    query: queryBeleidsprestaties,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsprestatiesWrite>> =
    object({
        Titel: schemaDefaults.Titel,
        Omschrijving: schemaDefaults.optionalString,
        Weblink: schemaDefaults.optionalString,
        Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
        Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
    }).meta(beleidsprestatiesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsprestaties
>

export const EMPTY_WRITE_OBJECT: BeleidsprestatiesWrite = SCHEMA.getDefault()
