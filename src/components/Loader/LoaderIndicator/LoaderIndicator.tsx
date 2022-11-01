import { Spinner } from '@pzh-ui/icons'
import classNames from 'classnames'

interface LoaderIndicatorProps {
    text?: string
}

function LoaderIndicator({ text }: LoaderIndicatorProps) {
    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen pointer-events-none">
            <div className="p-4 text-gray-600 bg-white rounded shadow-lg">
                <Spinner
                    className={classNames(`inline-block animate-spin`, {
                        'mr-3': text,
                    })}
                />
                {text && <span>{text}</span>}
            </div>
        </div>
    )
}

export default LoaderIndicator
