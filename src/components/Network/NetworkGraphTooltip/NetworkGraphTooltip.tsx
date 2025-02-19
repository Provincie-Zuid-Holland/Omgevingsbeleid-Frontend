import classNames from 'clsx'
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
        className={classNames('fixed z-50 max-w-[calc(100vw-40px-2rem)]', {
            'left-[-100%]': !variables.active,
        })}>
        <span className="-mt-2.5 block h-2.5 w-full" />
        <div className="rounded bg-black/80 px-3 pb-2 pt-3">
            <span className="block text-s capitalize text-pzh-white">
                {content?.type}
            </span>
            <span className="block max-w-[400px] truncate font-bold text-pzh-white group-hover:underline">
                {content?.title}
            </span>
        </div>
    </div>
))

export default NetworkGraphTooltip
