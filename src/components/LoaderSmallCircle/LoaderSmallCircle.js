import React from 'react'
import ContentLoader from 'react-content-loader'

/**
 * Component that renders the LoaderSmallCircle component, which loads a rectangle shape before the smallCircle component is displayed.
 */
const LoaderSmallCircle = () => (
    <ContentLoader className="inline-block w-8 h-8 mr-1" width="50" height="8">
        <rect x="0" y="0" rx="100" ry="100" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderSmallCircle
