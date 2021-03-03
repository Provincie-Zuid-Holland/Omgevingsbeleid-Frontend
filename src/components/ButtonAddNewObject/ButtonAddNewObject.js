import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

/**
 * Component that renders a Link and button elements that lets the user add a certain new object based on the parameters given.
 *
 * @component
 *
 * @param {string} createNewSlug - Parameter that is part of the link element where the user navigates to.
 * @param {string} hoofdOnderdeelSlug - Parameter that is the main part (categorie) of the link element where the user navigates to.
 * @param {string} titleSingular - Parameter that is part of the text of the button element that is being rendered.
 */
function ButtonAddNewObject({
    createNewSlug,
    hoofdOnderdeelSlug,
    titleSingular,
}) {
    return (
        <div className={`mb-6 display-inline display-inline w-full`}>
            <Link
                id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                className="flex items-center justify-center h-full px-4 py-4 overflow-hidden text-gray-600 no-underline border border-gray-300 border-dashed rounded hover:border-gray-400 transition-regular hover:text-gray-800"
                to={`/muteer/${hoofdOnderdeelSlug}/${createNewSlug}`}
            >
                <span className="px-4 py-2 font-semibold text-center">
                    + Voeg {titleSingular} Toe
                </span>
            </Link>
        </div>
    )
}

ButtonAddNewObject.propTypes = {
    createNewSlug: PropTypes.string.isRequired,
    hoofdOnderdeelSlug: PropTypes.string.isRequired,
    titleSingular: PropTypes.string.isRequired,
}

export default ButtonAddNewObject
