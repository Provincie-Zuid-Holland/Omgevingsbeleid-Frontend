import React from 'react'
import Quill from 'quill'

// Quill Theme, we also override certain parts in styles.scss
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

// Disabled formats are commented out
// https://quilljs.com/docs/formats/
const formats = [
    // 'background',
    'bold',
    // 'color',
    // 'font',
    // 'code',
    // 'italic',
    // 'link',
    // 'size',
    // 'strike',
    // 'script',
    // 'underline',
    // 'blockquote',
    'header',
    // 'indent',
    'list',
    // 'align',
    // 'direction',
    // 'code-block',
    // 'formula'
    // 'image'
    // 'video'
]

/**
 * Component to render an WYSIWYG Editor
 *
 * @param {string} dataObjectProperty
 * @param {string} placeholder
 * @param {function} handleChange
 * @param {string} initialValue
 * @param {string} fieldValue
 * @param {string} titleSingular
 */
function FormFieldRichTextEditor({
    dataObjectProperty,
    placeholder,
    handleChange,
    initialValue,
    fieldValue,
    titleSingular,
}) {
    const editorRef = React.useRef(null)

    const initializeQuillEditor = React.useCallback(() => {
        if (editorRef.current) return

        const quillOptions = {
            modules: {
                toolbar: [{ header: 2 }, 'bold', { list: 'bullet' }],
            },
            placeholder: placeholder,
            theme: 'snow',
            formats: formats,
        }

        const editor = new Quill('.editor', quillOptions)
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

        editor.on('editor-change', function (eventName, ...args) {
            if (eventName === 'text-change') {
                const justHtml = editor.root.innerHTML
                handleChange({
                    target: {
                        name: dataObjectProperty,
                        value: justHtml,
                    },
                })
            }
        })
    }, [
        dataObjectProperty,
        fieldValue,
        handleChange,
        initialValue,
        placeholder,
    ])

    React.useLayoutEffect(() => {
        initializeQuillEditor()
    }, [initializeQuillEditor])

    return (
        <div
            id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            className="quill-container"
        >
            <div className="editor" />
        </div>
    )
}

export default FormFieldRichTextEditor
