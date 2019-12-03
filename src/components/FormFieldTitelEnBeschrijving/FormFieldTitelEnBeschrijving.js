import React from 'react'

function FormFieldTitelEnBeschrijving(props) {
    return (
        <React.Fragment>
            <label
                className="block tracking-wide text-gray-700 text-sm font-bold mb-2"
                htmlFor={props.dataObjectProperty}
            >
                {props.fieldLabel ? props.fieldLabel : null}
            </label>
            <p className="text-gray-700 text-sm mb-4">
                {props.pValue ? `${props.pValue} ` : ''}
            </p>
        </React.Fragment>
    )
}

export default FormFieldTitelEnBeschrijving
