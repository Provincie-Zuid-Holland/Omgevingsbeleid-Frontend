import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        area: {
            setArea: (attributes: {
                'data-gebiedengroep': string
                'data-type': string
                'data-gebiedsaanwijzing': string
                text?: string
            }) => ReturnType
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
                'data-gebiedengroep': null,
                'data-type': null,
                'data-gebiedsaanwijzing': null,
            },
        }
    },

    addAttributes() {
        return {
            href: {
                default: this.options.HTMLAttributes.href,
            },
            'data-gebiedengroep': {
                default: this.options.HTMLAttributes['data-gebiedengroep'],
            },
            'data-type': {
                default: this.options.HTMLAttributes['data-type'],
            },
            'data-gebiedsaanwijzing': {
                default: this.options.HTMLAttributes['data-gebiedsaanwijzing'],
            },
        }
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
                        const { text = 'default text', ...rest } = attributes
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
