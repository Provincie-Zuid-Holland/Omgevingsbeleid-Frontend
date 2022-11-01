import { AngleLeft } from '@pzh-ui/icons'
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
    url?: string
    onClick?: () => void
}

const ButtonBackToPage = ({
    terugNaar,
    color,
    url,
    onClick,
}: ButtonBackToPageProps) => {
    if (!color) {
        color =
            'text-pzh-blue opacity-75 hover:opacity-100 transition-opacity ease-in duration-100'
    }

    if (!url) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${color} text-l mb-4 inline-block`}>
                <AngleLeft className="mr-2 -mt-[2px] inline-block" />
                <span>Terug naar {terugNaar}</span>
            </button>
        )
    } else {
        return (
            <Link to={url} className={`${color} text-l mb-4 inline-block`}>
                <AngleLeft className="mr-2 -mt-[2px] inline-block" />
                <span>Terug naar {terugNaar}</span>
            </Link>
        )
    }
}

export default ButtonBackToPage
