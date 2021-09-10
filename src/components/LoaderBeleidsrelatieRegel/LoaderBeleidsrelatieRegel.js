import React from "react"
import ContentLoader from "react-content-loader"

/**
 * Displays a grey rectancle loading block before the actual component is displayed.
 */
const LoaderBeleidsrelatieRegel = () => (
    <ContentLoader
        className="block w-full h-5 my-2 rounded"
        width="50"
        height="10"
    >
        <rect x="0" y="0" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderBeleidsrelatieRegel
