import { faAngleLeft } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

/**
 * Displays a button link which brings the user to a previous page.
 *
 * @param {string} terugNaar - Contains the title of the previous page.
 * @param {string} color - Contains the default color style properties of the button link.
 * @param {string} url - Contains the URL location where the button link is linked to.
 */

interface ButtonBackToPageProps {
    terugNaar: string
    color?: string
    url: string
}

const ButtonBackToPage = ({ terugNaar, color, url }: ButtonBackToPageProps) => {
    if (!color) {
        color =
            'text-pzh-blue opacity-75 hover:opacity-100 transition-opacity ease-in duration-100'
    }
    return (
        <Link to={url} className={`${color} text-l mb-4 inline-block`}>
            <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
            <span>Terug naar {terugNaar}</span>
        </Link>
    )
}

export default ButtonBackToPage
