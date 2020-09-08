import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldTextInput extends React.Component {
    render() {
        return (
            <div className="w-full mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />

                <input
                    id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                    value={this.props.fieldValue ? this.props.fieldValue : ''}
                    onChange={this.props.handleChange}
                    name={this.props.dataObjectProperty}
                    className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                    type="text"
                    placeholder={this.props.fieldLabel}
                />
            </div>
        )
    }
}

export default FormFieldTextInput
