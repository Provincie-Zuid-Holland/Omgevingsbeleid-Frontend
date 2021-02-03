import React from 'react'

function FormFieldTitelEnBeschrijving(props) {
    return (
        <React.Fragment>
            <h3 className="block mb-2 font-bold tracking-wide text-gray-700">
                {props.fieldLabel ? props.fieldLabel : null}
            </h3>
            <p className="mb-4 text-sm text-gray-700">
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
