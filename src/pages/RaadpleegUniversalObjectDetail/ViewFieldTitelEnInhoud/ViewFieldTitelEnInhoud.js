import React from 'react'

function ViewFieldTitelEnInhoud(props) {
    return (
        <div className="mb-6">
            <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                {props.fieldTitel}
            </h2>
            <p className="text-gray-700 text-sm mb-4">{props.fieldValue}</p>
        </div>
    )
}

export default ViewFieldTitelEnInhoud
