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
function getExcerpt(tekst) {
    if (tekst.length > 100) {
        return tekst.substr(0, 100) + '...'
    } else {
        return tekst
    }
}

/**
 * Component that renders the ContainerAnimateContent component that is used within the rendered CardObjectDetailsHalfWidth Component.
 *
 * @component
 *
 * @param {object} object - Parameter containing a collection of values used within the component for the link element, in conditional operators and to display the value.
 * @param {string} overzichtSlug - Parameter that is used as the main category within a url.
 * @param {string} titleSingular - Parameter that is used within a url and in a element.
 * @param {boolean} hideParagraaf - Parameter that can be set true to hide the paragraaf.
 * @param {boolean} fullWidth - Parameter that can be set true or false depending if the width full or half is used.
 * @param {int} index - Parameter that is used as the index for the ID of the link within the CardObjectItem component.
 * @param {boolean} mijnBeleid - Parameter that is used to show the user his/her beleid object otherwise it will just show the base url.
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
                <h5 className="py-1 text-sm font-light text-gray-600">
                    {titleSingular}
                </h5>
                <h2 className="text-xl font-bold text-gray-800">
                    {object.Titel}
                </h2>
                <p className="pr-4 text-base text-gray-700">
                    {object.Omschrijving !== undefined && hideParagraaf !== true
                        ? getExcerpt(object.Omschrijving)
                        : null}
                    {object.Motivering !== undefined && hideParagraaf !== true
                        ? getExcerpt(object.Motivering)
                        : null}
                </p>
                <span className="absolute bottom-0 right-0 object-left-top w-8 h-10 font-bold text-gray-400">
                    <FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
                </span>
            </Link>
        </ContainerAnimateContent>
    )
}

export default CardObjectDetailsHalfWidth
