import { Spinner } from '@pzh-ui/icons'

interface LoaderSavingProps {
    text?: string
}

function LoaderIndicator({ text }: LoaderSavingProps) {
    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen pointer-events-none">
            <div className="p-4 text-gray-600 bg-white rounded shadow-lg">
                <Spinner className="inline-block mr-2 animate-spin" />
                {text && <span className="ml-1">Opslaan...</span>}
            </div>
        </div>
    )
}

export default LoaderIndicator
