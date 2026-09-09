import { Spinner } from '@pzh-ui/icons'

/**
 * A rotating spinner icon
 */
function LoaderSpinner({ className = '' }) {
    return (
        <Spinner
            className={`inline-block animate-spin ${className}`}
            data-testid="loader-spinner"
        />
    )
}

export default LoaderSpinner
