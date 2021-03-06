import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldTextArea extends React.Component {
    constructor(props) {
        super(props)
        this.textArea = React.createRef()
        this.updateElHeight = this.updateElHeight.bind(this)
    }

    componentDidMount() {
        // Set height van de textArea componenten op basis van de inhoud
        this.updateElHeight()
    }

    updateElHeight() {
        const textAreaNode = this.textArea.current
        textAreaNode.style.height = '1px'
        textAreaNode.style.height = textAreaNode.scrollHeight + 10 + 'px'
    }

    render() {
        return (
            <div className="flex flex-wrap mb-6 -mx-3">
                <div className="w-full px-3">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        disabled={this.props.disabled}
                        titleSingular={this.props.titleSingular}
                        anchorText={this.props.anchorText}
                        anchorLink={this.props.anchorLink}
                    />
                    <textarea
                        disabled={this.props.disabled}
                        ref={this.textArea}
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        value={
                            this.props.fieldValue ? this.props.fieldValue : ''
                        }
                        // required
                        onChange={(e) => {
                            this.updateElHeight()
                            this.props.handleChange(e)
                        }}
                        name={this.props.dataObjectProperty}
                        className="block w-full h-24 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none resize-none focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500"
                        type="text"
                        placeholder={
                            this.props.placeholderTekst
                                ? this.props.placeholderTekst
                                : `Typ hier uw ${this.props.fieldLabel.toLowerCase()}`
                        }
                    />
                </div>
            </div>
        )
    }
}

export default FormFieldTextArea
