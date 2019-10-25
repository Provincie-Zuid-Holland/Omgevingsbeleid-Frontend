import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldWeblink extends React.Component {
    render() {
        return (
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        hideObjectLabel={this.props.hideObjectLabel}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />
                    <input
                        type="text"
                        value={this.props.fieldValue || ''}
                        onChange={this.props.handleChange}
                        name="Weblink"
                        className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        placeholder={this.props.fieldLabel}
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                    />
                </div>
            </div>
        )
    }
}

export default FormFieldWeblink
