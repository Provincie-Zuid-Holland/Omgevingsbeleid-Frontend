import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Component that renders the LoaderSmallSpan component, which loads a rectangle shape before the smallSpan component is displayed.
 */
const LoaderSmallSpan = () => (
    <ContentLoader className="w-20 inline-block mb-6" width="50" height="8">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderSmallSpan
