import React from 'react'
import { Link } from 'react-router-dom'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import ContainerAnimateContent from './../ContainerAnimateContent'

/**
 * Function that adds a ... to the end of the text when text total exceeds a fixed amount of characters.
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
 * Component that renders the imported ContainerAnimateContent component and uses a link and icon within it,
 * that the user can click on it to take the user to a certain link based on the parameters given.
 *
 * @component
 *
 * @param {object} object - Collection of data for the CardObjectItem as an ID for the link element, title text for the h2 tag and used for the conditional (ternary) operator to show or hide the Omschrijving and/or Motivering values.
 * @param {string} titleSingular - Parameter that is part of the id of the link element and is also the title text for the h5 tag of the CardObjectItem.
 * @param {string} hoofdOnderdeelSlug - Parameter that is used as the main part (category) in the URL link.
 * @param {string} hideParagraaf - Parameter that is set to true to hide the Omschrijving and or Motivering of object within the conditional (ternary) operator within the CardObjectItem component.
 * @param {int} index - Parameter that is used as the index for the ID of the link within the CardObjectItem component.
 */
function CardObjectItem({
    object,
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
