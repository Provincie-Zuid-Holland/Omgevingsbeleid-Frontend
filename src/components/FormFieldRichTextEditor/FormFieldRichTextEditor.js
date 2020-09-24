import React from 'react'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import MarkdownIt from 'markdown-it'
import TurndownService from 'turndown'

function FormFieldRichTextEditor({
    dataObjectProperty,
    placeholder,
    handleChange,
    toolbar,
    initialValue,
    fieldValue,
}) {
    const quillOptions = {
        modules: {
            toolbar: toolbar,
        },
        placeholder: placeholder,
        theme: 'snow',
    }

    React.useLayoutEffect(() => {
        const editor = new Quill('.editor', quillOptions)

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

    return (
        <div className="quill-container">
            <div className="editor" />
        </div>
    )
}

export default FormFieldRichTextEditor
