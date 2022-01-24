import Quill, { QuillOptionsStatic } from 'quill'
// Quill Theme, we also override certain parts in styles.scss
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * Checks if the formats we have received are accepted
 * @param {array} allowedFormats contains the types we want to accept in the editor
 */
const getFormats = (editorFormats: string[]) => {
    // https://quilljs.com/docs/formats/
    const acceptedFormats = [
        'background',
        'bold',
        'color',
        'font',
        'code',
        'italic',
        'link',
        'size',
        'strike',
        'script',
        'underline',
        'blockquote',
        'header',
        'indent',
        'list',
        'align',
        'direction',
        'code-block',
        'formula',
        'image',
        'video',
    ]

    editorFormats.forEach(format => {
        if (!acceptedFormats.includes(format))
            throw new Error('Not an accepted format')
    })

    return editorFormats
}

/**
 * Displays a form field containing a text editor.
 *
 * @param {string} dataObjectProperty - Used as part of the id of a form field.
 * @param {string} placeholder - Contains a placeholder for the quillOptions.
 * @param {function} handleChange - Used to set changes made within the text editor.
 * @param {string} initialValue - Used to set initial value within the text editor.
 * @param {string} fieldValue - Contains the value of a field.
 * @param {string} titleSingular - Contains the title of the object in a singular form.
 */

interface FormFieldRichTextEditorProps {
    dataObjectProperty: string
    placeholder: string
    handleChange: (object: {
        target: {
            name: string
            value: string
        }
    }) => void
    initialValue: string
    fieldValue: string
    titleSingular: string
    editorFormats: string[]
    disabled?: boolean
    editorToolbar: string[]
}

function FormFieldRichTextEditor({
    dataObjectProperty,
    placeholder,
    handleChange,
    initialValue,
    fieldValue,
    titleSingular,
    editorFormats,
    disabled,
    editorToolbar,
}: FormFieldRichTextEditorProps) {
    const editorRef = useRef<Quill | null>(null)

    const initializeQuillEditor = useCallback(() => {
        if (editorRef.current) return

        const formats = getFormats(editorFormats)

        const quillOptions: QuillOptionsStatic = {
            modules: {
                toolbar: disabled ? [] : editorToolbar,
            },
            placeholder: disabled ? '' : placeholder,
            theme: 'snow',
            formats: formats,
        }

        const editor = new Quill(
            `#quill-container-${dataObjectProperty}`,
            quillOptions
        )
        editorRef.current = editor

        // Paste text without styles (https://github.com/quilljs/quill/issues/1184)
        editor.clipboard.addMatcher(Node.ELEMENT_NODE, (_, delta) => {
            delta.ops = delta.ops.map(op => {
                return {
                    insert: op.insert,
                }
            })
            return delta
        })

        // Disable tab (https://github.com/quilljs/quill/issues/110)
        delete editor.getModule('keyboard').bindings['9']

        // If there is no fieldValue we load in the initialValue (Template)
        if (initialValue && !fieldValue) {
            editor.root.innerHTML = initialValue
        } else if (fieldValue) {
            editor.root.innerHTML = fieldValue
        }

        // Disable pasting of images
        editor.clipboard.addMatcher(Node.ELEMENT_NODE, function (node) {
            const plaintext = node.innerText
            const Delta = Quill.import('delta')
            return new Delta().insert(plaintext)
        })

        // Method to get html content and prevent ql-cursor elements:
        // https://github.com/quilljs/quill/issues/1682
        const getQuillHtml = (editor: Quill) => {
            const tempCont = document.createElement('div')
            const tempEditor = new Quill(tempCont)
            tempEditor.setContents(editor.getContents())
            return '' + tempEditor.root.innerHTML
        }

        editor.on('editor-change', function (eventName: any) {
            if (eventName === 'text-change') {
                const justHtml = getQuillHtml(editor)

                handleChange({
                    target: {
                        name: dataObjectProperty,
                        value: justHtml,
                    },
                })
            }
        })

        if (disabled) {
            editor.enable(false)
        }
    }, [
        dataObjectProperty,
        fieldValue,
        disabled,
        handleChange,
        initialValue,
        placeholder,
        editorFormats,
        editorToolbar,
    ])

    useLayoutEffect(() => {
        initializeQuillEditor()
    }, [initializeQuillEditor])

    return (
        <div
            id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            className={`quill-container ${disabled ? 'opacity-50' : ''}`}>
            <div
                className="editor"
                id={`quill-container-${dataObjectProperty}`}
            />
        </div>
    )
}

export default FormFieldRichTextEditor
