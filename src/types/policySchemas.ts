import {
    useCreateAmbitie,
    useCreateBelang,
    useCreateBeleidsdoel,
    useCreateBeleidskeuze,
    useCreateBeleidsmodule,
    useCreateBeleidsprestatie,
    useCreateBeleidsregel,
    useCreateMaatregel,
    useCreateThema,
    useCreateVerordening,
    useUpdateAmbitie,
    useUpdateBelang,
    useUpdateBeleidsdoel,
    useUpdateBeleidskeuze,
    useUpdateBeleidsmodule,
    useUpdateBeleidsprestatie,
    useUpdateBeleidsregel,
    useUpdateMaatregel,
    useUpdateThema,
    useUpdateVerordening,
    useReadValidAmbities,
    useReadValidBelangen,
    useReadValidBeleidsdoelen,
    useReadValidBeleidskeuzes,
    useReadValidBeleidsmodules,
    useReadValidBeleidsprestaties,
    useReadValidBeleidsregels,
    useReadValidMaatregelen,
    useReadValidThemas,
    useReadValidVerordening,
    useReadValidAmbitieLineage,
    useReadValidBelangLineage,
    useReadValidBeleidsdoelLineage,
    useReadValidBeleidskeuzeLineage,
    useReadValidBeleidsmoduleLineage,
    useReadValidBeleidsprestatieLineage,
    useReadValidBeleidsregelLineage,
    useReadValidMaatregelLineage,
    useReadValidThemaLineage,
    useReadValidVerordeningLineage,
    useReadAmbitieVersion,
    useReadBelangVersion,
    useReadBeleidsdoelVersion,
    useReadBeleidskeuzeVersion,
    useReadBeleidsmoduleVersion,
    useReadBeleidsprestatieVersion,
    useReadBeleidsregelVersion,
    useReadMaatregelVersion,
    useReadThemaVersion,
    useReadVerordeningVersion,
    useReadAmbitieLineage,
    useReadBelangLineage,
    useReadBeleidsdoelLineage,
    useReadBeleidskeuzeLineage,
    useReadBeleidsmoduleLineage,
    useReadBeleidsprestatieLineage,
    useReadBeleidsregelLineage,
    useReadMaatregelLineage,
    useReadThemaLineage,
    useReadVerordeningLineage,
    useReadAmbities,
    useReadBelangen,
    useReadBeleidsdoelen,
    useReadBeleidskeuzes,
    useReadBeleidsmodules,
    useReadBeleidsprestaties,
    useReadBeleidsregels,
    useReadMaatregelen,
    useReadThemas,
    useReadVerordening,
    useReadGebiedsprogrammas,
    useCreateGebiedsprogramma,
    useUpdateGebiedsprogramma,
    useReadValidGebiedsprogrammas,
    useReadValidGebiedsprogrammaLineage,
    useReadGebiedsprogrammaLineage,
    useReadGebiedsprogrammaVersion,
    useReadVerordeningstructuren,
    useCreateVerordeningstructuur,
    useReadVerordeningstructuurLineage,
    useUpdateVerordeningstructuur,
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
    | typeof useReadAmbities
    | typeof useReadBelangen
    | typeof useReadBeleidsdoelen
    | typeof useReadBeleidskeuzes
    | typeof useReadBeleidsmodules
    | typeof useReadBeleidsprestaties
    | typeof useReadBeleidsregels
    | typeof useReadMaatregelen
    | typeof useReadThemas
    | typeof useReadVerordening
    | typeof useReadVerordeningstructuren
    | typeof useReadGebiedsprogrammas

type QueryUsePost =
    | typeof useCreateAmbitie
    | typeof useCreateBelang
    | typeof useCreateBeleidsdoel
    | typeof useCreateBeleidskeuze
    | typeof useCreateBeleidsmodule
    | typeof useCreateBeleidsprestatie
    | typeof useCreateBeleidsregel
    | typeof useCreateMaatregel
    | typeof useCreateThema
    | typeof useCreateVerordening
    | typeof useCreateVerordeningstructuur
    | typeof useCreateGebiedsprogramma

type QueryUsePatchLineage =
    | typeof useUpdateAmbitie
    | typeof useUpdateBelang
    | typeof useUpdateBeleidsdoel
    | typeof useUpdateBeleidskeuze
    | typeof useUpdateBeleidsmodule
    | typeof useUpdateBeleidsprestatie
    | typeof useUpdateBeleidsregel
    | typeof useUpdateMaatregel
    | typeof useUpdateThema
    | typeof useUpdateVerordening
    | typeof useUpdateVerordeningstructuur
    | typeof useUpdateGebiedsprogramma

type QueryUseGetValid =
    | typeof useReadValidAmbities
    | typeof useReadValidBelangen
    | typeof useReadValidBeleidsdoelen
    | typeof useReadValidBeleidskeuzes
    | typeof useReadValidBeleidsmodules
    | typeof useReadValidBeleidsprestaties
    | typeof useReadValidBeleidsregels
    | typeof useReadValidMaatregelen
    | typeof useReadValidThemas
    | typeof useReadValidVerordening
    | typeof useReadValidGebiedsprogrammas

type QueryUseGetValidLineage =
    | typeof useReadValidAmbitieLineage
    | typeof useReadValidBelangLineage
    | typeof useReadValidBeleidsdoelLineage
    | typeof useReadValidBeleidskeuzeLineage
    | typeof useReadValidBeleidsmoduleLineage
    | typeof useReadValidBeleidsprestatieLineage
    | typeof useReadValidBeleidsregelLineage
    | typeof useReadValidMaatregelLineage
    | typeof useReadValidThemaLineage
    | typeof useReadValidVerordeningLineage
    | typeof useReadValidGebiedsprogrammaLineage

type QueryUseGetLineage =
    | typeof useReadAmbitieLineage
    | typeof useReadBelangLineage
    | typeof useReadBeleidsdoelLineage
    | typeof useReadBeleidskeuzeLineage
    | typeof useReadBeleidsmoduleLineage
    | typeof useReadBeleidsprestatieLineage
    | typeof useReadBeleidsregelLineage
    | typeof useReadMaatregelLineage
    | typeof useReadThemaLineage
    | typeof useReadVerordeningLineage
    | typeof useReadVerordeningstructuurLineage
    | typeof useReadGebiedsprogrammaLineage

export type QueryUseGetVersion =
    | typeof useReadAmbitieVersion
    | typeof useReadBelangVersion
    | typeof useReadBeleidsdoelVersion
    | typeof useReadBeleidskeuzeVersion
    | typeof useReadBeleidsmoduleVersion
    | typeof useReadBeleidsprestatieVersion
    | typeof useReadBeleidsregelVersion
    | typeof useReadMaatregelVersion
    | typeof useReadThemaVersion
    | typeof useReadVerordeningVersion
    | typeof useReadGebiedsprogrammaVersion

export type SchemaMetaQueries = {
    usePost: QueryUsePost
    usePatchLineage: QueryUsePatchLineage
    useGet: QueryUseGet
    useGetVersion: QueryUseGetVersion
    useGetValidLineage: QueryUseGetValidLineage
    useGetLineage: QueryUseGetLineage
    useGetValid: QueryUseGetValid
}
