import { ChangeEventHandler } from 'react'

import isSafari from '@/utils/isSafari'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'

interface FormFieldDateProps {
    fieldValue: string
    disabled?: boolean
    dataObjectProperty: string
    fieldLabel: string
    pValue: string
    titleSingular: string
    handleChange: ChangeEventHandler
}

function FormFieldDate({
    fieldValue,
    disabled,
    dataObjectProperty,
    fieldLabel,
    pValue,
    titleSingular,
    handleChange,
}: FormFieldDateProps) {
    /**
     * The standard dates are created in the back-end
     * To keep the UI clean we return an empty string
     */
    const parseFieldValue = (value: string) => {
        const standardDates = ['1753-01-01', '10000-01-01']
        if (!value || standardDates.includes(value)) return ''
        return value
    }

    return (
        <div className="w-full mb-6">
            <FormFieldTitelEnBeschrijving
                disabled={disabled}
                fieldLabel={fieldLabel}
                pValue={pValue}
            />
            <input
                disabled={disabled}
                placeholder={isSafari ? 'jjjj-mm-dd' : 'dd-mm-jjjj'}
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
