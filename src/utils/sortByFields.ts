type SortSelector<T> = (item: T) => string | null | undefined

export const sortByFields = <T>(
    items: readonly T[],
    selectors: readonly SortSelector<T>[]
): T[] =>
    [...items].sort((a, b) => {
        for (const select of selectors) {
            const comparison = (select(a) ?? '').localeCompare(
                select(b) ?? '',
                undefined,
                {
                    numeric: true,
                    sensitivity: 'base',
                }
            )

            if (comparison !== 0) return comparison
        }

        return 0
    })
