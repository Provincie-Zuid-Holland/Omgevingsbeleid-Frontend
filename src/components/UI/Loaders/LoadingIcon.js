import React from 'react'

// Import Icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function LoadingIcon() {
    return <FontAwesomeIcon className="rotate-icon mr-2" icon={faSpinner} />
}

export default LoadingIcon
