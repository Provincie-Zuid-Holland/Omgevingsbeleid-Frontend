import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Displays a rectangle shape before the component is displayed.
 */
const LoaderCard = ({ height = "50", mb = "mb-6", className = "" }) => (
    <ContentLoader
        className={`w-full ${mb} ${className}`}
        width="400"
        height={height}
    >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderCard
