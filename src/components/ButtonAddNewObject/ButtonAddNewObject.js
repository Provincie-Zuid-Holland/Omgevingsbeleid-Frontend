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
            className={
                objectAantal % 2 !== 0 || fullWidth === true
                    ? 'mb-6 display-inline w-full'
                    : 'mb-6 display-inline w-1/2'
            }
        >
            <Link
                id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                className="h-full flex items-center justify-center no-underline px-4 py-4 border border-dashed rounded overflow-hidden"
                to={`/muteer/${hoofdOnderdeelSlug}/${createNewSlug}`}
            >
                <span className="text-center text-gray-600 font-semibold py-2 px-4">
                    + Voeg {titelEnkelvoud} Toe
                </span>
            </Link>
        </div>
    )
}

export default ButtonAddNewObject
