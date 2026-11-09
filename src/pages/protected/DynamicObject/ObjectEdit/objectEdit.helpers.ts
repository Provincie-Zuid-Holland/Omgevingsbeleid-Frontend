import { Model } from '@/config/objects/types'

export type FormData = Record<string, any>

const EXTRA_FIELDS = [
    'File',
    'File_Ignore',
    'Werkingsgebied_Version',
    'Source_Title',
]

const SELECT_FIELDS = ['Documents', 'Target_Codes', 'Themas', 'Roles'] as const

const unwrapOption = (item: unknown): unknown =>
    item !== null && typeof item === 'object' && 'value' in item
        ? (item.value ?? item)
        : item

const isVisuallyEmptyRichText = (value: unknown): boolean => {
    if (typeof value !== 'string') return false

    const text = value
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\u200B/g, '')
        .trim()

    return text.length === 0
}

export const normalizePayload = (payload: FormData, initialData: FormData) => {
    const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([key]) => key in initialData)
    ) as FormData

    Object.keys(cleanedPayload).forEach(key => {
        const value = cleanedPayload[key]

        if (typeof value === 'string' && isVisuallyEmptyRichText(value)) {
            cleanedPayload[key] = null
        }
    })

    for (const field of SELECT_FIELDS) {
        const value = cleanedPayload[field]

        if (Array.isArray(value)) {
            cleanedPayload[field] = value.map(unwrapOption)
        }
    }

    if (
        Array.isArray(cleanedPayload.Ambtsgebied) &&
        cleanedPayload.Ambtsgebied.includes('true')
    ) {
        cleanedPayload.Gebiedengroep_Code = null
    }

    if ('Roles' in cleanedPayload) {
        cleanedPayload.Role = ''
    }

    return cleanedPayload
}

export const getInitialData = (model: Model, object?: Record<string, any>) => {
    const fields = [
        ...model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        ),
        ...EXTRA_FIELDS,
    ]

    const objectData = fields.reduce<FormData>((acc, field) => {
        acc[field] = object?.[field]
        return acc
    }, {})

    if (fields.includes('Ambtsgebied') && object?.Gebiedengroep_Code === null) {
        objectData.Ambtsgebied = ['true']
    }

    if (fields.includes('File_UUID')) {
        objectData.File = null
    }

    return objectData
}

export const getDefaultValues = (object?: Record<string, any>) => ({
    ...(object?.Hierarchy_Statics && {
        Hierarchy_Code: {
            label: object.Hierarchy_Statics.Cached_Title,
            value: object.Hierarchy_Statics.Code,
        },
    }),
    ...(object?.Gebiedengroep_Static && {
        Gebiedengroep_Code: {
            label: object.Gebiedengroep_Static.Cached_Title,
            value: object.Gebiedengroep_Static.Code,
        },
    }),
    ...(object?.Documents_Statics && {
        Documents: object.Documents_Statics.map((item: any) => ({
            label: item.Cached_Title,
            value: item.Code,
        })),
    }),
    ...(object?.Geo_Statics && {
        Target_Codes: object.Geo_Statics.map((item: any) => ({
            label: item.Cached_Title,
            value: item.Code,
        })),
    }),
})
