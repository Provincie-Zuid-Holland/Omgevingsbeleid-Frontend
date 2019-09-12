import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderSelect = () => (
    <ContentLoader className="h-16" width="90%" height="40">
        <rect x="0" y="0" rx="5" ry="5" width="90%" height="35" />
    </ContentLoader>
)

export default LoaderSelect
