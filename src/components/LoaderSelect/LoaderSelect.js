import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Component that renders the LoaderSelect component, which loads a rectangle shape before the Select component is displayed.
 */
const LoaderSelect = () => (
    <ContentLoader className="relative w-full h-16" width={`300`} height="30">
        <rect x="0" y="0" rx="5" ry="5" width="90%" height="20" />
    </ContentLoader>
)

export default LoaderSelect
