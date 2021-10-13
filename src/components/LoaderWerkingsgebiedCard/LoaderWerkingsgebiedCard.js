import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Displays a rectangle shape before the werkingsgebiedCard component is displayed.
 */
const LoaderWerkingsgebiedCard = () => (
    <span className="inline-block w-1/2 p-4">
        <ContentLoader className="w-full" width="400" height="200">
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
        </ContentLoader>
    </span>
)

export default LoaderWerkingsgebiedCard
