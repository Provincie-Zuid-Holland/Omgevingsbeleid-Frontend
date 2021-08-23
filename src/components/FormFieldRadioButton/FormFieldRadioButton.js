import React from 'react'

/**
 * Component that renders the FormFieldRadioButton component that maps through the options array to create radio buttons with a label.
 *
 * @param {array} options - Parameter that contains a list of values that are used to map through and create radio buttons with labels.
 * @param {boolean} handleChange - Parameter that is used within this function to set the onChange variable to true if the input element has been changed.
 * @param {string} dataObjectProperty - Parameter that contains the "Gebied_Duiding" value, given through the page FormFieldContainerMaatregelen.js, is part of the id used within this component and is set to the name of the radiobutton input.
 * @param {string} titleSingular - Parameter used as part of the div id and id set in the options array within this component.
 * @param {string} label - Paramater that is only displayed if it contains a value.
 * @param {string} fieldValue - Parameter that will receive the option value, when checked by the user.
 */
function FormFieldRadioButton({
    options = [],
    disabled,
    handleChange,
    dataObjectProperty,
    titleSingular,
    label,
    fieldValue,
}) {
    return (
        <div className="max-w-lg">
            {label ? (
                <p className="mb-4 text-sm text-gray-700">{label}</p>
            ) : null}

            <div
                className={`mt-4 ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed pointer-events-none'
                        : ''
                }`}
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            >
                {options.map((option) => {
                    const id = `form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}-${option}`
                    return (
                        <div key={option} className="flex items-center mb-4">
                            <input
                                id={id}
                                name={dataObjectProperty}
                                type="radio"
                                checked={fieldValue === option}
                                onChange={handleChange}
                                value={option}
                                className="w-4 h-4 transition duration-150 ease-in-out cursor-pointer form-radio"
                            />
                            <label htmlFor={id} className="ml-3">
                                <span className="block text-sm leading-5 text-gray-700 cursor-pointer">
                                    {option}
                                </span>
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FormFieldRadioButton
