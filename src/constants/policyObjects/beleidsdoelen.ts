import { object, ObjectSchema } from 'yup'

import {
    useCreateBeleidsdoel,
    useReadBeleidsdoelLineage,
    useUpdateBeleidsdoel,
    useReadValidBeleidsdoelLineage,
    useReadBeleidsdoelen,
    useReadBeleidsdoelVersion,
    useReadValidBeleidsdoelen,
} from '@/api/fetchers'
import { BeleidsdoelUpdate } from '@/api/fetchers.schemas'
import { MutatedPolicySchema } from '@/types/dimensions'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidsdoelen: SchemaMetaQueries = {
    usePost: useCreateBeleidsdoel,
    useGet: useReadBeleidsdoelen,
    useGetVersion: useReadBeleidsdoelVersion,
    useGetLineage: useReadBeleidsdoelLineage,
    useGetValidLineage: useReadValidBeleidsdoelLineage,
    usePatchLineage: useUpdateBeleidsdoel,
    useGetValid: useReadValidBeleidsdoelen,
}

const beleidsdoelenTitles = generateSchemaTitles({
    titleSingular: 'beleidsdoel',
    titlePlural: 'beleidsdoelen',
    prefixSingular: 'het',
    prefixPlural: 'de',
})

const beleidsdoelenMeta: SchemaMeta<typeof queryBeleidsdoelen> = {
    title: beleidsdoelenTitles,
    slug: {
        overview: 'beleidsdoelen',
    },
    query: queryBeleidsdoelen,
}

export const SCHEMA: ObjectSchema<MutatedPolicySchema<BeleidsdoelUpdate>> =
    object({
        Titel: schemaDefaults.Titel,
        Omschrijving: schemaDefaults.optionalString,
        Weblink: schemaDefaults.optionalString,
        Begin_Geldigheid: schemaDefaults.Begin_Geldigheid.required,
        Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
        Ambities: schemaDefaults.listReference,
        Ref_Beleidskeuzes: schemaDefaults.listReference,
    }).meta(beleidsdoelenMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidsdoelen
>

export const EMPTY_WRITE_OBJECT: BeleidsdoelUpdate = SCHEMA.getDefault()
