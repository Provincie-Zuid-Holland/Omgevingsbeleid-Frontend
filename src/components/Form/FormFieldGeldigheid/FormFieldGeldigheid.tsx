import { ChangeEventHandler, MouseEventHandler, useState } from 'react'

import isSafari from '@/utils/isSafari'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'

interface FormFieldGeldigheidProps {
    fieldValue?: string
    disabled?: boolean
    dataObjectProperty: string
    fieldLabel: string
    pValue?: string
    titleSingular: string
    hideToggleUitwerkingstrede?: boolean
    openUitwerkingstrede?: boolean
    handleChange?: ChangeEventHandler
}

const FormFieldGeldigheid = ({
    dataObjectProperty,
    hideToggleUitwerkingstrede,
    openUitwerkingstrede,
    fieldValue,
    disabled,
    titleSingular,
    pValue,
    fieldLabel,
    handleChange,
}: FormFieldGeldigheidProps) => {
    const [toonUitwerkingTreding, setToonUitwerkingTreding] = useState(
        fieldValue !== '' || openUitwerkingstrede
    )

    /**
     * The standard dates are created in the back-end
     * To keep the UI clean we return an empty string
     */
    const getFieldValue = (value: string) => {
        const standardDates = ['1753-01-01', '10000-01-01']
        if (standardDates.includes(value)) return ''
        return value
    }

    const toggleUitwerkingTreding = () => {
        setToonUitwerkingTreding(!toonUitwerkingTreding)
    }

    const tranformedFieldValue = getFieldValue(fieldValue || '')

    if (dataObjectProperty === 'Eind_Geldigheid') {
        return (
            <EindGeldigheid
                hideToggleUitwerkingstrede={hideToggleUitwerkingstrede}
                toggleUitwerkingTreding={toggleUitwerkingTreding}
                toonUitwerkingTreding={toonUitwerkingTreding}
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titleSingular={titleSingular}
                fieldValue={tranformedFieldValue}
                handleChange={handleChange}
                disabled={disabled}
            />
        )
    }

    return (
        <BeginGeldigheid
            dataObjectProperty={dataObjectProperty}
            fieldLabel={fieldLabel}
            pValue={pValue}
            titleSingular={titleSingular}
            fieldValue={tranformedFieldValue}
            handleChange={handleChange}
            disabled={disabled}
        />
    )
}

function BeginGeldigheid({
    dataObjectProperty,
    fieldLabel,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    disabled,
}: FormFieldGeldigheidProps) {
    return (
        <div className="w-full px-3 mb-6">
            <FormFieldTitelEnBeschrijving
                disabled={disabled}
                fieldLabel={fieldLabel}
                pValue={pValue}
            />
            <input
                disabled={disabled}
                placeholder={isSafari ? 'jjjj-mm-dd' : 'dd-mm-jjjj'}
                value={fieldValue ? fieldValue : ''}
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

/**
 * Function to set the EindGeldigheid based on user input.
 *
 * @param {boolean} hideToggleUitwerkingstrede - Parameter that is used within this function in the conditional operator and if set false, will show the Uitwerkingstrede element.
 * @param {function} toggleUitwerkingTreding - Parameter that is used within this function as a onClick function and in the FormFieldGeldigheid class to set (toggle) the state of toonUitwerkingTreding.
 * @param {string} toonUitwerkingTreding - Parameter that is used within this function in a conditional operator to show/hide text and its state is set (toggled) within the FormFieldGeldigheid class.
 * @param {string} dataObjectProperty - Parameter that may contain the string 'Eind_Geldigheid' and is used within this function to assign the dataObjectProperty variable for the imported FormFieldTitelEnBeschrijving and is used to assign the name and part of the id variable for the input element.
 * @param {string} fieldLabel - Parameter that is used within this function to assign the fieldLabel variable in the imported FormFieldTitelEnBeschrijving component.
 * @param {string} pValue - Parameter that is used within this function to assign the pValue variable in the imported FormFieldTitelEnBeschrijving component.
 * @param {string} titleSingular - Parameter that is used within this function to assign the titleSingular variable for the imported FormFieldTitelEnBeschrijving and is used as part of the id in a conditional operator for the input element.
 * @param {string} fieldValue - Parameter that is used within this function in a conditional operator to set the value to the value variable of the input element.
 * @param {boolean} handleChange - Parameter that is used within this function to set the onChange variable to true if the input element has been changed.
 * @param {boolean} disabled -  Parameter that is used within this function and in the imported FormFieldTitelEnBeschrijving to set the disabled variable, if set true, the input and/or imported FormFieldTitelEnBeschrijving will be disabled.
 */
function EindGeldigheid({
    hideToggleUitwerkingstrede,
    toggleUitwerkingTreding,
    toonUitwerkingTreding,
    dataObjectProperty,
    fieldLabel,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    disabled,
}: FormFieldGeldigheidProps & {
    toggleUitwerkingTreding: MouseEventHandler
    toonUitwerkingTreding?: boolean
}) {
    return (
        <div className="w-full px-3 mb-6">
            {hideToggleUitwerkingstrede ? null : (
                <span
                    className="block w-full mb-6 text-sm text-gray-700 underline cursor-pointer select-none"
                    id="toggle-uitwerkingtreding"
                    onClick={toggleUitwerkingTreding}>
                    {toonUitwerkingTreding ? 'Verberg' : 'Toon'} veld voor
                    uitwerkingtreding
                </span>
            )}

            {toonUitwerkingTreding ? (
                <div className="mb-6">
                    <FormFieldTitelEnBeschrijving
                        fieldLabel={fieldLabel}
                        pValue={pValue}
                        disabled={disabled}
                    />
                    <input
                        disabled={disabled}
                        value={fieldValue ? fieldValue : ''}
                        onChange={handleChange}
                        name={dataObjectProperty}
                        placeholder={isSafari ? 'jjjj-mm-dd' : 'dd-mm-jjjj'}
                        className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:border-gray-500 hover:border-gray-500 focus:outline-none focus:bg-white"
                        type="date"
                        id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                        data-testid={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default FormFieldGeldigheid
