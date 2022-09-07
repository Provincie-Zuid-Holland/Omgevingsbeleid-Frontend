import { object, ObjectSchema } from 'yup'

import {
    usePostBeleidskeuzes,
    useGetBeleidskeuzesLineageid,
    usePatchBeleidskeuzesLineageid,
    useGetValidBeleidskeuzesLineageid,
    useGetBeleidskeuzes,
    useGetVersionBeleidskeuzesObjectuuid,
    useGetValidBeleidskeuzes,
} from '@/api/fetchers'
import { BeleidskeuzesRead, BeleidskeuzesWrite } from '@/api/fetchers.schemas'
import { SchemaMeta, SchemaMetaQueries } from '@/types/policySchemas'
import { schemaDefaults, generateSchemaTitles } from '@/utils/yupSchema'

const queryBeleidskeuzes: SchemaMetaQueries = {
    usePost: usePostBeleidskeuzes,
    useGet: useGetBeleidskeuzes,
    useGetVersion: useGetVersionBeleidskeuzesObjectuuid,
    useGetLineage: useGetBeleidskeuzesLineageid,
    useGetValidLineage: useGetValidBeleidskeuzesLineageid,
    usePatchLineage: usePatchBeleidskeuzesLineageid,
    useGetValid: useGetValidBeleidskeuzes,
}

const beleidskeuzesTitles = generateSchemaTitles({
    titleSingular: 'beleidskeuze',
    titlePlural: 'beleidskeuzes',
    prefixSingular: 'de',
    prefixPlural: 'de',
})

const beleidskeuzesMeta: SchemaMeta<typeof queryBeleidskeuzes> = {
    title: beleidskeuzesTitles,
    description:
        'De beleidskeuzes geven aan wat de provincie wil bereiken. De beleidskeuzes zijn een uitwerking van de ambities en komen voort uit de begroting.',
    slug: {
        overview: 'beleidskeuzes',
        new: 'nieuw-beleidskeuze',
    },
    query: queryBeleidskeuzes,
}

// TODO: @Jordy add null type to eind & begin dates
export const SCHEMA: ObjectSchema<BeleidskeuzesWrite | BeleidskeuzesRead> =
    object({
        Titel: schemaDefaults.Titel,
        Aanleiding: schemaDefaults.optionalString,
        Aanpassing_Op: schemaDefaults.optionalString,
        Afweging: schemaDefaults.optionalString,
        Besluitnummer: schemaDefaults.optionalString,
        Eigenaar_1: schemaDefaults.optionalString,
        Eigenaar_2: schemaDefaults.optionalString,
        Modified_By: schemaDefaults.optionalString,
        Omschrijving_Keuze: schemaDefaults.optionalString,
        Omschrijving_Werking: schemaDefaults.optionalString,
        Opdrachtgever: schemaDefaults.optionalString,
        Portefeuillehouder_1: schemaDefaults.optionalString,
        Portefeuillehouder_2: schemaDefaults.optionalString,
        Provinciaal_Belang: schemaDefaults.optionalString,
        Tags: schemaDefaults.optionalString,
        Weblink: schemaDefaults.optionalString,
        Status: schemaDefaults.Status,
        Begin_Geldigheid:
            schemaDefaults.Begin_Geldigheid.requiredBasedOnStatusses([
                'Ontwerp GS Concept',
            ]),
        Eind_Geldigheid: schemaDefaults.Eind_Geldigheid,
        Ambities: schemaDefaults.listReference,
        Belangen: schemaDefaults.listReference,
        Beleidsdoelen: schemaDefaults.listReference,
        Beleidsprestaties: schemaDefaults.listReference,
        Beleidsregels: schemaDefaults.listReference,
        Maatregelen: schemaDefaults.listReference,
        Themas: schemaDefaults.listReference,
        Verordeningen: schemaDefaults.listReference,
        Werkingsgebieden: schemaDefaults.listReference,
    }).meta(beleidskeuzesMeta)

export const META = SCHEMA.describe().meta as SchemaMeta<
    typeof queryBeleidskeuzes
>

export const EMPTY_WRITE_OBJECT: BeleidskeuzesWrite = SCHEMA.getDefault()
