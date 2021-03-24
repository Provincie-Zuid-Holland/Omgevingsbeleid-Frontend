import React from 'react'

// Import Icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function LoaderSpinner({ className }) {
    return (
        <FontAwesomeIcon
            className={`rotate-icon ${className ? className : ''}`}
            icon={faSpinner}
        />
    )
}

export default LoaderSpinner
