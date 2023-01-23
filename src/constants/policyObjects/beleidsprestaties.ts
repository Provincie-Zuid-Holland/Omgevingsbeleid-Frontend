import { object, ObjectSchema } from 'yup'

import {
    useCreateBeleidsmodule,
    useReadBeleidsmoduleLineage,
    useUpdateBeleidsmodule,
    useReadValidBeleidsmoduleLineage,
    useReadBeleidsmodules,
    useReadBeleidsmoduleVersion,
    useReadValidBeleidsmodules,
} from '@/api/fetchers'
import { BeleidsprestatieUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsprestaties: SchemaMetaQueries = {
    usePost: useCreateBeleidsmodule,
    useGet: useReadBeleidsmodules,
    useGetVersion: useReadBeleidsmoduleVersion,
    useGetLineage: useReadBeleidsmoduleLineage,
    useGetValidLineage: useReadValidBeleidsmoduleLineage,
    usePatchLineage: useUpdateBeleidsmodule,
    useGetValid: useReadValidBeleidsmodules,
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

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsprestatieUpdate>> =
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

export const EMPTY_WRITE_OBJECT: BeleidsprestatieUpdate = SCHEMA.getDefault()
