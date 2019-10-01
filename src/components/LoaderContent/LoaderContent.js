import React from 'react'

// Import Icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function LoaderContent() {
    return (
        <div className="fixed flex justify-center items-center w-screen h-screen top-0 z-50">
            <div className="bg-white rounded p-4 text-gray-600 shadow-lg">
                <FontAwesomeIcon
                    className="rotate-icon mr-2"
                    icon={faSpinner}
                />
                <span className="ml-1">Laden...</span>
            </div>
        </div>
    )
}

export default LoaderContent
