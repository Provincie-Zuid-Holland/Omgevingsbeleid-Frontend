import { Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

/**
 * Displays a tooltip for the NetworkGraph items.
 *
 * @param {object} variables - Contains a collection of style items for the toolip in object form.
 * @param {string} href - Contains the target URL for the Link component.
 */

interface Props {
    variables: { left?: string | number; top?: string | number }
    href: string
}

const NetworkGraphTooltip = ({ variables, href }: Props) => (
    <div
        id="d3-tooltip-network-graph"
        style={{
            left: variables.left,
            top: variables.top,
        }}
        className="absolute z-50 hidden px-4 py-2 text-white bg-black rounded shadow-md bg-opacity-80 hover:block">
        <Link to={href} className="select-none group" role="tooltip">
            <Text
                id="d3-tooltip-network-graph-type"
                type="body-small"
                children={undefined}
                color="text-white"
            />
            <Text
                id="d3-tooltip-network-graph-title"
                type="body-small"
                className="font-bold"
                children={undefined}
                color="text-white"
            />
        </Link>
    </div>
)

export default NetworkGraphTooltip
