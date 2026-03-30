import {
    Selection,
    SimulationLinkDatum,
    SimulationNodeDatum,
    forceLink,
    forceManyBody,
    forceSimulation,
    forceX,
    forceY,
    select,
} from 'd3'
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { useShallow } from 'zustand/react/shallow'

import { GraphVertice } from '@/api/fetchers.schemas'
import useNetworkStore from '@/store/networkStore'
import {
    filterConnections,
    formatGraphData,
    generateNodes,
    highlightConnections,
    resetHighlightConnections,
    zoomHandler,
} from '@/utils/d3'

import NetworkGraphButtons from '../NetworkGraphButtons'
import NetworkGraphPopup from '../NetworkGraphPopup'
import NetworkGraphTooltip, {
    TooltipContent,
    TooltipVariables,
} from '../NetworkGraphTooltip'
import NetworkLegend from '../NetworkLegend/NetworkLegend'

type D3Link = SimulationLinkDatum<SimulationNodeDatum> & {
    source: SimulationNodeDatum
    target: SimulationNodeDatum
}

interface NetworkVisualProps {
    graph: ReturnType<typeof formatGraphData>
}

const HIDE_DELAY_MS = 120
const TOOLTIP_MARGIN = 12
const HORIZONTAL_PADDING = 8

const NetworkVisual = ({ graph }: NetworkVisualProps) => {
    const { activeNode, setActiveNode } = useNetworkStore(
        useShallow(state => ({
            activeNode: state.activeNode,
            setActiveNode: state.setActiveNode,
        }))
    )

    const containerRef = useRef<SVGSVGElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const hideTooltipTimeoutRef = useRef<number | null>(null)
    const isNodeHoveredRef = useRef(false)
    const isTooltipHoveredRef = useRef(false)
    const hoveredNodeRef = useRef<GraphVertice | null>(null)

    const { links, nodes } = graph

    const [tooltipVariables, setTooltipVariables] = useState<TooltipVariables>({
        active: false,
        left: 0,
        top: 0,
    })
    const [tooltipContent, setTooltipContent] = useState<TooltipContent>()

    /** Clear pending hide timeout */
    const clearHideTooltipTimeout = useCallback(() => {
        if (hideTooltipTimeoutRef.current != null) {
            clearTimeout(hideTooltipTimeoutRef.current)
            hideTooltipTimeoutRef.current = null
        }
    }, [])

    /**
     * Decide whether to hide the tooltip:
     * - If node or tooltip is hovered -> stay open
     * - Otherwise -> hide after a small delay
     */
    const scheduleHideIfNotHovered = useCallback(() => {
        clearHideTooltipTimeout()

        if (isNodeHoveredRef.current || isTooltipHoveredRef.current) {
            return
        }

        hideTooltipTimeoutRef.current = window.setTimeout(() => {
            setTooltipVariables(prev => ({ ...prev, active: false }))
        }, HIDE_DELAY_MS)
    }, [clearHideTooltipTimeout])

    /**
     * Compute tooltip position relative to the hovered node.
     * Always place it just below the node, centered horizontally.
     */
    const recomputeTooltipPosition = useCallback(() => {
        const tooltipEl = tooltipRef.current
        const hoveredNode = hoveredNodeRef.current

        if (!tooltipEl || !hoveredNode) return

        const shape = document.querySelector(
            `[data-code-shape="${hoveredNode.Code}"]`
        ) as HTMLElement | null
        if (!shape) return

        const shapeRect = shape.getBoundingClientRect()
        const tooltipRect = tooltipEl.getBoundingClientRect()

        // Center horizontally over the node
        let left = shapeRect.left + shapeRect.width / 2 - tooltipRect.width / 2

        // Always place below the node
        let top = shapeRect.bottom + TOOLTIP_MARGIN

        // Clamp horizontally within the viewport
        const viewportWidth = window.innerWidth
        if (left < HORIZONTAL_PADDING) {
            left = HORIZONTAL_PADDING
        } else if (
            left + tooltipRect.width >
            viewportWidth - HORIZONTAL_PADDING
        ) {
            left = viewportWidth - tooltipRect.width - HORIZONTAL_PADDING
        }

        setTooltipVariables(prev => {
            if (prev.left === left && prev.top === top && prev.active) {
                return prev
            }
            return {
                ...prev,
                left,
                top,
                active: true,
            }
        })
    }, [])

    /**
     * Node hover handlers
     */
    const handleNodeMouseOver = useCallback(
        (_: any, d: GraphVertice) => {
            isNodeHoveredRef.current = true
            hoveredNodeRef.current = d
            clearHideTooltipTimeout()

            setTooltipContent({ title: d.Title, type: d.Object_Type })

            const shape = document.querySelector(
                `[data-code-shape="${d.Code}"]`
            ) as HTMLElement | null

            if (!shape) {
                // Show tooltip and let layout effect position it
                setTooltipVariables(prev => ({
                    ...prev,
                    active: true,
                }))
                return
            }

            // Rough initial placement; will be corrected in useLayoutEffect
            const shapeRect = shape.getBoundingClientRect()
            const left = shapeRect.left + shapeRect.width / 2
            const top = shapeRect.bottom + TOOLTIP_MARGIN

            setTooltipVariables(prev => ({
                ...prev,
                active: true,
                left,
                top,
            }))
        },
        [clearHideTooltipTimeout]
    )

    const handleNodeMouseOut = useCallback(() => {
        isNodeHoveredRef.current = false
        scheduleHideIfNotHovered()
    }, [scheduleHideIfNotHovered])

    const handleNodeClick = useCallback(
        (
            _: any,
            d: GraphVertice,
            svg?: Selection<SVGSVGElement, unknown, null, undefined>
        ) => {
            if (!svg) return
            const connectedLinks = filterConnections(links, d)
            highlightConnections(connectedLinks, d)
            setActiveNode(d)
        },
        [links, setActiveNode]
    )

    /**
     * Tooltip hover handlers
     */
    const handleTooltipMouseEnter = useCallback(() => {
        isTooltipHoveredRef.current = true
        clearHideTooltipTimeout()
    }, [clearHideTooltipTimeout])

    const handleTooltipMouseLeave = useCallback(() => {
        isTooltipHoveredRef.current = false
        scheduleHideIfNotHovered()
    }, [scheduleHideIfNotHovered])

    /**
     * ESC closes tooltip immediately
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.key === 'Esc') {
                isNodeHoveredRef.current = false
                isTooltipHoveredRef.current = false
                hoveredNodeRef.current = null
                clearHideTooltipTimeout()
                setTooltipVariables(prev => ({ ...prev, active: false }))
                setActiveNode(undefined)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [clearHideTooltipTimeout])

    /** Cleanup on unmount */
    useEffect(() => {
        return () => {
            clearHideTooltipTimeout()
        }
    }, [clearHideTooltipTimeout])

    /**
     * After the tooltip becomes active (or content changes),
     * recompute its position with real DOM sizes for stable placement.
     */
    useLayoutEffect(() => {
        if (!tooltipVariables.active) return
        recomputeTooltipPosition()
    }, [tooltipVariables.active, tooltipContent, recomputeTooltipPosition])

    /**
     * Reset graph state
     */
    const resetGraph = () => {
        setActiveNode(undefined)
        resetHighlightConnections()

        isNodeHoveredRef.current = false
        isTooltipHoveredRef.current = false
        hoveredNodeRef.current = null
        clearHideTooltipTimeout()
        setTooltipVariables(prev => ({ ...prev, active: false }))
    }

    /**
     * D3 rendering & simulation
     */
    useEffect(() => {
        if (!containerRef.current) return

        const svg = select(containerRef.current)

        /** Set viewBox attribute */
        const bounding = containerRef.current.getBoundingClientRect()
        svg.attr('viewBox', [
            -bounding.width / 2,
            -bounding.height / 2,
            bounding.width * 1.25,
            bounding.height * 1.5,
        ])

        svg.selectAll('*').remove()

        /** Init zoom handler */
        const handleZoom = zoomHandler(svg)
        svg.call(handleZoom).on('dblclick.zoom', null)

        /** Leaving the SVG behaves like leaving nodes */
        svg.on('mouseleave.tooltip', () => {
            isNodeHoveredRef.current = false
            scheduleHideIfNotHovered()
        })

        /** Force strength based on node count */
        const generateStrength = (nodes: GraphVertice[]) => {
            if (nodes.length > 20) return -150
            if (nodes.length > 10) return -100
            return -30
        }

        const simulation = forceSimulation(nodes as SimulationNodeDatum[])
            .force(
                'link',
                forceLink(links).id((d: any) => d.id)
            )
            .force('charge', forceManyBody().strength(generateStrength(nodes)))
            .force('x', forceX())
            .force('y', forceY())

        // Generate Links
        const link = svg
            .append('g')
            .attr('stroke', '#838383')
            .selectAll('line')
            .data(links)
            .join('line')

        // Generate Nodes
        const node = generateNodes(svg, nodes)
            .on('mouseover', handleNodeMouseOver as any)
            .on('mouseout', handleNodeMouseOut as any)
            .on('click', (event: any, d: GraphVertice) =>
                handleNodeClick(event, d, svg)
            )

        // Update positions
        simulation.on('tick', () => {
            link.attr('x1', (d: D3Link) => (d.source.x || 0) + 100)
                .attr('y1', (d: D3Link) => (d.source.y || 0) + 200)
                .attr('x2', (d: D3Link) => (d.target.x || 0) + 100)
                .attr('y2', (d: D3Link) => (d.target.y || 0) + 200)

            node.attr('transform', (d: any) => {
                const x = (d.x || 0) + 100
                const y = (d.y || 0) + 200
                return `translate(${x} ${y})`
            })
        })

        /** Highlight node if state contains activeNode */
        if (activeNode) {
            const connectedLinks = filterConnections(links, activeNode)
            highlightConnections(connectedLinks, activeNode)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        links,
        nodes,
        activeNode,
        handleNodeMouseOver,
        handleNodeMouseOut,
        handleNodeClick,
        scheduleHideIfNotHovered,
    ])

    /**
     * Zoom controls
     */
    const handleZoomButtons = useCallback(
        (type: 'zoomIn' | 'zoomOut') => {
            if (!containerRef.current) return

            const svg = select(containerRef.current)
            zoomHandler(svg).scaleBy(
                svg.transition().duration(750),
                type === 'zoomOut' ? 0.6 : 1.4
            )
        },
        [containerRef.current]
    )

    return (
        <>
            <NetworkLegend />

            <NetworkGraphButtons
                handleZoom={handleZoomButtons}
                resetGraph={resetGraph}
            />

            <NetworkGraphPopup resetGraph={resetGraph} />

            <NetworkGraphTooltip
                ref={tooltipRef}
                variables={tooltipVariables}
                content={tooltipContent}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
            />

            <svg
                className="h-full w-full"
                data-d3="container"
                ref={containerRef}
            />
        </>
    )
}

export default NetworkVisual
