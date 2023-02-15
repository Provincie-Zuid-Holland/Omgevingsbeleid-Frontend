import {
    useCreateAmbitie,
    useCreateBelang,
    useCreateBeleidskeuze,
    useCreateBeleidsregel,
    useCreateBeleidsprestatie,
    useCreateBeleidsmodule,
    useCreateBeleidsdoel,
    useCreateMaatregel,
    useCreateThema,
    useCreateVerordening,
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
    useUpdateAmbitie,
    useUpdateBelang,
    useUpdateBeleidskeuze,
    useUpdateBeleidsregel,
    useUpdateBeleidsprestatie,
    useUpdateBeleidsmodule,
    useUpdateBeleidsdoel,
    useUpdateMaatregel,
    useUpdateThema,
    useUpdateVerordening,
    useUpdateGebiedsprogramma,
    useReadAmbities,
    useReadBelangen,
    useReadBeleidskeuzes,
    useReadBeleidsregels,
    useReadBeleidsprestaties,
    useReadBeleidsmodules,
    useReadBeleidsdoelen,
    useReadMaatregelen,
    useReadThemas,
    useReadGebiedsprogrammas,
    useReadVerordeningstructuren,
} from '@/api/fetchers'
import { filteredDimensieConstants } from '@/constants/dimensies'

export const getFetcherForType = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useReadAmbities
        case 'Belang':
            return useReadBelangen
        case 'Beleidskeuze':
            return useReadBeleidskeuzes
        case 'Beleidsregel':
            return useReadBeleidsregels
        case 'Beleidsprestatie':
            return useReadBeleidsprestaties
        case 'Beleidsmodule':
            return useReadBeleidsmodules
        case 'Beleidsdoel':
            return useReadBeleidsdoelen
        case 'Maatregel':
            return useReadMaatregelen
        case 'Thema':
            return useReadThemas
        case 'Verordening':
            return useReadVerordeningstructuren
        case 'Gebiedsprogramma':
            return useReadGebiedsprogrammas
    }
}

export const getFetcherForPolicyLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useReadAmbitieLineage
        case 'Belang':
            return useReadBelangLineage
        case 'Beleidskeuze':
            return useReadBeleidskeuzeLineage
        case 'Beleidsregel':
            return useReadBeleidsregelLineage
        case 'Beleidsprestatie':
            return useReadBeleidsprestatieLineage
        case 'Beleidsmodule':
            return useReadBeleidsmoduleLineage
        case 'Beleidsdoel':
            return useReadBeleidsdoelLineage
        case 'Maatregel':
            return useReadMaatregelLineage
        case 'Thema':
            return useReadThemaLineage
        case 'Verordening':
            return useReadVerordeningLineage
    }
}

export const getMutationForPolicyLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useUpdateAmbitie
        case 'Belang':
            return useUpdateBelang
        case 'Beleidskeuze':
            return useUpdateBeleidskeuze
        case 'Beleidsregel':
            return useUpdateBeleidsregel
        case 'Beleidsprestatie':
            return useUpdateBeleidsprestatie
        case 'Beleidsmodule':
            return useUpdateBeleidsmodule
        case 'Beleidsdoel':
            return useUpdateBeleidsdoel
        case 'Maatregel':
            return useUpdateMaatregel
        case 'Thema':
            return useUpdateThema
        case 'Verordening':
            return useUpdateVerordening
        case 'Gebiedsprogramma':
            return useUpdateGebiedsprogramma
    }
}

export const getPostForPolicy = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useCreateAmbitie
        case 'Belang':
            return useCreateBelang
        case 'Beleidskeuze':
            return useCreateBeleidskeuze
        case 'Beleidsregel':
            return useCreateBeleidsregel
        case 'Beleidsprestatie':
            return useCreateBeleidsprestatie
        case 'Beleidsmodule':
            return useCreateBeleidsmodule
        case 'Beleidsdoel':
            return useCreateBeleidsdoel
        case 'Maatregel':
            return useCreateMaatregel
        case 'Thema':
            return useCreateThema
        case 'Verordening':
            return useCreateVerordening
    }
}
