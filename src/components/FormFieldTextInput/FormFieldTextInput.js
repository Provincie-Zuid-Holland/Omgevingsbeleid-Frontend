import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldTextInput extends React.Component {
    render() {
        return (
            <div className="-mx-3 w-full px-3 mb-6">
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
                    className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                    type="text"
                    placeholder={this.props.fieldLabel}
                />
            </div>
        )
    }
}

export default FormFieldTextInput
