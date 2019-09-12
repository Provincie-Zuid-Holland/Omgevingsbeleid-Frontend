import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldDate extends React.Component {
    render() {
        return (
            <div className="w-50 px-3 mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    hideObjectLabel={this.props.hideObjectLabel}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />
                <input
                    required
                    value={this.props.fieldValue}
                    onChange={this.props.handleChange}
                    name={this.props.dataObjectProperty}
                    className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    type="date"
                />
            </div>
        )
    }
}
export default FormFieldDate
