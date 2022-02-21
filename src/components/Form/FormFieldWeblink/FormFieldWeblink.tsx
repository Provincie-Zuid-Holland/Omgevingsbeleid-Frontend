import { ChangeEvent } from 'react'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'

/**
 * Displays a web link input component under the FormFieldTitelEnBeschrijving component.
 */

interface FormFieldWeblinkProps {
    fieldLabel: string
    pValue: string
    disabled?: boolean
    fieldValue: string
    handleChange: (event: ChangeEvent) => void
    titleSingular: string
    dataObjectProperty: string
}

const FormFieldWeblink = ({
    fieldLabel,
    pValue,
    disabled,
    fieldValue,
    handleChange,
    titleSingular,
    dataObjectProperty,
}: FormFieldWeblinkProps) => (
    <div className="flex flex-wrap mb-6 -mx-3">
        <div className="w-full px-3">
            <FormFieldTitelEnBeschrijving
                fieldLabel={fieldLabel}
                pValue={pValue}
                disabled={disabled}
            />
            <input
                type="text"
                value={fieldValue || ''}
                onChange={handleChange}
                name="Weblink"
                className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                placeholder={fieldLabel}
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                disabled={disabled}
            />
        </div>
    </div>
)

export default FormFieldWeblink
