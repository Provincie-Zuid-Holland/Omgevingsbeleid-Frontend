import {
    AmbitiesRead,
    BelangenRead,
    BeleidskeuzesRead,
    BeleidsregelsRead,
    BeleidsprestatiesRead,
    BeleidsmodulesRead,
    BeleidsdoelenRead,
    MaatregelenRead,
    ThemasRead,
    VerordeningenRead,
} from '@/api/fetchers.schemas'

export type PossiblePolicyRead =
    | AmbitiesRead
    | BelangenRead
    | BeleidskeuzesRead
    | BeleidsregelsRead
    | BeleidsprestatiesRead
    | BeleidsmodulesRead
    | BeleidsdoelenRead
    | MaatregelenRead
    | ThemasRead
    | VerordeningenRead
