import React from 'react'
import Quill from 'quill'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

function FormFieldRichTextEditor({
    dataObjectProperty,
    placeholder,
    handleChange,
    initialValue,
    fieldValue,
}) {
    const initializeQuillEditor = React.useCallback(() => {
        const quillOptions = {
            modules: {
                toolbar: [{ header: 2 }, 'bold', { list: 'bullet' }],
            },
            placeholder: placeholder,
            theme: 'snow',
        }

        const editor = new Quill('.editor', quillOptions)

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
            // editor.root.innerHTML = parsedWithoutLineBreaks
            editor.root.innerHTML = fieldValue
        }

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
    }, [])

    React.useLayoutEffect(() => {
        initializeQuillEditor()
    }, [initializeQuillEditor])

    return (
        <div className="quill-container">
            <div className="editor" />
        </div>
    )
}

export default FormFieldRichTextEditor
