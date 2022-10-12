import { array, lazy, mixed, object, ObjectSchema, string } from 'yup'

import {
    useGetValidVerordeningen,
    useGetValidVerordeningenLineageid,
    useGetVersionVerordeningenObjectuuid,
    usePostThemas,
} from '@/api/fetchers'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import {
    VerordeningLineageWrite,
    VerordeningStructureChild,
} from '@/types/verordening'
import {
    useGetVerordeningenStructuren,
    usePatchVerordeningenStructureLineageid,
} from '@/utils/verordening'
import { generateSchemaTitles, schemaDefaults } from '@/utils/yupSchema'

const queryVerordeningen: SchemaMetaQueries = {
    usePost: usePostThemas,
    useGet: useGetVerordeningenStructuren as any,
    useGetVersion: useGetVersionVerordeningenObjectuuid,
    useGetLineage: useGetVerordeningenStructuren as any,
    useGetValidLineage: useGetValidVerordeningenLineageid,
    usePatchLineage: usePatchVerordeningenStructureLineageid as any,
    useGetValid: useGetValidVerordeningen,
}

const verordeningenTitles = generateSchemaTitles({
    titleSingular: 'verordening',
    titlePlural: 'verordeningen',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const verordeningenMeta: SchemaMeta<typeof queryVerordeningen> = {
    title: verordeningenTitles,
    slug: {
        overview: 'verordeningen',
    },
    query: queryVerordeningen,
}

// TS Ignore for the recursive Structuur Children
// @ts-ignore
export const SCHEMA: ObjectSchema<
    MutatedPolicySchema<VerordeningLineageWrite>
> = object({
    Titel: string()
        .required('Vul een titel in')
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .default(undefined)
        .nullable(),
    Status: mixed().oneOf(['Vigerend', 'Concept', 'Vervallen']).required(),
    Structuur: object<VerordeningStructureChild>({
        Children: array().of(lazy(() => object())),
        Gebied: string(),
        Inhoud: string(),
        Titel: string(),
        Type: string(),
        UUID: string(),
        Volgnummer: string(),
    }),
    Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
    Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
}).meta(verordeningenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryVerordeningen
>
export const EMPTY_WRITE_OBJECT: VerordeningLineageWrite = SCHEMA.getDefault()
