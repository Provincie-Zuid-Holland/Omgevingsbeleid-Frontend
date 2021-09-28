import React from "react"
import { Link } from "react-router-dom"
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ContainerAnimateContent from "./../ContainerAnimateContent"

/**
 * @param {Object} object - The object we want to display
 * @param {string} titleSingular - Singular title of object type
 * @param {string} hoofdOnderdeelSlug - Slug for the overview of the type
 * @param {undefined|number} index - Can contain an index if the Component is used in a .map()
 * @param {boolean} mijnBeleid - If true add hash to the detailPageLink
 * @returns A component that displays the type and title on an object and links to its detail ID page
 */
function CardObjectDetails({
    object,
    titleSingular,
    hoofdOnderdeelSlug,
    index,
    mijnBeleid,
}) {
    const elementID =
        index === 0 || index
            ? `object-card-${titleSingular.toLowerCase()}-${index}`
            : `object-card-${titleSingular.toLowerCase()}`

    const detailPageLink = `/muteer/${hoofdOnderdeelSlug}/${object.ID}${
        mijnBeleid ? "#mijn-beleid" : ""
    }`

    return (
        <ContainerAnimateContent>
            <Link
                className={`relative w-full inline-block h-full px-4 pt-4 pb-6 overflow-hidden bg-white rounded shadow-md`}
                to={detailPageLink}
                id={elementID}
            >
                <h5 className="py-1 text-sm font-light text-gray-600">
                    {titleSingular}
                </h5>
                <h2 className="text-xl font-bold text-gray-800">
                    {object.Titel}
                </h2>
                <span className="absolute bottom-0 right-0 object-left-top w-8 h-10 font-bold text-gray-400">
                    <FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
                </span>
            </Link>
        </ContainerAnimateContent>
    )
}

export default CardObjectDetails
