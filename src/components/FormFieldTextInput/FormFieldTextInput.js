import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

/**
 * Component to render the FormFieldTextInput.
 *
 * @component
 *
 * @param {string} dataObjectProperty - Parameter is part of the id of the FormFieldTitelenBeschrijving.
 * @param {string} pValue - Parameter that displays a text and is a part of the FormFieldTitelenBeschrijving.
 * @param {string} titelEnkelvoud - Paramter that is part of the id of the FormFieldTitelenBeshrijving.
 * @param {string} fieldValue - Parameter that is part of the placeholder for the FormFieldTitelenBeschrijving.
 * @param {boolean} handleChange - Parameter that can be set to true or false if the input can be changed.
 * @param {string} fieldLabel - Label of the FormFieldTitelenBeschrijving.
 * @param {boolean} disabled - Parameter that can be set true to disable input of the FormFieldTextInput.
 */
const FormFieldTextInput = ({
    dataObjectProperty,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    fieldLabel,
    disabled,
}) => {
    if (disabled) {
        pValue = pValue + ' (Kan niet zonder besluitvorming worden gewijzigd)'
    }

    return (
        <div className="w-full mb-6">
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titleSingular={titleSingular}
            />

            <input
                disabled={disabled}
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                value={fieldValue ? fieldValue : ''}
                onChange={handleChange}
                name={dataObjectProperty}
                className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                type="text"
                placeholder={fieldLabel}
            />
        </div>
    )
}

export default FormFieldTextInput
