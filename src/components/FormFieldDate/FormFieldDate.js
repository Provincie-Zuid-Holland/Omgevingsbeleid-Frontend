import React from "react"

import FormFieldTitelEnBeschrijving from "../FormFieldTitelEnBeschrijving"

function FormFieldDate({
    fieldValue,
    disabled,
    dataObjectProperty,
    fieldLabel,
    pValue,
    titleSingular,
    handleChange,
}) {
    /**
     * The standard dates are created in the back-end
     * To keep the UI clean we return an empty string
     */
    const parseFieldValue = (value) => {
        const standardDates = ["1753-01-01", "10000-01-01"]
        if (!value || standardDates.includes(value)) return ""
        return value
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    return (
        <div className="w-full mb-6">
            <FormFieldTitelEnBeschrijving
                disabled={disabled}
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titleSingular={titleSingular}
            />
            <input
                disabled={disabled}
                placeholder={isSafari ? "jjjj-mm-dd" : "dd-mm-jjjj"}
                value={parseFieldValue(fieldValue)}
                onChange={handleChange}
                name={dataObjectProperty}
                className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:border-gray-500 hover:border-gray-500 focus:outline-none focus:bg-white"
                type="date"
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                data-testid={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            />
        </div>
    )
}

export default FormFieldDate
