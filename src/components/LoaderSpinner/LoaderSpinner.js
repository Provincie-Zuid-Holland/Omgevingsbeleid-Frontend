import React from 'react'

// Import Icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Component that renders the LoaderSpinner component, which displays a rotating spinner icon.
 */
function LoaderSpinner() {
    return <FontAwesomeIcon className="rotate-icon" icon={faSpinner} />
}

export default LoaderSpinner
