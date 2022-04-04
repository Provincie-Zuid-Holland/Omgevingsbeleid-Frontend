import {
    VerordeningenRead,
    ThemasRead,
    MaatregelenRead,
    BeleidsregelsRead,
    BeleidsprestatiesRead,
    BeleidsmodulesRead,
    BeleidskeuzesRead,
    BeleidsdoelenRead,
    BelangenRead,
    AmbitiesRead,
    VerordeningenWrite,
    ThemasWrite,
    MaatregelenWrite,
    BeleidsregelsWrite,
    BeleidsprestatiesWrite,
    BeleidsmodulesWrite,
    BeleidskeuzesWrite,
    BeleidsdoelenWrite,
    BelangenWrite,
    AmbitiesWrite,
} from '@/api/fetchers.schemas'
import allDimensies from '@/constants/dimensies'

export type DimensionType =
    | 'ambities'
    | 'belangen'
    | 'beleidskeuzes'
    | 'beleidsregels'
    | 'beleidsprestaties'
    | 'maatregelen'
    | 'beleidsdoelen'
    | 'themas'
    | 'verordeningen'
    | 'artikel'

export type MutateReadObjects =
    | VerordeningenRead
    | ThemasRead
    | MaatregelenRead
    | BeleidsregelsRead
    | BeleidsprestatiesRead
    | BeleidsmodulesRead
    | BeleidskeuzesRead
    | BeleidsdoelenRead
    | BelangenRead
    | AmbitiesRead

export type MutateWriteObjects =
    | VerordeningenWrite
    | ThemasWrite
    | MaatregelenWrite
    | BeleidsregelsWrite
    | BeleidsprestatiesWrite
    | BeleidsmodulesWrite
    | BeleidskeuzesWrite
    | BeleidsdoelenWrite
    | BelangenWrite
    | AmbitiesWrite

export type AllTitleSingularTypes =
    typeof allDimensies[keyof typeof allDimensies]['TITLE_SINGULAR']

export type TitleSingularType = Exclude<
    AllTitleSingularTypes,
    'Artikel' | 'Beleidsrelatie'
>
