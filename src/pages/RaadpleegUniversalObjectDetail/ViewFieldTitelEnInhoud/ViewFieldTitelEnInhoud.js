import React from 'react'

function ViewFieldTitelEnInhoud({ fieldValue, fieldTitel }) {
    return (
        <div className="mb-8">
            <h2 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                {fieldTitel}
            </h2>
            <p
                className={`text-gray-800 leading-7 break-words w-full whitespace-pre-line ${
                    !fieldValue ? 'italic' : ''
                }`}
            >
                {!fieldValue ? 'Er is nog geen inhoud' : fieldValue}
            </p>
        </div>
    )
}

export default ViewFieldTitelEnInhoud
