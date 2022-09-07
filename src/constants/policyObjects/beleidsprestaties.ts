import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidsprestaties,
    useGetBeleidsprestatiesLineageid,
    usePatchBeleidsprestatiesLineageid,
    useGetValidBeleidsprestatiesLineageid,
    useGetBeleidsprestaties,
    useGetVersionBeleidsprestatiesObjectuuid,
    useGetValidBeleidsprestaties,
} from '@/api/fetchers'
import { BeleidsprestatiesWrite } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsprestaties: SchemaMetaQueries = {
    usePost: usePostBeleidsprestaties,
    useGet: useGetBeleidsprestaties,
    useGetVersion: useGetVersionBeleidsprestatiesObjectuuid,
    useGetLineage: useGetBeleidsprestatiesLineageid,
    useGetValidLineage: useGetValidBeleidsprestatiesLineageid,
    usePatchLineage: usePatchBeleidsprestatiesLineageid,
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
    description:
        'De beleidsprestaties geven aan wat de provincie gaat doen om haar doelen te behalen. De beleidsprestaties zijn een uitwerking van de beleidsdoelen en komen voort uit de begroting.',
    slug: {
        overview: 'beleidsprestaties',
        new: 'nieuw-beleidsprestatie',
    },
    query: queryBeleidsprestaties,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsprestatiesWrite>> =
    object({
        Titel: schemaDefaults.Titel,
        Omschrijving: schemaDefaults.optionalString,
        Weblink: schemaDefaults.optionalString,
        Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.notRequired,
        Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
    }).meta(beleidsprestatiesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsprestaties
>

export const EMPTY_WRITE_OBJECT: BeleidsprestatiesWrite = SCHEMA.getDefault()
