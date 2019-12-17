import React from 'react'
import { Link } from 'react-router-dom'

function ButtonAddNewObject(props) {
    const overzichtSlug = props.overzichtSlug
    const createNewSlug = props.createNewSlug
    const objectAantal = props.objectAantal
    const hoofdOnderdeelSlug = props.hoofdOnderdeelSlug
    const fullWidth = props.fullWidth
    const apiTest = props.apiTest

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
                    + Voeg {props.titelEnkelvoud} Toe
                </span>
            </Link>
        </div>
    )
}

export default ButtonAddNewObject
