import classNames from 'classnames'
import { forwardRef } from 'react'

/**
 * Displays a tooltip for the NetworkGraph items.
 */

export type TooltipVariables = {
    active: boolean
    left?: number
    top?: number
}

export type TooltipContent = {
    title?: string
    type?: string
}

interface NetworkGraphTooltipProps {
    variables: TooltipVariables
    content?: TooltipContent
}

const NetworkGraphTooltip = forwardRef<
    HTMLDivElement,
    NetworkGraphTooltipProps
>(({ variables, content }, ref) => (
    <div
        ref={ref}
        id="d3-tooltip-network-graph"
        style={{
            left: variables.left,
            top: variables.top,
        }}
        className={classNames('fixed z-50 max-w-[calc(100vw - 40px - 2rem)]', {
            'left-[-100%]': !variables.active,
        })}>
        <span className="block w-full h-[10px] -mt-[10px]" />
        <div className="px-3 pt-3 pb-2 bg-black/80 rounded-[4px]">
            <span className="block text-pzh-white text-sm capitalize">
                {content?.type}
            </span>
            <span className="block max-w-[400px] text-pzh-white font-bold group-hover:underline truncate">
                {content?.title}
            </span>
        </div>
    </div>
))

export default NetworkGraphTooltip
