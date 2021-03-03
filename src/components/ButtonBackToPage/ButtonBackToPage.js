import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Component that renders a link and a button element that navigates the user to the previous page.
 *
 * @component
 *
 * @param {string} terugNaar - Parameter that displays the previous page on the rendered button element.
 * @param {string} color - Parameter that sets the color of the rendereed button element that is used to go back.
 * @param {string} url - Parameter that sets the previous url page where the user goes back to.
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
