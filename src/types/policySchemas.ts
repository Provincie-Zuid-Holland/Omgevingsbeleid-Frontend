import {
    usePostAmbities,
    usePostBelangen,
    usePostBeleidsdoelen,
    usePostBeleidskeuzes,
    usePostBeleidsmodules,
    usePostBeleidsprestaties,
    usePostBeleidsregels,
    usePostMaatregelen,
    usePostThemas,
    usePostVerordeningen,
    usePatchAmbitiesLineageid,
    usePatchBelangenLineageid,
    usePatchBeleidsdoelenLineageid,
    usePatchBeleidskeuzesLineageid,
    usePatchBeleidsmodulesLineageid,
    usePatchBeleidsprestatiesLineageid,
    usePatchBeleidsregelsLineageid,
    usePatchMaatregelenLineageid,
    usePatchThemasLineageid,
    usePatchVerordeningenLineageid,
    useGetValidAmbities,
    useGetValidBelangen,
    useGetValidBeleidsdoelen,
    useGetValidBeleidskeuzes,
    useGetValidBeleidsmodules,
    useGetValidBeleidsprestaties,
    useGetValidBeleidsregels,
    useGetValidMaatregelen,
    useGetValidThemas,
    useGetValidVerordeningen,
    useGetValidAmbitiesLineageid,
    useGetValidBelangenLineageid,
    useGetValidBeleidsdoelenLineageid,
    useGetValidBeleidskeuzesLineageid,
    useGetValidBeleidsmodulesLineageid,
    useGetValidBeleidsprestatiesLineageid,
    useGetValidBeleidsregelsLineageid,
    useGetValidMaatregelenLineageid,
    useGetValidThemasLineageid,
    useGetValidVerordeningenLineageid,
    useGetVersionAmbitiesObjectuuid,
    useGetVersionBelangenObjectuuid,
    useGetVersionBeleidsdoelenObjectuuid,
    useGetVersionBeleidskeuzesObjectuuid,
    useGetVersionBeleidsmodulesObjectuuid,
    useGetVersionBeleidsprestatiesObjectuuid,
    useGetVersionBeleidsregelsObjectuuid,
    useGetVersionMaatregelenObjectuuid,
    useGetVersionThemasObjectuuid,
    useGetVersionVerordeningenObjectuuid,
    useGetVersionWerkingsgebiedenObjectuuid,
    useGetAmbitiesLineageid,
    useGetBelangenLineageid,
    useGetBeleidsdoelenLineageid,
    useGetBeleidskeuzesLineageid,
    useGetBeleidsmodulesLineageid,
    useGetBeleidsprestatiesLineageid,
    useGetBeleidsregelsLineageid,
    useGetMaatregelenLineageid,
    useGetThemasLineageid,
    useGetVerordeningenLineageid,
    useGetAmbities,
    useGetBelangen,
    useGetBeleidsdoelen,
    useGetBeleidskeuzes,
    useGetBeleidsmodules,
    useGetBeleidsprestaties,
    useGetBeleidsregels,
    useGetMaatregelen,
    useGetThemas,
    useGetVerordeningen,
} from '@/api/fetchers'

export type SchemaMeta<T> = {
    title: {
        singular: string
        singularCapitalized: string
        plural: string
        pluralCapitalized: string
        prefixSingular: string
        prefixSingularCapitalized: string
        prefixPlural: string
        prefixPluralCapitalized: string
    }
    slug: {
        overview: string
    }
    query: T
}

type QueryUseGet =
    | typeof useGetAmbities
    | typeof useGetBelangen
    | typeof useGetBeleidsdoelen
    | typeof useGetBeleidskeuzes
    | typeof useGetBeleidsmodules
    | typeof useGetBeleidsprestaties
    | typeof useGetBeleidsregels
    | typeof useGetMaatregelen
    | typeof useGetThemas
    | typeof useGetVerordeningen

type QueryUsePost =
    | typeof usePostAmbities
    | typeof usePostBelangen
    | typeof usePostBeleidsdoelen
    | typeof usePostBeleidskeuzes
    | typeof usePostBeleidsmodules
    | typeof usePostBeleidsprestaties
    | typeof usePostBeleidsregels
    | typeof usePostMaatregelen
    | typeof usePostThemas
    | typeof usePostVerordeningen

type QueryUsePatchLineage =
    | typeof usePatchAmbitiesLineageid
    | typeof usePatchBelangenLineageid
    | typeof usePatchBeleidsdoelenLineageid
    | typeof usePatchBeleidskeuzesLineageid
    | typeof usePatchBeleidsmodulesLineageid
    | typeof usePatchBeleidsprestatiesLineageid
    | typeof usePatchBeleidsregelsLineageid
    | typeof usePatchMaatregelenLineageid
    | typeof usePatchThemasLineageid
    | typeof usePatchVerordeningenLineageid

type QueryUseGetValid =
    | typeof useGetValidAmbities
    | typeof useGetValidBelangen
    | typeof useGetValidBeleidsdoelen
    | typeof useGetValidBeleidskeuzes
    | typeof useGetValidBeleidsmodules
    | typeof useGetValidBeleidsprestaties
    | typeof useGetValidBeleidsregels
    | typeof useGetValidMaatregelen
    | typeof useGetValidThemas
    | typeof useGetValidVerordeningen

type QueryUseGetValidLineage =
    | typeof useGetValidAmbitiesLineageid
    | typeof useGetValidBelangenLineageid
    | typeof useGetValidBeleidsdoelenLineageid
    | typeof useGetValidBeleidskeuzesLineageid
    | typeof useGetValidBeleidsmodulesLineageid
    | typeof useGetValidBeleidsprestatiesLineageid
    | typeof useGetValidBeleidsregelsLineageid
    | typeof useGetValidMaatregelenLineageid
    | typeof useGetValidThemasLineageid
    | typeof useGetValidVerordeningenLineageid

type QueryUseGetLineage =
    | typeof useGetAmbitiesLineageid
    | typeof useGetBelangenLineageid
    | typeof useGetBeleidsdoelenLineageid
    | typeof useGetBeleidskeuzesLineageid
    | typeof useGetBeleidsmodulesLineageid
    | typeof useGetBeleidsprestatiesLineageid
    | typeof useGetBeleidsregelsLineageid
    | typeof useGetMaatregelenLineageid
    | typeof useGetThemasLineageid
    | typeof useGetVerordeningenLineageid

export type QueryUseGetVersion =
    | typeof useGetVersionAmbitiesObjectuuid
    | typeof useGetVersionBelangenObjectuuid
    | typeof useGetVersionBeleidsdoelenObjectuuid
    | typeof useGetVersionBeleidskeuzesObjectuuid
    | typeof useGetVersionBeleidsmodulesObjectuuid
    | typeof useGetVersionBeleidsprestatiesObjectuuid
    | typeof useGetVersionBeleidsregelsObjectuuid
    | typeof useGetVersionMaatregelenObjectuuid
    | typeof useGetVersionThemasObjectuuid
    | typeof useGetVersionVerordeningenObjectuuid
    | typeof useGetVersionWerkingsgebiedenObjectuuid

export type SchemaMetaQueries = {
    usePost: QueryUsePost
    usePatchLineage: QueryUsePatchLineage
    useGet: QueryUseGet
    useGetVersion: QueryUseGetVersion
    useGetValidLineage: QueryUseGetValidLineage
    useGetLineage: QueryUseGetLineage
    useGetValid: QueryUseGetValid
}
