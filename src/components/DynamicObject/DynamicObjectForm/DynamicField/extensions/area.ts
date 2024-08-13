import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        area: {
            setArea: (attributes: {
                'data-hint-gebiedengroep': string
                'data-hint-gebiedsaanwijzingtype': string
                'data-hint-locatie': string
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
                'data-hint-gebiedengroep': null,
                'data-hint-gebiedsaanwijzingtype': null,
                'data-hint-locatie': null,
            },
        }
    },

    addAttributes() {
        return {
            href: {
                default: this.options.HTMLAttributes.href,
            },
            'data-hint-gebiedengroep': {
                default: this.options.HTMLAttributes['data-hint-gebiedengroep'],
            },
            'data-hint-gebiedsaanwijzingtype': {
                default:
                    this.options.HTMLAttributes[
                        'data-hint-gebiedsaanwijzingtype'
                    ],
            },
            'data-hint-locatie': {
                default: this.options.HTMLAttributes['data-hint-locatie'],
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'a[data-hint-gebiedengroep]',
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
