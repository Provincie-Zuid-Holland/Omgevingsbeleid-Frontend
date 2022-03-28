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
} from '@/api/fetchers'
import allDimensies from '@/constants/dimensies'

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>

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
