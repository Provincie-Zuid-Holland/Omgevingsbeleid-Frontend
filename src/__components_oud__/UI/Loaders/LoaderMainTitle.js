import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderMainTitle = () => (
    <ContentLoader className="w-24 mb-6 inline-block" width="50" height="10">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderMainTitle
