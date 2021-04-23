import React from 'react'
import Quill from 'quill'

// Quill Theme, we also override certain parts in styles.scss
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

/**
 * Checks if the formats we have received are accepted
 * @param {array} allowedFormats contains the types we want to accept in the editor
 */
const getFormats = (editorFormats) => {
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

    editorFormats.forEach((format) => {
        if (!acceptedFormats.includes(format))
            throw new Error('Not an accepted format')
    })

    return editorFormats
}

/**
 * Component to render an WYSIWYG Editor
 *
 * @param {string} dataObjectProperty - Parameter used to create unique ID's.
 * @param {string} placeholder - Parameter part of the quilOptions variable in the component.
 * @param {function} handleChange - Parameter used to set the name and value of the target within the editor.
 * @param {string} initialValue - Parameter used to load in the template value if there is no fieldValue.
 * @param {string} fieldValue - Parameter used to set the value of the editor.root.innerHTML variable.
 * @param {string} titleSingular - Parameter containing the title of the object in a singular form.
 */
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
}) {
    const editorRef = React.useRef(null)

    const initializeQuillEditor = React.useCallback(() => {
        if (editorRef.current) return

        const formats = getFormats(editorFormats)

        const quillOptions = {
            modules: {
                toolbar: disabled ? [] : editorToolbar,
            },
            placeholder: placeholder,
            theme: 'snow',
            formats: formats,
        }

        const editor = new Quill(
            `#quill-container-${dataObjectProperty}`,
            quillOptions
        )
        editorRef.current = editor

        // Paste text without styles (https://github.com/quilljs/quill/issues/1184)
        editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
            delta.ops = delta.ops.map((op) => {
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
        editor.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
            const plaintext = node.innerText
            const Delta = Quill.import('delta')
            return new Delta().insert(plaintext)
        })

        // Method to get html content and prevent ql-cursor elements:
        // https://github.com/quilljs/quill/issues/1682
        const getQuillHtml = (editor) => {
            const tempCont = document.createElement('div')
            const tempEditor = new Quill(tempCont)
            tempEditor.setContents(editor.getContents())
            return '' + tempEditor.root.innerHTML
        }

        editor.on('editor-change', function (eventName, ...args) {
            if (eventName === 'text-change') {
                // const justHtml = editor.root.innerHTML
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

    React.useLayoutEffect(() => {
        initializeQuillEditor()
    }, [initializeQuillEditor])

    return (
        <div
            id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            className={`quill-container ${disabled ? 'opacity-50' : ''}`}
        >
            <div
                className="editor"
                id={`quill-container-${dataObjectProperty}`}
            />
        </div>
    )
}

export default FormFieldRichTextEditor
