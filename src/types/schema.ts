export type SchemaMeta<T> = {
    title: {
        singular: string
        singularCapitalized: string
        plural: string
        pluralCapitalized: string
        prefixSingular: string
        prefixSingularCapitalized: string
        prefixPlural: string
        prefixPluralCapitalized: string
    }
    description: string | null
    slug: {
        overview: string
        new: string
    }
    query: T
}

export type SchemaMetaQueries = {
    usePost: any
    useGet: any
    useGetVersion: any
    useGetLineage: any
    useGetValidLineage: any
    usePatchLineage: any
    useGetValid: any
}
