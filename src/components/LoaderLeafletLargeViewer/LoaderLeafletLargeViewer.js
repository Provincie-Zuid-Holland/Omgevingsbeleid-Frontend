import React from 'react'
import ContentLoader from 'react-content-loader'

/**
 * Component that renders the LoaderLeafletLargeViewer component, which loads a rectangle shape before the LeafletLargeViewer component is displayed.
 *
 * @component
 */
const LoaderLeafletLargeViewer = () => (
    <ContentLoader
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        className="h-full w-full"
        id="full-screen-leaflet-container"
    >
        <rect x="0" y="0" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderLeafletLargeViewer
