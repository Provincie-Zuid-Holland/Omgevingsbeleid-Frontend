import React from 'react'
import { Link } from 'react-router-dom'

// Import Icons
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Functions
import getExcerpt from './../Functions/getExcerpt'

function CardObjectItem(props) {
    const object = props.object
    const overzichtSlug = props.overzichtSlug
    const titelEnkelvoud = props.titelEnkelvoud
    const hoofdOnderdeelSlug = props.hoofdOnderdeelSlug
    const apiTest = props.apiTest
    const hideParagraaf = props.hideParagraaf

    return (
        <Link
            className="relative inline-block h-full w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white"
            to={
                apiTest === true
                    ? `/${hoofdOnderdeelSlug}/${overzichtSlug}/${object.ID}`
                    : `/${hoofdOnderdeelSlug}/${object.ID}`
            }
        >
            <h5 className="text-gray-600 text-sm font-light py-1">
                {titelEnkelvoud}
            </h5>
            <h2 className="text-xl font-bold text-gray-800">
                {object.Titel}
                {console.log(hideParagraaf)}
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
    )
}

export default CardObjectItem
