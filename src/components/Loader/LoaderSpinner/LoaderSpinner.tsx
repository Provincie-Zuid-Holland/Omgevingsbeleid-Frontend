import { Spinner } from '@pzh-ui/icons'

/**
 * A rotating spinner icon
 */
function LoaderSpinner({ className = '' }) {
    return <Spinner className={`animate-spin inline-block ${className}`} />
}

export default LoaderSpinner
