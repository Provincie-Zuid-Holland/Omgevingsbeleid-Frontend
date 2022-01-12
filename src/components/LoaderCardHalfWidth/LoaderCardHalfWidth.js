import ContentLoader from 'react-content-loader'

/**
 * Displays a rectangle at half width based on the parameters given before the component is displayed.
 *
 * @param {props} props - Used to set the margin of the component.
 */
const LoaderCardHalfWidth = props => (
    <ContentLoader
        className={`w-1/2 mb-6 ${props.mr ? 'mr-6' : ''}`}
        width="400"
        height="150"
    >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
)

export default LoaderCardHalfWidth
