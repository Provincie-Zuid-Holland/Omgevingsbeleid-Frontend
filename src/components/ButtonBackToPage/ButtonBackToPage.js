import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ButtonBackToPage = ({ terugNaar, color, url }) => {
    if (!color) {
        color =
            'text-pzh-blue opacity-75 hover:opacity-100 transition-opacity ease-in duration-100'
    }
    return (
        <Link
            to={url}
            className={`${color} text-l mb-4 inline-block`}
            id="button-back-to-previous-page"
        >
            <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
            <span>Terug naar {terugNaar}</span>
        </Link>
    )
}

export default withRouter(ButtonBackToPage)
