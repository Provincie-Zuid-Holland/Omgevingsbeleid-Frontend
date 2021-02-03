import React from 'react'
import { Link } from 'react-router-dom'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import ContainerAnimateContent from './../ContainerAnimateContent'

/**
 * Function that adds a ... to the text when text total is more than 100 characters.
 *
 * @function
 * @param {string} tekst amount of text where the function checks if the amount of text does not exceed 100 characters.
 */
function getExcerpt(tekst) {
    if (tekst.length > 100) {
        return tekst.substr(0, 100) + '...'
    } else {
        return tekst
    }
}

/**
 *
 *
 *  @function
 *
 * @param {object} object - Parameter that is used within a url and it's content in the elements.
 * @param {string} overzichtSlug - Parameter that is used within a url.
 * @param {string} titelEnkelvoud - Parameter that is used within a url and in a element.
 * @param {boolean} hideParagraaf - Boolean that can be true of false, depending if the paragraaf needs to be hidden or shown.
 * @param {boolean} fullWidth - Parameter that can be set true or false depending if the width full is used or with half.
 * @param {int} index - Index of card object.
 * @param {boolean} mijnBeleid - Parameter that can be set to true or false to show a certain string.
 */
function CardObjectDetailsHalfWidth({
    object,
    overzichtSlug,
    titleSingular,
    hideParagraaf,
    fullWidth,
    index,
    mijnBeleid,
}) {
    return (
        <ContainerAnimateContent>
            <Link
                className={`relative inline-block h-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white ${
                    fullWidth ? 'w-full' : 'w-1/2'
                }`}
                id={`object-card-${titleSingular.toLowerCase()}-${index}`}
                to={`/muteer/${overzichtSlug}/${object.ID}${
                    mijnBeleid ? '#mijn-beleid' : ''
                }`}
            >
                <h5 className="text-gray-600 text-sm font-light py-1">
                    {titleSingular}
                </h5>
                <h2 className="text-xl font-bold text-gray-800">
                    {object.Titel}
                </h2>
                <p className="text-gray-700 text-base pr-4">
                    {object.Omschrijving !== undefined && hideParagraaf !== true
                        ? getExcerpt(object.Omschrijving)
                        : null}
                    {object.Motivering !== undefined && hideParagraaf !== true
                        ? getExcerpt(object.Motivering)
                        : null}
                </p>
                <span className="bottom-0 right-0 absolute font-bold w-8 h-10 text-gray-400 object-left-top">
                    <FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
                </span>
            </Link>
        </ContainerAnimateContent>
    )
}

export default CardObjectDetailsHalfWidth
