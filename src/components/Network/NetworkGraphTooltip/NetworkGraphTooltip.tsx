import { Link } from 'react-router-dom'

import isTouchDevice from '@/utils/isTouchDevice'

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

const NetworkGraphTooltip = ({ variables, href }: Props) => {
    const touchDevice = isTouchDevice()
    if (touchDevice) return null

    return (
        <div
            id="d3-tooltip-network-graph"
            style={{
                left: variables.left,
                top: variables.top,
                maxWidth: 'calc(100vw - 40px - 2rem)', // 40px is the width of the buttons, 2rem is the margin
            }}
            className="fixed z-50 hidden hover:block">
            <div className="px-4 py-2 bg-white rounded shadow-md">
                <Link to={href} className="select-none group" role="tooltip">
                    <div
                        id="d3-tooltip-network-graph-type"
                        className={`text-gray-600 text-sm`}
                    />
                    <div
                        id="d3-tooltip-network-graph-title"
                        className={`text-pzh-blue-dark group-hover:underline truncate text-base`}
                        style={{ maxWidth: '400px' }}
                    />
                </Link>
            </div>
            <span className="block w-full h-4" />
        </div>
    )
}
export default NetworkGraphTooltip
