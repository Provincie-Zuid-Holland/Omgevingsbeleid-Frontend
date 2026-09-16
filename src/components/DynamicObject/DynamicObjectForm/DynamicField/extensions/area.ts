import { Mark, mergeAttributes } from '@tiptap/core'

export const AREA_DATA_ATTRS = {
    Object_Code: 'data-code',
    Cached_Title: 'data-title',
} as const

type AreaAttributes = {
    [key in (typeof AREA_DATA_ATTRS)[keyof typeof AREA_DATA_ATTRS]]:
        string | string[]
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        area: {
            setArea: (
                attributes: AreaAttributes & {
                    text?: string
                }
            ) => ReturnType
        }
    }
}

/**
 * This extension allows you to insert areas.
 */
export const Area = Mark.create({
    name: 'area',

    addOptions() {
        return {
            HTMLAttributes: {
                href: '#',
                'data-hint-type': 'gebiedsaanwijzing',
                [AREA_DATA_ATTRS.Object_Code]: null,
                [AREA_DATA_ATTRS.Cached_Title]: null,
            },
        }
    },

    addAttributes() {
        return {
            href: {
                default: this.options.HTMLAttributes.href,
            },
            'data-hint-type': {
                default: this.options.HTMLAttributes['data-hint-type'],
            },
            [AREA_DATA_ATTRS.Object_Code]: {
                default:
                    this.options.HTMLAttributes[AREA_DATA_ATTRS.Object_Code],
            },
            [AREA_DATA_ATTRS.Cached_Title]: {
                default:
                    this.options.HTMLAttributes[AREA_DATA_ATTRS.Cached_Title],
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: `a[${[AREA_DATA_ATTRS.Object_Code]}]`,
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'a',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
        ]
    },

    addCommands() {
        return {
            setArea:
                attributes =>
                ({ chain, state }) => {
                    const { from, to, empty } = state.selection
                    const selectedText = state.doc.textBetween(from, to)
                    const isEmptySelection =
                        empty || selectedText.trim().length === 0

                    if (isEmptySelection) {
                        const {
                            text,
                            [AREA_DATA_ATTRS.Cached_Title]: cachedTitle,
                            ...markAttributes
                        } = attributes

                        const insertedText =
                            text ||
                            (typeof cachedTitle === 'string'
                                ? cachedTitle
                                : undefined) ||
                            'Locatie'

                        return chain()
                            .insertContentAt(
                                { from, to },
                                {
                                    type: 'text',
                                    text: insertedText,
                                    marks: [
                                        {
                                            type: this.name,
                                            attrs: {
                                                ...markAttributes,
                                                [AREA_DATA_ATTRS.Cached_Title]:
                                                    cachedTitle,
                                            },
                                        },
                                    ],
                                }
                            )
                            .run()
                    }

                    return chain().setMark(this.name, attributes).run()
                },
        }
    },
})
