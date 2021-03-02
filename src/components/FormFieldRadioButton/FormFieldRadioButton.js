import React from 'react'

function FormFieldRadioButton({
    options = [],
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
                className="mt-4"
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
