import { Mark, mergeAttributes } from '@tiptap/core'

export const AREA_DATA_ATTRS = {
    group: 'data-aanwijzing-group',
    type: 'data-aanwijzing-type',
    locations: 'data-target-codes',
    title: 'data-title',
    context: 'data-context',
} as const

type AreaAttributes = {
    [key in (typeof AREA_DATA_ATTRS)[keyof typeof AREA_DATA_ATTRS]]:
        | string
        | string[]
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
                [AREA_DATA_ATTRS.group]: null,
                [AREA_DATA_ATTRS.type]: null,
                [AREA_DATA_ATTRS.locations]: null,
                [AREA_DATA_ATTRS.title]: null,
                [AREA_DATA_ATTRS.context]: null,
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
            [AREA_DATA_ATTRS.group]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.group],
            },
            [AREA_DATA_ATTRS.type]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.type],
            },
            [AREA_DATA_ATTRS.locations]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.locations],
            },
            [AREA_DATA_ATTRS.title]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.title],
            },
            [AREA_DATA_ATTRS.context]: {
                default: this.options.HTMLAttributes[AREA_DATA_ATTRS.context],
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
                        const { text = 'Locatie', ...rest } = attributes
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
