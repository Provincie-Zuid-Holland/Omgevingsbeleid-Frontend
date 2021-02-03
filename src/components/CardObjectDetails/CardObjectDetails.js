import React from 'react'
import { Link } from 'react-router-dom'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import ContainerAnimateContent from './../ContainerAnimateContent'

/**
 * Function that adds a ... to the text when text total accedes a fixed amount of characters.
 *
 * @function
 *
 * @param {string} tekst - Amount of characters where the function checks if the amount accedes fixed amount of characters.
 */
function getExcerptIfNeeded(tekst) {
    if (tekst.length > 100) {
        return tekst.substr(0, 100) + '...'
    } else {
        return tekst
    }
}

/**
 * Component that renders a animated container content with
 *
 * @component
 *
 * @param {int} ID - Parameter that is not used within this function.
 * @param {object} object - Parameter used for its values within this function.
 * @param {string} overzichtSlug - Parameter that is not used within this function.
 * @param {string} titelEnkelvoud - Parameter that displays the title of the CardObjectItem.
 * @param {string} hoofdOnderdeelSlug - Parameter that is used in the URL link.
 * @param {string} hideParagraaf - Parameter that if set to true, a paragraf may be hidden on the animated container.
 * @param {int} index - Parameter that is used in the URL link.
 */
function CardObjectItem({
    ID,
    object,
    overzichtSlug,
    titleSingular,
    hoofdOnderdeelSlug,
    hideParagraaf,
    index,
}) {
    return (
        <ContainerAnimateContent>
            <Link
                className="relative inline-block w-full h-full px-4 pt-4 pb-6 overflow-hidden bg-white rounded shadow-md"
                to={`/muteer/${hoofdOnderdeelSlug}/${object.ID}`}
                id={`object-card-${titleSingular.toLowerCase()}-${index}`}
            >
                <h5 className="py-1 text-sm font-light text-gray-600">
                    {titleSingular}
                </h5>
                <h2 className="text-xl font-bold text-gray-800">
                    {object.Titel}
                </h2>
                <p className="pr-4 text-base text-gray-700">
                    {object.Omschrijving !== undefined && hideParagraaf !== true
                        ? getExcerptIfNeeded(object.Omschrijving)
                        : null}
                    {object.Motivering !== undefined && hideParagraaf !== true
                        ? getExcerptIfNeeded(object.Motivering)
                        : null}
                </p>
                <span className="absolute bottom-0 right-0 object-left-top w-8 h-10 font-bold text-gray-400">
                    <FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
                </span>
            </Link>
        </ContainerAnimateContent>
    )
}

export default CardObjectItem
