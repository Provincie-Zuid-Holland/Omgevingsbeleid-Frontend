import { forwardRef } from 'react'

import classNames from 'clsx'

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
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

const NetworkGraphTooltip = forwardRef<
    HTMLDivElement,
    NetworkGraphTooltipProps
>(({ variables, content, onMouseEnter, onMouseLeave }, ref) => (
    <div
        ref={ref}
        id="d3-tooltip-network-graph"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={
            variables.active
                ? {
                      left: variables.left,
                      top: variables.top,
                  }
                : undefined
        }
        className={classNames('fixed z-50 max-w-[calc(100vw-40px-2rem)]', {
            'left-[-100vw]': !variables.active,
        })}>
        <span className="-mt-2.5 block h-2.5 w-full" />
        <div className="rounded bg-pzh-black/80 px-3 pt-3 pb-2">
            <span className="block text-s text-pzh-white capitalize">
                {content?.type}
            </span>
            <span className="block max-w-[400px] truncate font-bold text-pzh-white group-hover:underline">
                {content?.title}
            </span>
        </div>
    </div>
))

export default NetworkGraphTooltip
