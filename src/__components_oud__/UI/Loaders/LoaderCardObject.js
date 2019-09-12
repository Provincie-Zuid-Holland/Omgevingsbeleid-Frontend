import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderSmallLeaflet = () => (
    <ContentLoader className="w-full mb-6" width="400" height="50">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderSmallLeaflet
