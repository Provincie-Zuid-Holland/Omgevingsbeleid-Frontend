import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldNumberInput extends Component {
    constructor(props) {
        super(props)
    }
    null
    render() {
        return (
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />

                    <input
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        value={
                            this.props.fieldValue ? this.props.fieldValue : ''
                        }
                        onChange={this.props.handleChange}
                        name={this.props.dataObjectProperty}
                        className="appearance-none block w-48 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        type="number"
                        placeholder={this.props.fieldLabel}
                    />
                </div>
            </div>
        )
    }
}

FormFieldNumberInput.propTypes = {}

FormFieldNumberInput.defaultProps = {}

export default FormFieldNumberInput
