import React from "react"

// Import Icons
import { faSpinner } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

/**
 * Displays a rotating spinner icon with the text "Opslaan..." underneath it when saving process is active.
 */
function LoaderSaving() {
    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen pointer-events-none">
            <div className="p-4 text-gray-600 bg-white rounded shadow-lg">
                <FontAwesomeIcon
                    className="mr-2 rotate-icon"
                    icon={faSpinner}
                />
                <span className="ml-1">Opslaan...</span>
            </div>
        </div>
    )
}

export default LoaderSaving
