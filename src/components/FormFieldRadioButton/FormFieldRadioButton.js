/**
 * Displays list of options with radio buttons and labels.
 *
 * @param {array} options - Contains list of options that the user can select from.
 * @param {function} handleChange - Function to set the changes from the radio buttons.
 * @param {string} dataObjectProperty - Contains the data object property name.
 * @param {string} titleSingular - Contains the title in singular form.
 * @param {string} label - Contains a label of the component.
 * @param {string} fieldValue - Contains the value of the field.
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
                {options.map(option => {
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
