import classNames from 'classnames'
import ContentLoader from 'react-content-loader'

/**
 * Displays a rectangle shape before the Select component is displayed.
 */
const LoaderSelect = ({ className = '' }) => (
    <ContentLoader
        className={classNames(`relative w-full h-[48px]`, className)}
        width={`100%`}
        height="30">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="48" />
    </ContentLoader>
)

export default LoaderSelect
