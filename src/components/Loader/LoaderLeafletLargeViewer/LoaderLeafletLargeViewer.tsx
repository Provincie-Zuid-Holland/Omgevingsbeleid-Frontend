import ContentLoader from 'react-content-loader'

/**
 * Displays a rectangle shape before the LeafletLargeViewer component is displayed.
 */
const LoaderLeafletLargeViewer = () => (
    <ContentLoader
        speed={2}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="w-full h-full"
        id="full-screen-leaflet-container">
        <rect x="0" y="0" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderLeafletLargeViewer
