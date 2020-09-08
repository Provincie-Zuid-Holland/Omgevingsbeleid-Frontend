import React from 'react'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import MarkdownIt from 'markdown-it'
import TurndownService from 'turndown'

const replaceEntersAndNewLines = (string) => {
    string = string.replace(new RegExp('[\r\n]+', 'g'), '___LINEBREAK___')
    string = string.replace(
        new RegExp('___LINEBREAK___  ___LINEBREAK___', 'g'),
        '___ENTER___'
    )
    string = string.replace(new RegExp('___LINEBREAK___', 'g'), `\n`)
    string = string.replace(new RegExp('___ENTER___', 'g'), `\n\n<br />\n\n`)

    return string
}
const replaceEntersAndNewLinesHTML = (string) => {
    string = string.replace(new RegExp('[\r\n]+', 'g'), '')
    return string
}

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
    // parseMarkdown.options.breaks = true
    parseMarkdown.options.html = true
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
            // Replace enters and new lines
            // fieldValue = replaceEntersAndNewLines(fieldValue)
            let parsedFieldValue = parseMarkdown.render(fieldValue)
            parsedFieldValue = replaceEntersAndNewLinesHTML(parsedFieldValue)

            // editor.root.innerHTML = parsedWithoutLineBreaks
            editor.root.innerHTML = parsedFieldValue
        }

        editor.on('editor-change', function (eventName, ...args) {
            if (eventName === 'text-change') {
                const justHtml = editor.root.innerHTML
                let markdown = turndownService.turndown(justHtml)
                markdown = replaceEntersAndNewLines(markdown)

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
