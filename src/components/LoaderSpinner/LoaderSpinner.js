import React from 'react'

// Import Icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Component that returns the FontAwesomeIcon spinner and is imported by other components.
 *
 * @component
 */
function LoaderSpinner() {
    return <FontAwesomeIcon className="rotate-icon" icon={faSpinner} />
}

export default LoaderSpinner
