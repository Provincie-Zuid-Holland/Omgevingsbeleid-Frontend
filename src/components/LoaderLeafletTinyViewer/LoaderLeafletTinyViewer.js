import React from 'react'
import ContentLoader from 'react-content-loader'

/**
 * Component that sets the props for the ContentLoader and generates a Tiny viewer version of the Leaflet.
 *
 * @component
 */
const LoaderLeafletTinyViewer = () => (
    <ContentLoader
        speed={2}
        primarycolor="#f3f3f3"
        secondarycolor="#ecebeb"
        className="w-full h-full"
    >
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderLeafletTinyViewer
