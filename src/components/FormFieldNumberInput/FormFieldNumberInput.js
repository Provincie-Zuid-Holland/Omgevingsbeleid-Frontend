import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

/**
 * Component that renders the FormFieldNumberInput.
 *
 * @component
 *
 * @param {string} dataObjectProperty - Parameter that contains part of the id value of the input.
 * @param {string} pValue - Parameter that contains the pValue of the FormFieldTitelEnBeschrijving component.
 * @param {string} titleSingular - Parameter that contains part of the id value of the input.
 * @param {string} fieldValue - Parameter that may contain the value for the input variable value.
 * @param {object} handleChange - Parameter that contains the value for the input variable onChange.
 * @param {string} fieldLabel - Parameter that contains the value for the FormFieldTitelEnBeschrijving component variable fieldLabel.
 */
const FormFieldNumberInput = ({
    dataObjectProperty,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    fieldLabel,
}) => {
    return (
        <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={dataObjectProperty}
                    fieldLabel={fieldLabel}
                    pValue={pValue}
                    titleSingular={titleSingular}
                />

                <input
                    id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                    value={fieldValue ? fieldValue : ''}
                    onChange={handleChange}
                    name={dataObjectProperty}
                    className="block w-48 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                    type="number"
                    placeholder={fieldLabel}
                />
            </div>
        </div>
    )
}

export default FormFieldNumberInput
