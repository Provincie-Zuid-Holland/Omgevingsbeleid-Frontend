import {
    Ambitie,
    Belang,
    Beleidskeuze,
    Beleidsregel,
    Beleidsprestatie,
    Beleidsmodule,
    Beleidsdoel,
    Maatregel,
    Thema,
    Verordening,
} from '@/api/fetchers.schemas'

export type PossiblePolicyRead =
    | Ambitie
    | Belang
    | Beleidskeuze
    | Beleidsregel
    | Beleidsprestatie
    | Beleidsmodule
    | Beleidsdoel
    | Maatregel
    | Thema
    | Verordening
