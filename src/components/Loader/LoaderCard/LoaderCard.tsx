import ContentLoader from 'react-content-loader'

/**
 * Displays a rectangle shape before the component is displayed.
 */
const LoaderCard = ({
    height = '50',
    width = '400',
    mb = 'mb-6',
    className = 'w-full',
}) => (
    <ContentLoader
        className={`${mb} ${className}`}
        width={width}
        height={height}>
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderCard
