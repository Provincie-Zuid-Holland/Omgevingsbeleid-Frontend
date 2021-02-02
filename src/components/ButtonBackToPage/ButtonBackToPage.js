import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Component that creates a button to the previous page.
 *
 * @component
 *
 * @param {string} terugNaar - Parameter that is used to send the user to the previous page.
 * @param {string} color - The color of the button that is used to go back.
 * @param {string} url - The url of the previous page.
 */
const ButtonBackToPage = ({ terugNaar, color, url }) => {
    if (!color) {
        color = 'text-gray-600'
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
