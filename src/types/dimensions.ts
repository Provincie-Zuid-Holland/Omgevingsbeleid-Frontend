import {
    BeleidskeuzesReadVerordeningenItem,
    BeleidskeuzesReadThemasItem,
    BeleidskeuzesReadMaatregelenItem,
    BeleidskeuzesReadBeleidsregelsItem,
    BeleidskeuzesReadBeleidsprestatiesItem,
    BeleidskeuzesReadBeleidsdoelenItem,
    BeleidskeuzesReadBelangenItem,
    AmbitiesRead,
    AmbitiesWrite,
    BelangenRead,
    BelangenWrite,
    BeleidsdoelenRead,
    BeleidsdoelenWrite,
    BeleidskeuzesRead,
    BeleidskeuzesWrite,
    BeleidsmodulesRead,
    BeleidsmodulesWrite,
    BeleidsprestatiesRead,
    BeleidsprestatiesWrite,
    BeleidsregelsRead,
    BeleidsregelsWrite,
    MaatregelenRead,
    MaatregelenWrite,
    ThemasRead,
    ThemasWrite,
} from '@/api/fetchers.schemas'

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
    | ThemasWrite
    | MaatregelenWrite
    | BeleidsregelsWrite
    | BeleidsprestatiesWrite
    | BeleidsmodulesWrite
    | BeleidskeuzesWrite
    | BeleidsdoelenWrite
    | BelangenWrite
    | AmbitiesWrite

export type BeleidskeuzeConnections =
    | BeleidskeuzesReadVerordeningenItem
    | BeleidskeuzesReadThemasItem
    | BeleidskeuzesReadMaatregelenItem
    | BeleidskeuzesReadBeleidsregelsItem
    | BeleidskeuzesReadBeleidsprestatiesItem
    | BeleidskeuzesReadBeleidsdoelenItem
    | BeleidskeuzesReadBelangenItem
