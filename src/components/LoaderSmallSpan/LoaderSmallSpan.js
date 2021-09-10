import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Displays a rectangle shape before the smallSpan component is displayed.
 */
const LoaderSmallSpan = () => (
    <ContentLoader className="inline-block w-20 mb-6" width="50" height="8">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderSmallSpan
