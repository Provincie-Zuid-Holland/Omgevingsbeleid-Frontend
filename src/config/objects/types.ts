import { Schema } from 'zod'

import {
    AmbitieFull,
    AmbitiePatch,
    AmbitieStaticPostStatics,
    BeleidsdoelFull,
    BeleidsdoelPatch,
    BeleidsdoelStaticPostStatics,
    BeleidskeuzeFull,
    BeleidskeuzePatch,
    BeleidskeuzeStaticPostStatics,
    BeleidsregelPatch,
    BeleidsregelStaticPostStatics,
    DocumentFull,
    DocumentPatch,
    DocumentStaticPostStatics,
    GebiedengroepFull,
    GebiedengroepPatch,
    GebiedFull,
    GebiedPatch,
    GebiedsprogrammaFull,
    GebiedsprogrammaPatch,
    GebiedsprogrammaStaticPostStatics,
    MaatregelFull,
    MaatregelPatch,
    MaatregelStaticPostStatics,
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic,
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasicModel,
    NationaalBelangFull,
    ProgrammaAlgemeenFull,
    ProgrammaAlgemeenPatch,
    ProgrammaAlgemeenStaticPostStatics,
    VisieAlgemeenFull,
    VisieAlgemeenPatch,
    VisieAlgemeenStaticPostStatics,
    WerkingsgebiedFull,
    WerkingsgebiedPatch,
    WerkingsgebiedStaticPostStatics,
    WettelijkeTaakFull,
} from '@/api/fetchers.schemas'

import { DynamicSection } from '../types'

import * as models from '.'

export interface DynamicObject<
    Fetchers = {
        [key: string]: any
    },
    FieldType = any,
    StaticData = any,
    QueryKeys = {
        [key: string]: any
    },
> {
    /** Default information of object */
    defaults: {
        /** Singular of object type */
        singular: ModelType
        /** Readable singular of object type */
        singularReadable: string
        /** Singular of object type (capitalized) */
        singularCapitalize: string
        /** Plural of object type */
        plural: string
        /** Readable plural of object type */
        pluralReadable: string
        /** Plural of object type (capitalized) */
        pluralCapitalize: string
        /** Prefix value of singular */
        prefixSingular: string
        /** Prefix value of plural */
        prefixPlural: string
        /** Prefix when creating new object */
        prefixNewObject: string
        /** Description of object */
        description?: string
        /** Slug overview */
        slugOverview?: string
        /** If slug overview page is publicly accessible */
        slugOverviewPublic?: boolean
        /** Demonstrative pronoun of object type */
        demonstrative?: string
        /** If singular is different in combination with demonstrative */
        demonstrativeSingular?: string
        /** Atemporal object */
        atemporal?: boolean
        /** Icon of object */
        icon: any
        /** Parent of object */
        parentType?: ParentType
        /** Hide breadcrumbs */
        hideBreadcrumbs?: boolean
        /** If is disabled in UI */
        disabled?: boolean
    }
    /** Array containing static data fields of object */
    staticData?: StaticData
    /** Fetchers for fetching object data */
    fetchers: Fetchers
    /** Query keys for requests */
    queryKeys?: QueryKeys
    /** Validation schema of form */
    validationSchema?: Schema
    /** Dynamic section containing form fields */
    dynamicSections: DynamicSection<FieldType>[]
    /** Allowed connection types which object can get a connection with */
    allowedConnections?: {
        /** Type of connection */
        type: ModelType
        /** Key of connection, this corresponds with the API field */
        key: keyof ModelReturnType
    }[]
    /** Description which is shown in the connections section on a detail page */
    connectionsDescription?: string | JSX.Element
    /** Acknowledged relation type */
    acknowledgedRelation?: ModelType
    /** Has related objects */
    hasRelatedObjects?: boolean
}

export type ModelType = keyof typeof models

export type ModelReturnType = BeleidsdoelFull &
    AmbitieFull &
    BeleidskeuzeFull &
    MaatregelFull &
    GebiedFull &
    GebiedengroepFull &
    GebiedsprogrammaFull &
    NationaalBelangFull &
    WettelijkeTaakFull &
    VisieAlgemeenFull &
    WerkingsgebiedFull &
    ProgrammaAlgemeenFull &
    DocumentFull

export type ModelReturnTypeBasic =
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic

export type ModelReturnTypeBasicUnion =
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasicModel

export type ModelPatchType = BeleidsdoelPatch &
    AmbitiePatch &
    BeleidskeuzePatch &
    MaatregelPatch &
    GebiedPatch &
    GebiedengroepPatch &
    GebiedsprogrammaPatch &
    BeleidsregelPatch &
    VisieAlgemeenPatch &
    WerkingsgebiedPatch &
    ProgrammaAlgemeenPatch &
    DocumentPatch

export type ModelPatchStaticType = BeleidsdoelStaticPostStatics &
    AmbitieStaticPostStatics &
    BeleidskeuzeStaticPostStatics &
    MaatregelStaticPostStatics &
    GebiedsprogrammaStaticPostStatics &
    BeleidsregelStaticPostStatics &
    VisieAlgemeenStaticPostStatics &
    WerkingsgebiedStaticPostStatics &
    ProgrammaAlgemeenStaticPostStatics &
    DocumentStaticPostStatics

export type Model = (typeof models)[ModelType]

export const parentTypes = [
    'Visie',
    'Programma',
    'Verordening',
    'Overig',
] as const
export type ParentType = (typeof parentTypes)[number]
