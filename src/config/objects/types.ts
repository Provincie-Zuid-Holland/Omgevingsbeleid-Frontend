import { Schema } from 'zod'

import {
    AmbitieFull,
    AmbitiePatch,
    BeleidsdoelFull,
    BeleidsdoelPatch,
    BeleidskeuzeFull,
    BeleidskeuzePatch,
    BeleidsregelPatch,
    DocumentFull,
    DocumentPatch,
    GebiedengroepFull,
    GebiedengroepPatch,
    GebiedFull,
    GebiedPatch,
    GebiedsprogrammaFull,
    GebiedsprogrammaPatch,
    MaatregelFull,
    MaatregelPatch,
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic,
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasicModel,
    NationaalBelangFull,
    ObjectStaticShort,
    ProgrammaAlgemeenFull,
    ProgrammaAlgemeenPatch,
    VisieAlgemeenFull,
    VisieAlgemeenPatch,
    WerkingsgebiedFull,
    WerkingsgebiedPatch,
    WettelijkeTaakFull,
} from '@/api/fetchers.schemas'

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import * as models from '.'
import { DynamicSection } from '../types'

export interface ModelQueryKeys {
    [key: string]: (...args: any[]) => readonly unknown[]
}

export interface DynamicObjectBase<Q extends ModelQueryKeys = ModelQueryKeys> {
    defaults: {
        singular: ModelType
        singularReadable: string
        singularCapitalize: string
        plural: string
        pluralReadable: string
        pluralCapitalize: string
        prefixSingular: string
        prefixPlural: string
        prefixNewObject: string
        description?: string
        slugOverview?: string
        slugOverviewPublic?: boolean
        demonstrative?: string
        demonstrativeSingular?: string
        atemporal?: boolean
        icon: any
        parentType?: ParentType
        hideBreadcrumbs?: boolean
        disabled?: boolean
        hideFromModuleFilter?: boolean
    }
    staticData?: (keyof ObjectStaticShort)[]
    queryKeys?: Q
    validationSchema?: Schema
    dynamicSections: DynamicSection[]
    allowedConnections?: {
        type: ModelType
        key: string
    }[]
    connectionsDescription?:
        | string
        | React.JSX.Element
        | ((object: React.JSX.Element) => string | React.JSX.Element)
    acknowledgedRelation?: ModelType
    hasRelatedObjects?: boolean
}

export type QueryHook<TArgs extends unknown[] = any[]> = <TData = any>(
    ...args: TArgs
) => UseQueryResult<TData> & {
    queryKey: readonly unknown[]
}

export type MutationHook<
    TData = any,
    TVariables = any,
    TArgs extends any[] = any[],
> = (...args: TArgs) => UseMutationResult<TData, any, TVariables>

export interface ModelFetchers {
    useGetValid?: QueryHook | null
    useGetValidLineage?: QueryHook | null
    useGetVersion?: QueryHook | null
    useGetLatestLineage?: QueryHook | null
    useGetRevision?: QueryHook | null
    useGetRelations?: QueryHook | null
    usePutRelations?: MutationHook | null
    useGetLatestLineageInModule?: QueryHook | null
    usePatchObjectInModule?: MutationHook | null
    usePatchObject?: MutationHook | null
    useDeleteObject?: MutationHook | null
    usePostStatic?: MutationHook | null
    useGetAcknowledgedRelations?: QueryHook | null
    usePostAcknowledgedRelations?: MutationHook | null
    usePatchAcknowledgedRelations?: MutationHook | null
    usePostObject?: MutationHook | null
    useGetActiveModules?: QueryHook | null
}

export type DynamicObject<
    F extends ModelFetchers = ModelFetchers,
    Q extends ModelQueryKeys = ModelQueryKeys,
> = DynamicObjectBase<Q> & {
    fetchers: F
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
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic

export type ModelReturnTypeBasicUnion =
    ModuleOverviewObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasicModel

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

export type Model = DynamicObject

export const parentTypes = [
    'Visie',
    'Programma',
    'Verordening',
    'Overig',
] as const
export type ParentType = (typeof parentTypes)[number]
