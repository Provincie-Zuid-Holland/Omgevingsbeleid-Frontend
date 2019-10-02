import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderWerkingsgebiedCard = () => (
    <span className="w-1/2 inline-block p-4">
        <ContentLoader className="w-full" width="400" height="200">
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
        </ContentLoader>
    </span>
)

export default LoaderWerkingsgebiedCard
