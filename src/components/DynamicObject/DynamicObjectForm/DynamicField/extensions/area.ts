import { Mark, mergeAttributes } from '@tiptap/core'

export const AREA_DATA_ATTRS = {
    group: 'data-hint-gebiedengroep',
    type: 'data-hint-gebiedsaanwijzingtype',
    location: 'data-hint-locatie',
    label: 'data-gebiedengroep-label',
    id: 'data-gebiedengroep-id',
} as const

type AreaAttributes = {
    [key in (typeof AREA_DATA_ATTRS)[keyof typeof AREA_DATA_ATTRS]]: string
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
                [AREA_DATA_ATTRS.group]: null,
                [AREA_DATA_ATTRS.type]: null,
                [AREA_DATA_ATTRS.location]: null,
                [AREA_DATA_ATTRS.label]: null,
                [AREA_DATA_ATTRS.id]: null,
            },
        }
    },

    addAttributes() {
        return {
            href: {
                default: this.options.HTMLAttributes.href,
            },
            [AREA_DATA_ATTRS.group]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.group],
            },
            [AREA_DATA_ATTRS.type]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.type],
            },
            [AREA_DATA_ATTRS.location]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.location],
            },
            [AREA_DATA_ATTRS.label]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.label],
            },
            [AREA_DATA_ATTRS.id]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.id],
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: `a[${[AREA_DATA_ATTRS.group]}]`,
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
                    const { empty } = state.selection

                    if (empty) {
                        const { text = 'Gebied', ...rest } = attributes
                        return chain()
                            .insertContentAt(state.selection.anchor, [
                                {
                                    type: 'text',
                                    text,
                                    marks: [
                                        {
                                            type: this.name,
                                            attrs: rest,
                                        },
                                    ],
                                },
                            ])
                            .run()
                    } else {
                        return chain().setMark(this.name, attributes).run()
                    }
                },
        }
    },
})
