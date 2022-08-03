import { Spinner } from '@pzh-ui/icons'

/**
 * Displays a rotating spinner icon with the text "Opslaan..." underneath it when saving process is active.
 */
function LoaderSaving() {
    return (
        <div className="fixed flex justify-center items-center w-screen h-screen pointer-events-none left-0 top-0 z-50">
            <div className="bg-white rounded p-4 text-gray-600 shadow-lg">
                <Spinner className="animate-spin mr-2 inline-block" />
                <span className="ml-1">Opslaan...</span>
            </div>
        </div>
    )
}

export default LoaderSaving
