import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

const FormFieldTextInput = ({
    dataObjectProperty,
    pValue,
    titelEnkelvoud,
    fieldValue,
    handleChange,
    fieldLabel,
    disabled,
}) => {
    return (
        <div className="w-full mb-6">
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titelEnkelvoud={titelEnkelvoud}
            />

            <input
                disabled={disabled}
                id={`form-field-${titelEnkelvoud.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
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
