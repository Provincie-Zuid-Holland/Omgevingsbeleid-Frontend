import React from 'react'
import { Link } from 'react-router-dom'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import ContainerAnimateContent from './../ContainerAnimateContent'

function getExcerpt(tekst) {
    if (tekst.length > 100) {
        return tekst.substr(0, 100) + '...'
    } else {
        return tekst
    }
}

function CardObjectDetailsHalfWidth({
    object,
    overzichtSlug,
    titelEnkelvoud,
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
                id={`object-card-${titelEnkelvoud.toLowerCase()}-${index}`}
                to={`/muteer/${overzichtSlug}/${object.ID}${
                    mijnBeleid ? '#mijn-beleid' : ''
                }`}
            >
                <h5 className="text-gray-600 text-sm font-light py-1">
                    {titelEnkelvoud}
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
