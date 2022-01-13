import ContentLoader from 'react-content-loader'

/**
 * Displays a rectangle at half width based on the parameters given before the component is displayed.
 */

interface LoaderCardProps {
    mr?: boolean
}

const LoaderCardHalfWidth = ({ mr }: LoaderCardProps) => (
    <ContentLoader
        className={`w-1/2 mb-6 ${mr ? 'mr-6' : ''}`}
        width="400"
        height="150">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderCardHalfWidth
