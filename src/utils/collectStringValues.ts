export const collectStringValues = (value: unknown): string[] => {
    if (!value) return []

    if (typeof value === 'string') return [value]

    if (Array.isArray(value)) {
        return value.flatMap(collectStringValues)
    }

    if (typeof value === 'object') {
        return Object.values(value).flatMap(collectStringValues)
    }

    return []
}
