import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderLeafletTinyViewer = () => (
    <ContentLoader
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        className="h-full w-full"
    >
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderLeafletTinyViewer
