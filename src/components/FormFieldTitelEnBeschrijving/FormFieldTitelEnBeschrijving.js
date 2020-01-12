import React from 'react'

function FormFieldTitelEnBeschrijving(props) {
    return (
        <React.Fragment>
            <h3 className="block tracking-wide text-gray-700 font-bold mb-2">
                {props.fieldLabel ? props.fieldLabel : null}
            </h3>
            <p className="text-gray-700 text-sm mb-4">
                {props.pValue ? `${props.pValue} ` : ''}
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
