import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Displays a rectangle shape before the MainTitle component is displayed.
 */
const LoaderMainTitle = () => (
    <ContentLoader className="block w-20 mt-5 mb-6" width="50" height="10">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderMainTitle
