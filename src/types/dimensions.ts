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

export type TransformedMutateWriteObjects =
    | MutatedPolicySchema<ThemasWrite>
    | MutatedPolicySchema<MaatregelenWrite>
    | MutatedPolicySchema<BeleidsregelsWrite>
    | MutatedPolicySchema<BeleidsprestatiesWrite>
    | MutatedPolicySchema<BeleidsmodulesWrite>
    | MutatedPolicySchema<BeleidskeuzesWrite>
    | MutatedPolicySchema<BeleidsdoelenWrite>
    | MutatedPolicySchema<BelangenWrite>
    | MutatedPolicySchema<AmbitiesWrite>

export type BeleidskeuzeConnections =
    | BeleidskeuzesReadVerordeningenItem
    | BeleidskeuzesReadThemasItem
    | BeleidskeuzesReadMaatregelenItem
    | BeleidskeuzesReadBeleidsregelsItem
    | BeleidskeuzesReadBeleidsprestatiesItem
    | BeleidskeuzesReadBeleidsdoelenItem
    | BeleidskeuzesReadBelangenItem
