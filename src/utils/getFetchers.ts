import {
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
    usePatchAmbitiesLineageid,
    usePatchBelangenLineageid,
    usePatchBeleidskeuzesLineageid,
    usePatchBeleidsregelsLineageid,
    usePatchBeleidsprestatiesLineageid,
    usePatchBeleidsmodulesLineageid,
    usePatchBeleidsdoelenLineageid,
    usePatchMaatregelenLineageid,
    usePatchThemasLineageid,
    usePatchVerordeningenLineageid,
    useGetAmbities,
    useGetBelangen,
    useGetBeleidskeuzes,
    useGetBeleidsregels,
    useGetBeleidsprestaties,
    useGetBeleidsmodules,
    useGetBeleidsdoelen,
    useGetMaatregelen,
    useGetThemas,
    useGetVerordeningen,
} from '@/api/fetchers'
import { filteredDimensieConstants } from '@/constants/dimensies'

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
            return useGetVerordeningen
    }
}

export const getFetcherForLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return useGetAmbitiesLineageid
        case 'Belang':
            return useGetBelangenLineageid
        case 'Beleidskeuze':
            return useGetBeleidskeuzesLineageid
        case 'Beleidsregel':
            return useGetBeleidsregelsLineageid
        case 'Beleidsprestatie':
            return useGetBeleidsprestatiesLineageid
        case 'Beleidsmodule':
            return useGetBeleidsmodulesLineageid
        case 'Beleidsdoel':
            return useGetBeleidsdoelenLineageid
        case 'Maatregel':
            return useGetMaatregelenLineageid
        case 'Thema':
            return useGetThemasLineageid
        case 'Verordening':
            return useGetVerordeningenLineageid
    }
}

export const getMutationForLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return usePatchAmbitiesLineageid
        case 'Belang':
            return usePatchBelangenLineageid
        case 'Beleidskeuze':
            return usePatchBeleidskeuzesLineageid
        case 'Beleidsregel':
            return usePatchBeleidsregelsLineageid
        case 'Beleidsprestatie':
            return usePatchBeleidsprestatiesLineageid
        case 'Beleidsmodule':
            return usePatchBeleidsmodulesLineageid
        case 'Beleidsdoel':
            return usePatchBeleidsdoelenLineageid
        case 'Maatregel':
            return usePatchMaatregelenLineageid
        case 'Thema':
            return usePatchThemasLineageid
        case 'Verordening':
            return usePatchVerordeningenLineageid
    }
}
