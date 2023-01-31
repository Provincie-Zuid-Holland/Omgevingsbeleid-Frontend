import {
    Ambitie,
    AmbitieUpdate,
    Belang,
    BelangUpdate,
    Beleidsdoel,
    BeleidsdoelUpdate,
    Beleidskeuze,
    BeleidskeuzeUpdate,
    Beleidsmodule,
    BeleidsmoduleUpdate,
    Beleidsprestatie,
    BeleidsprestatieUpdate,
    Beleidsregel,
    BeleidsregelUpdate,
    Maatregel,
    MaatregelUpdate,
    Thema,
    ThemaUpdate,
    RelatedVerordeningen,
    RelatedThema,
    RelatedMaatregel,
    RelatedBeleidsregel,
    RelatedBeleidsprestatie,
    RelatedBeleidsdoel,
    RelatedBelang,
    ThemaCreate,
    MaatregelCreate,
    BeleidsregelCreate,
    BeleidsprestatieCreate,
    BeleidsmoduleCreate,
    BeleidskeuzeCreate,
    BeleidsdoelCreate,
    BelangCreate,
    AmbitieCreate,
    Gebiedsprogramma,
    GebiedsprogrammaCreate,
    GebiedsprogrammaUpdate,
    RelatedGebiedsprogramma,
} from '@/api/fetchers.schemas'

/**
 * The following types are used to correct the generated types from the API
 * In the future this should be fixed in the API
 */
export type ExtendTypesWithNull<Type> = {
    [Property in keyof Type]: Type[Property] | null
}
export type RemoveCreatedAndModified<T> = Omit<T, 'Created_By' | 'Modified_By'>
export type MutatedPolicySchema<T> = ExtendTypesWithNull<
    RemoveCreatedAndModified<T>
>

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
    | 'gebiedsprogramma'

export type MutateReadObjects =
    | Thema
    | Maatregel
    | Beleidsregel
    | Beleidsprestatie
    | Beleidsmodule
    | Beleidskeuze
    | Beleidsdoel
    | Belang
    | Ambitie
    | Gebiedsprogramma

export type MutateWriteObjects =
    | ThemaCreate
    | MaatregelCreate
    | BeleidsregelCreate
    | BeleidsprestatieCreate
    | BeleidsmoduleCreate
    | BeleidskeuzeCreate
    | BeleidsdoelCreate
    | BelangCreate
    | AmbitieCreate
    | GebiedsprogrammaCreate

export type TransformedMutateWriteObjects =
    | MutatedPolicySchema<ThemaUpdate>
    | MutatedPolicySchema<MaatregelUpdate>
    | MutatedPolicySchema<BeleidsregelUpdate>
    | MutatedPolicySchema<BeleidsprestatieUpdate>
    | MutatedPolicySchema<BeleidsmoduleUpdate>
    | MutatedPolicySchema<BeleidskeuzeUpdate>
    | MutatedPolicySchema<BeleidsdoelUpdate>
    | MutatedPolicySchema<BelangUpdate>
    | MutatedPolicySchema<AmbitieUpdate>
    | MutatedPolicySchema<GebiedsprogrammaUpdate>

export type BeleidskeuzeConnections =
    | RelatedVerordeningen
    | RelatedThema
    | RelatedMaatregel
    | RelatedBeleidsregel
    | RelatedBeleidsprestatie
    | RelatedBeleidsdoel
    | RelatedBelang
    | RelatedGebiedsprogramma
