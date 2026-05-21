type SelectOption = {
    label: string
    value: string
}

type FieldMapValue = Array<string | SelectOption>

export const normalizeFieldMap = (
    entries?: Array<{ key: string; value: FieldMapValue }>
) =>
    entries?.reduce<Record<string, string[]>>((acc, { key, value }) => {
        acc[key] = value.map(item =>
            typeof item === 'string' ? item : item.value
        )

        return acc
    }, {})
