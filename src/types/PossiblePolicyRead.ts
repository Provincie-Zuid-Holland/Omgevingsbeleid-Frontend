import {
    Ambitie,
    Belang,
    BeleidskeuzeListable,
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
    | BeleidskeuzeListable
    | Beleidsregel
    | Beleidsprestatie
    | Beleidsmodule
    | Beleidsdoel
    | Maatregel
    | Thema
    | Verordening
