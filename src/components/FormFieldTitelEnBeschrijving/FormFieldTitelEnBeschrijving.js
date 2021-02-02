import React from 'react'

/**
 * Component that renders the FormFieldTitelEnBeschrijving.
 *
 * @component
 *
 * @param {props} props - Parameter that is used to display data within the FormFieldTitelEnBeschrijving function.
 */
function FormFieldTitelEnBeschrijving(props) {
    let pValue = props.pValue
    if (props.disabled) {
        pValue = pValue + ' (Kan niet zonder besluitvorming worden gewijzigd)'
    }
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default FormFieldTitelEnBeschrijving
