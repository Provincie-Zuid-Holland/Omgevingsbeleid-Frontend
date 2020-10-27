import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function ButtonAddNewObject({
    createNewSlug,
    hoofdOnderdeelSlug,
    titelEnkelvoud,
}) {
    return (
        <div className={`mb-6 display-inline display-inline w-full`}>
            <Link
                id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                className="flex items-center justify-center h-full px-4 py-4 overflow-hidden text-gray-600 no-underline border border-gray-300 border-dashed rounded hover:border-gray-400 transition-regular hover:text-gray-800"
                to={`/muteer/${hoofdOnderdeelSlug}/${createNewSlug}`}
            >
                <span className="px-4 py-2 font-semibold text-center">
                    + Voeg {titelEnkelvoud} Toe
                </span>
            </Link>
        </div>
    )
}

ButtonAddNewObject.propTypes = {
    createNewSlug: PropTypes.string.isRequired,
    hoofdOnderdeelSlug: PropTypes.string.isRequired,
    titelEnkelvoud: PropTypes.string.isRequired,
}

export default ButtonAddNewObject
