import React from 'react'
import { Link } from 'react-router-dom'

function ButtonAddNewObject({
    overzichtSlug,
    createNewSlug,
    objectAantal,
    hoofdOnderdeelSlug,
    fullWidth,
    titelEnkelvoud,
}) {
    return (
        <div
            className={`mb-6 display-inline mb-6 display-inline
                ${
                    objectAantal % 2 !== 0 || fullWidth === true
                        ? ' w-full'
                        : ' w-1/2'
                }`}
        >
            <Link
                id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                className="h-full flex items-center justify-center no-underline px-4 py-4 border border-gray-300 hover:border-gray-400 border-dashed rounded  overflow-hidden transition-regular text-gray-600 hover:text-gray-800"
                to={`/muteer/${hoofdOnderdeelSlug}/${createNewSlug}`}
            >
                <span className="text-center font-semibold py-2 px-4">
                    + Voeg {titelEnkelvoud} Toe
                </span>
            </Link>
        </div>
    )
}

export default ButtonAddNewObject
