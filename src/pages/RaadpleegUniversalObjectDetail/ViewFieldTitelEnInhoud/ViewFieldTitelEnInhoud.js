import React from 'react'

function ViewFieldTitelEnInhoud(props) {
    // var enteredText = props.fieldValue
    // var numberOfLineBreaks = (enteredText.match(/\n/g) || []).length
    if (props.fieldValue) {
        const arrayOfParagraphs = props.fieldValue.split(/\r?\n/g)
        // alert('Number of breaks: ' + numberOfLineBreaks)
        return (
            <div className="mb-6">
                <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                    {props.fieldTitel}
                </h2>
                {arrayOfParagraphs.map((item, index) => (
                    <p
                        className={`text-gray-700 text-sm ${
                            index === arrayOfParagraphs.length ? 'mb-4' : 'mb-2'
                        }`}
                    >
                        {item}
                    </p>
                ))}
            </div>
        )
    } else {
        return (
            <div className="mb-6">
                <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                    {props.fieldTitel}
                </h2>
                <p className={`text-gray-700 text-sm mb-4 italic`}>
                    Er is nog geen inhoud
                </p>
            </div>
        )
    }
}

export default ViewFieldTitelEnInhoud
