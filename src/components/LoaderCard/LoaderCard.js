import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Component that renders the LoaderCard component, which loads a rectangle shape before a component is displayed.
 */
const LoaderCard = ({ height = "50" }) => (
    <ContentLoader className="w-full mb-6" width="400" height={height}>
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderCard
