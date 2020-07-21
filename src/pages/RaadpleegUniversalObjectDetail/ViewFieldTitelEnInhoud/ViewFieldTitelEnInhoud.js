import React from 'react'

function ViewFieldTitelEnInhoud(props) {
    if (!props.fieldValue) {
        return (
            <div className="mb-6">
                <h2 className="block mb-2 font-serif text-lg tracking-wide text-gray-700">
                    {props.fieldTitel}
                </h2>
                <p className={`text-gray-700 text-sm mb-4 italic`}>
                    Er is nog geen inhoud
                </p>
            </div>
        )
    }

    // Split on \n new lines
    const arrayOfParagraphs = props.fieldValue.split(/\r?\n/g)

    return (
        <div className="mb-6">
            <h2 className="block mb-2 font-serif text-lg tracking-wide text-gray-700">
                {props.fieldTitel}
            </h2>
            {arrayOfParagraphs.map((item, index) => (
                <p
                    key={index}
                    className={`text-gray-700 break-words text-sm ${
                        index === arrayOfParagraphs.length ? 'mb-4' : 'mb-2'
                    }`}
                >
                    {item}
                </p>
            ))}
        </div>
    )
}

export default ViewFieldTitelEnInhoud
