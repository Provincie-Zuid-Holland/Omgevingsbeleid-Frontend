import { FC } from 'react'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'

/**
 * Displays a number input form field.
 */

interface FormFieldProps {
    dataObjectProperty: string
    pValue?: string
    titleSingular: string
    fieldValue?: string
    handleChange?: () => void
    fieldLabel: string
}

const FormFieldNumberInput: FC<FormFieldProps> = ({
    dataObjectProperty,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    fieldLabel,
}) => (
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
                data-testid={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
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

export default FormFieldNumberInput
