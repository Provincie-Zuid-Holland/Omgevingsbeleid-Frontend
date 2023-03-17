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
