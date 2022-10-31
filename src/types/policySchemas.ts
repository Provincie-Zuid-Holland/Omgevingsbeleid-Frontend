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
    usePatchAmbitiesLineageId,
    usePatchBelangenLineageId,
    usePatchBeleidsdoelenLineageId,
    usePatchBeleidskeuzesLineageId,
    usePatchBeleidsmodulesLineageId,
    usePatchBeleidsprestatiesLineageId,
    usePatchBeleidsregelsLineageId,
    usePatchMaatregelenLineageId,
    usePatchThemasLineageId,
    usePatchVerordeningenLineageId,
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
    useGetValidAmbitiesLineageId,
    useGetValidBelangenLineageId,
    useGetValidBeleidsdoelenLineageId,
    useGetValidBeleidskeuzesLineageId,
    useGetValidBeleidsmodulesLineageId,
    useGetValidBeleidsprestatiesLineageId,
    useGetValidBeleidsregelsLineageId,
    useGetValidMaatregelenLineageId,
    useGetValidThemasLineageId,
    useGetValidVerordeningenLineageId,
    useGetVersionAmbitiesObjectUuid,
    useGetVersionBelangenObjectUuid,
    useGetVersionBeleidsdoelenObjectUuid,
    useGetVersionBeleidskeuzesObjectUuid,
    useGetVersionBeleidsmodulesObjectUuid,
    useGetVersionBeleidsprestatiesObjectUuid,
    useGetVersionBeleidsregelsObjectUuid,
    useGetVersionMaatregelenObjectUuid,
    useGetVersionThemasObjectUuid,
    useGetVersionVerordeningenObjectUuid,
    useGetVersionWerkingsgebiedenObjectUuid,
    useGetAmbitiesLineageId,
    useGetBelangenLineageId,
    useGetBeleidsdoelenLineageId,
    useGetBeleidskeuzesLineageId,
    useGetBeleidsmodulesLineageId,
    useGetBeleidsprestatiesLineageId,
    useGetBeleidsregelsLineageId,
    useGetMaatregelenLineageId,
    useGetThemasLineageId,
    useGetVerordeningenLineageId,
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
import {
    PolicyTitlesPlural,
    PolicyTitlesSingular,
} from '@/constants/policyObjects'

export type SchemaMeta<T> = {
    title: {
        singular: PolicyTitlesSingular
        singularCapitalized: Capitalize<PolicyTitlesSingular>
        plural: PolicyTitlesPlural
        pluralCapitalized: Capitalize<PolicyTitlesPlural>
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
    | typeof usePatchAmbitiesLineageId
    | typeof usePatchBelangenLineageId
    | typeof usePatchBeleidsdoelenLineageId
    | typeof usePatchBeleidskeuzesLineageId
    | typeof usePatchBeleidsmodulesLineageId
    | typeof usePatchBeleidsprestatiesLineageId
    | typeof usePatchBeleidsregelsLineageId
    | typeof usePatchMaatregelenLineageId
    | typeof usePatchThemasLineageId
    | typeof usePatchVerordeningenLineageId

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
    | typeof useGetValidAmbitiesLineageId
    | typeof useGetValidBelangenLineageId
    | typeof useGetValidBeleidsdoelenLineageId
    | typeof useGetValidBeleidskeuzesLineageId
    | typeof useGetValidBeleidsmodulesLineageId
    | typeof useGetValidBeleidsprestatiesLineageId
    | typeof useGetValidBeleidsregelsLineageId
    | typeof useGetValidMaatregelenLineageId
    | typeof useGetValidThemasLineageId
    | typeof useGetValidVerordeningenLineageId

type QueryUseGetLineage =
    | typeof useGetAmbitiesLineageId
    | typeof useGetBelangenLineageId
    | typeof useGetBeleidsdoelenLineageId
    | typeof useGetBeleidskeuzesLineageId
    | typeof useGetBeleidsmodulesLineageId
    | typeof useGetBeleidsprestatiesLineageId
    | typeof useGetBeleidsregelsLineageId
    | typeof useGetMaatregelenLineageId
    | typeof useGetThemasLineageId
    | typeof useGetVerordeningenLineageId

export type QueryUseGetVersion =
    | typeof useGetVersionAmbitiesObjectUuid
    | typeof useGetVersionBelangenObjectUuid
    | typeof useGetVersionBeleidsdoelenObjectUuid
    | typeof useGetVersionBeleidskeuzesObjectUuid
    | typeof useGetVersionBeleidsmodulesObjectUuid
    | typeof useGetVersionBeleidsprestatiesObjectUuid
    | typeof useGetVersionBeleidsregelsObjectUuid
    | typeof useGetVersionMaatregelenObjectUuid
    | typeof useGetVersionThemasObjectUuid
    | typeof useGetVersionVerordeningenObjectUuid
    | typeof useGetVersionWerkingsgebiedenObjectUuid

export type SchemaMetaQueries = {
    usePost: QueryUsePost
    usePatchLineage: QueryUsePatchLineage
    useGet: QueryUseGet
    useGetVersion: QueryUseGetVersion
    useGetValidLineage: QueryUseGetValidLineage
    useGetLineage: QueryUseGetLineage
    useGetValid: QueryUseGetValid
}
