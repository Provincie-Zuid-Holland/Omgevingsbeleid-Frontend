import { ChangeEvent } from 'react'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'

/**
 * Displays a input text formfield under the FormFieldTitelEnBeschrijving component.
 *
 * @param {string} dataObjectProperty - Contains a value passed down from the parent state.
 * @param {string} pValue - Contains a value passed down from the parent state.
 * @param {string} titleSingular - Contains a title in singular form.
 * @param {string} fieldValue - May contain a set value used in the input field.
 * @param {boolean} handleChange - Used to handle changes made in the input field.
 * @param {string} fieldLabel - Contains text used as a placeholder for the input field and is passed down to the FormFieldTitelEnBeschrijving component.
 * @param {boolean} disabled - Used to disable the input field.
 */

interface FormFieldTextInputProps {
    dataObjectProperty: string
    pValue: string
    titleSingular: string
    fieldValue?: string
    handleChange?: (event: ChangeEvent) => void
    fieldLabel: string
    disabled?: boolean
}

const FormFieldTextInput = ({
    dataObjectProperty,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    fieldLabel,
    disabled,
}: FormFieldTextInputProps) => {
    if (disabled) {
        pValue = pValue + ' (Kan niet zonder besluitvorming worden gewijzigd)'
    }

    return (
        <div className="w-full mb-6">
            <FormFieldTitelEnBeschrijving
                fieldLabel={fieldLabel}
                pValue={pValue}
            />
            <input
                disabled={disabled}
                data-testid={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
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
