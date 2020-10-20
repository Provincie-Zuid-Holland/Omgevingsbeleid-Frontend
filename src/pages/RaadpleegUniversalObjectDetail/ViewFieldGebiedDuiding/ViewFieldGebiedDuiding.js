import React from 'react'

function ViewFieldGebiedDuiding({ gebiedDuiding }) {
    if (!gebiedDuiding) return null
    console.log(typeof gebiedDuiding)
    return (
        <div className="mb-8">
            <p
                className={`text-gray-700 text-sm mt-1 leading-7 break-words w-full whitespace-pre-line`}
            >
                Intentie werkingsgebied: {gebiedDuiding.toLowerCase()}
            </p>
        </div>
    )
}

export default ViewFieldGebiedDuiding
