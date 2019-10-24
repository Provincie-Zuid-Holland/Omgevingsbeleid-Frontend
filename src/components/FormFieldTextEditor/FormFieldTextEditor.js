import React from 'react'
import {
    ContentState,
    Editor,
    EditorState,
    convertFromHTML,
    RichUtils,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import { stateToHTML } from 'draft-js-export-html'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldTextEditor extends React.Component {
    constructor(props) {
        super(props)

        if (
            this.props.fieldValue !== undefined &&
            this.props.fieldValue.length > 0 &&
            this.props.fieldValue !== '<p><br></p>'
        ) {
            const sampleMarkup = this.props.fieldValue
            const blocksFromHTML = convertFromHTML(sampleMarkup)
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            )

            this.state = {
                editorState: EditorState.createWithContent(state),
            }
        } else {
            this.state = { editorState: EditorState.createEmpty() }
        }

        this.focus = () => this.refs.editor.focus()

        this.onChange = editorState => {
            this.setState({ editorState })
            const stateValue = stateToHTML(editorState.getCurrentContent())
            this.props.handleChange(stateValue, this.props.dataObjectProperty)
        }

        this.toggleBlockType = type => this._toggleBlockType(type)
        this.handleKeyCommand = command => this._handleKeyCommand(command)
    }

    _handleKeyCommand(command) {
        const { editorState } = this.state
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(this.state.editorState, blockType)
        )
    }

    render() {
        const { editorState } = this.state

        let className =
            'RichEditor-editor border bg-white rounded-b text-gray-700 border-gray-400'
        var contentState = editorState.getCurrentContent()

        if (!contentState.hasText()) {
            if (
                contentState
                    .getBlockMap()
                    .first()
                    .getType() !== 'unstyled'
            ) {
                className += ' RichEditor-hidePlaceholder'
            }
        }

        return (
            <div>
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    hideObjectLabel={this.props.hideObjectLabel}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />
                <div className="RichEditor-root">
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <div
                        className={className}
                        onClick={this.focus}
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                    >
                        <Editor
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            onChange={this.onChange}
                            ref="editor"
                            spellCheck={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgb(255, 255, 255)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
}

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote'
        default:
            return null
    }
}

class StyleButton extends React.Component {
    constructor() {
        super()
        this.onToggle = e => {
            e.preventDefault()
            this.props.onToggle(this.props.style)
        }
    }

    render() {
        let className = 'RichEditor-styleButton px-1 font-bold text-gray-600'
        if (this.props.active) {
            className += ' RichEditor-activeButton'
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        )
    }
}

const BLOCK_TYPES = [
    {
        label: (
            <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="list-ul"
                className="h-5 w-5 inline-block"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    fill="currentColor"
                    d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
                />
            </svg>
        ),
        style: 'unordered-list-item',
        key: 'unordered-list',
    },
    {
        label: (
            <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="list-ol"
                className="h-5 w-5 ml-2 inline-block"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    fill="currentColor"
                    d="M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.83a157.41 157.41 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.91 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 0 1 9.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z"
                />
            </svg>
        ),
        style: 'ordered-list-item',
        key: 'ordered-list',
    },
]

const BlockStyleControls = props => {
    const { editorState } = props
    const selection = editorState.getSelection()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType()

    return (
        <div className="RichEditor-controls bg-gray-200 w-full border p-1 pl-3 rounded-t border-gray-400">
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.key}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    )
}

export default FormFieldTextEditor
