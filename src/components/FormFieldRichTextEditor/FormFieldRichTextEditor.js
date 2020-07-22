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
    const turndownService = new TurndownService()
    const parseMarkdown = new MarkdownIt()
    const options = {
        modules: {
            toolbar: toolbar,
        },
        placeholder: placeholder,
        theme: 'snow',
    }

    React.useLayoutEffect(() => {
        const editor = new Quill('.editor', options)

        // Disable tab (https://github.com/quilljs/quill/issues/110)
        delete editor.getModule('keyboard').bindings['9']

        if (initialValue && !fieldValue) {
            editor.root.innerHTML = initialValue
        } else if (fieldValue) {
            const parsedFieldValue = parseMarkdown.render(fieldValue)
            const parsedWithoutLineBreaks = parsedFieldValue.replace(
                /(\r\n|\n|\r)/gm,
                ''
            )

            editor.root.innerHTML = parsedWithoutLineBreaks
        }

        editor.on('editor-change', function (eventName, ...args) {
            if (eventName === 'text-change') {
                var justHtml = editor.root.innerHTML
                var markdown = turndownService.turndown(justHtml)

                handleChange({
                    target: {
                        name: dataObjectProperty,
                        value: markdown,
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
