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
        <li
            className={
                objectAantal % 2 !== 0 || fullWidth === true
                    ? 'mb-6 display-inline w-full'
                    : 'mb-6 display-inline w-1/2'
            }
        >
            <Link
                className="h-full flex items-center justify-center no-underline px-4 py-4 border border-dashed rounded overflow-hidden"
                to={
                    apiTest === true
                        ? `/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/${createNewSlug}`
                        : `/muteer/${hoofdOnderdeelSlug}/${createNewSlug}`
                }
            >
                <span className="text-center text-gray-600 font-semibold py-2 px-4">
                    + Voeg {props.titelEnkelvoud} Toe
                </span>
            </Link>
        </li>
    )
}

export default ButtonAddNewObject
