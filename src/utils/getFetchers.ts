import {
    usePostAmbities,
    usePostBelangen,
    usePostBeleidskeuzes,
    usePostBeleidsregels,
    usePostBeleidsprestaties,
    usePostBeleidsmodules,
    usePostBeleidsdoelen,
    usePostMaatregelen,
    usePostThemas,
    usePostVerordeningen,
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
    usePatchAmbitiesLineageId,
    usePatchBelangenLineageId,
    usePatchBeleidskeuzesLineageId,
    usePatchBeleidsregelsLineageId,
    usePatchBeleidsprestatiesLineageId,
    usePatchBeleidsmodulesLineageId,
    usePatchBeleidsdoelenLineageId,
    usePatchMaatregelenLineageId,
    usePatchThemasLineageId,
    usePatchVerordeningenLineageId,
    useGetAmbities,
    useGetBelangen,
    useGetBeleidskeuzes,
    useGetBeleidsregels,
    useGetBeleidsprestaties,
    useGetBeleidsmodules,
    useGetBeleidsdoelen,
    useGetMaatregelen,
    useGetThemas,
    usePatchGebiedsprogrammasLineageId,
    useGetGebiedsprogrammas,
} from '@/api/fetchers'
import { filteredDimensieConstants } from '@/constants/dimensies'

import { useGetVerordeningenStructuren } from './verordening'

export const getFetcherForType = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useGetAmbities
        case 'Belang':
            return useGetBelangen
        case 'Beleidskeuze':
            return useGetBeleidskeuzes
        case 'Beleidsregel':
            return useGetBeleidsregels
        case 'Beleidsprestatie':
            return useGetBeleidsprestaties
        case 'Beleidsmodule':
            return useGetBeleidsmodules
        case 'Beleidsdoel':
            return useGetBeleidsdoelen
        case 'Maatregel':
            return useGetMaatregelen
        case 'Thema':
            return useGetThemas
        case 'Verordening':
            return useGetVerordeningenStructuren
        case 'Gebiedsprogramma':
            return useGetGebiedsprogrammas
    }
}

export const getFetcherForPolicyLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useGetAmbitiesLineageId
        case 'Belang':
            return useGetBelangenLineageId
        case 'Beleidskeuze':
            return useGetBeleidskeuzesLineageId
        case 'Beleidsregel':
            return useGetBeleidsregelsLineageId
        case 'Beleidsprestatie':
            return useGetBeleidsprestatiesLineageId
        case 'Beleidsmodule':
            return useGetBeleidsmodulesLineageId
        case 'Beleidsdoel':
            return useGetBeleidsdoelenLineageId
        case 'Maatregel':
            return useGetMaatregelenLineageId
        case 'Thema':
            return useGetThemasLineageId
        case 'Verordening':
            return useGetVerordeningenLineageId
    }
}

export const getMutationForPolicyLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return usePatchAmbitiesLineageId
        case 'Belang':
            return usePatchBelangenLineageId
        case 'Beleidskeuze':
            return usePatchBeleidskeuzesLineageId
        case 'Beleidsregel':
            return usePatchBeleidsregelsLineageId
        case 'Beleidsprestatie':
            return usePatchBeleidsprestatiesLineageId
        case 'Beleidsmodule':
            return usePatchBeleidsmodulesLineageId
        case 'Beleidsdoel':
            return usePatchBeleidsdoelenLineageId
        case 'Maatregel':
            return usePatchMaatregelenLineageId
        case 'Thema':
            return usePatchThemasLineageId
        case 'Verordening':
            return usePatchVerordeningenLineageId
        case 'Gebiedsprogramma':
            return usePatchGebiedsprogrammasLineageId
    }
}

export const getPostForPolicy = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return usePostAmbities
        case 'Belang':
            return usePostBelangen
        case 'Beleidskeuze':
            return usePostBeleidskeuzes
        case 'Beleidsregel':
            return usePostBeleidsregels
        case 'Beleidsprestatie':
            return usePostBeleidsprestaties
        case 'Beleidsmodule':
            return usePostBeleidsmodules
        case 'Beleidsdoel':
            return usePostBeleidsdoelen
        case 'Maatregel':
            return usePostMaatregelen
        case 'Thema':
            return usePostThemas
        case 'Verordening':
            return usePostVerordeningen
    }
}
