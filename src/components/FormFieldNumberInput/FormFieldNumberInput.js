import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

/**
 * Component that renders the FormFieldNumberInput with the imported FormFieldTitelEnBeschrijving component within, that displays the Titel and description of the formfield, based on the props given to the external component.
 * Furthermore the component accepts input from the user and updates the value based on user input.
 *
 * @component
 *
 * @param {string} dataObjectProperty - Parameter that may contain the string 'Eind_Geldigheid' and is used within this function to assign the dataObjectProperty variable for the imported FormFieldTitelEnBeschrijving and is used to assign the name and part of the id variable for the input element.
 * @param {string} pValue - Parameter that is used within this function to assign the pValue variable for the imported FormFieldTitelEnBeschrijving.
 * @param {string} titleSingular - Parameter that is used within this function to assign the titleSingular variable for the imported FormFieldTitelEnBeschrijving and is used as part of the id for the input element.
 * @param {string} fieldValue - Parameter that is used within this function in a conditional operator to set the value to the value variable of the input element.
 * @param {boolean} handleChange - Parameter that is used within this function to set the onChange variable to true if the input element has been changed.
 * @param {string} fieldLabel - Parameter that contains the value for the imported FormFieldTitelEnBeschrijving component variable fieldLabel.
 */
const FormFieldNumberInput = ({
    dataObjectProperty,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    fieldLabel,
}) => {
    return (
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
}

export default FormFieldNumberInput
