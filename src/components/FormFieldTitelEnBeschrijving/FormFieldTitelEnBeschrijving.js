import React from 'react'

/**
 * Component that renders the FormFieldTitelEnBeschrijving component that is used to display the title and description of the FormField component based on the props given.
 *
 * This component is imported by the following components:
 * FormFieldDate
 * FormFieldNumberInput
 * FormFieldRelatieKoppeling
 * FormFieldSelect
 * FormFieldsExport
 * FormFieldTags
 * FormFieldTextArea
 * FormFieldTextInput
 * FormFieldWeblink
 * FormFieldWerkingsgebiedKoppeling
 * FormFieldWerkingsgebiedrelatie
 *
 * This component is imported by the following page:
 * FormFieldContainerMaatregelen
 *
 * @component
 *
 * @param {props} props - Parameter that contains the value collection of the variables pValue, fieldLabel, anchorText and anchorLink.
 */
function FormFieldTitelEnBeschrijving(props) {
    let pValue = props.pValue
    if (props.disabled) {
        pValue = pValue + ' (Kan niet zonder besluitvorming worden gewijzigd)'
    }
    return (
        <>
            <h3 className="block mb-2 font-bold tracking-wide text-gray-700">
                {props.fieldLabel ? props.fieldLabel : null}
            </h3>
            <p className="mb-4 text-sm text-gray-700">
                {pValue ? `${pValue} ` : ''}
                {props.anchorText ? (
                    <a
                        href={[props.anchorLink]}
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {props.anchorText}
                    </a>
                ) : null}
            </p>
        </>
    )
}

export default FormFieldTitelEnBeschrijving
