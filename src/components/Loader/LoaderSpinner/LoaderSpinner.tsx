// Import Icons
import { faSpinner } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * A rotating spinner icon
 */
function LoaderSpinner({ className = '' }) {
    return (
        <FontAwesomeIcon
            className={`rotate-icon ${className}`}
            icon={faSpinner}
        />
    )
}

export default LoaderSpinner
