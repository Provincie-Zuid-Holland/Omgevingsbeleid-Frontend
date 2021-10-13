import React from "react"

// Import Icons
import { faSpinner } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

/**
 * A rotating spinner icon
 */
function LoaderSpinner() {
    return <FontAwesomeIcon className="rotate-icon" icon={faSpinner} />
}

export default LoaderSpinner
