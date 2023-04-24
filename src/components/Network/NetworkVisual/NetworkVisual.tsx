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
    selectAll,
} from 'd3'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { GraphVertice } from '@/api/fetchers.schemas'
import {
    filterConnections,
    formatGraphData,
    generateNodes,
    highlightConnections,
    resetHighlightConnections,
    updateTooltipCoordinates,
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
    containerRef: SVGSVGElement | null
    graph: ReturnType<typeof formatGraphData>
    activeNode?: GraphVertice
    setActiveNode: (node?: GraphVertice) => void
}

const NetworkVisual = forwardRef<SVGSVGElement, NetworkVisualProps>(
    ({ containerRef, graph, activeNode, setActiveNode }, ref) => {
        const tooltipRef = useRef<HTMLDivElement>(null)

        const { links, nodes } = graph

        const [tooltipVariables, setTooltipVariables] =
            useState<TooltipVariables>({
                active: false,
            })
        const [tooltipContent, setTooltipContent] = useState<TooltipContent>()

        /**
         * Highlight connected shape on hover / click
         */
        const handleMouseInteraction = useCallback(
            (
                { type },
                d: GraphVertice,
                svg?: Selection<SVGSVGElement, unknown, null, undefined>
            ) => {
                const shape = document.querySelector(
                    `[data-code-shape="${d.Code}"]`
                )

                if (type === 'click') {
                    if (!svg || !containerRef) return

                    const connectedLinks = filterConnections(links, d)
                    highlightConnections(containerRef, connectedLinks, d)
                    setActiveNode(d)
                }

                if (type === 'mouseover' && shape) {
                    setTooltipContent({ title: d.Title, type: d.Object_Type })

                    setTimeout(() => {
                        setTooltipVariables({
                            active: true,
                            ...updateTooltipCoordinates(
                                tooltipRef.current!,
                                shape
                            ),
                        })
                    }, 50)
                } else {
                    setTimeout(() => setTooltipVariables({ active: false }), 50)
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [links]
        )

        /**
         * Reset graph state
         */
        const resetGraph = () => {
            if (!containerRef) return

            setActiveNode(undefined)
            resetHighlightConnections(containerRef)
        }

        useEffect(() => {
            if (!containerRef) return

            const svg = select(containerRef)

            /**
             * Set viewBox attribute
             */
            const bounding = containerRef.getBoundingClientRect()
            svg.attr('viewBox', [
                -bounding.width / 2, // Center horizontally
                -bounding.height / 2, // Center vertically
                bounding.width * 1.25,
                bounding.height * 1.5,
            ])

            svg.selectAll('*').remove()

            /** Init zoom handler */
            const handleZoom = zoomHandler(svg)
            svg.call(handleZoom).on('dblclick.zoom', null)

            select('[data-d3="zoom-in"]').on('click', () => {
                handleZoom.scaleBy(svg.transition().duration(750), 1.4)
            })

            select('[data-d3="zoom-out"]').on('click', () => {
                handleZoom.scaleBy(svg.transition().duration(750), 0.6)
            })

            selectAll('[data-d3="reset"]').on('click', resetGraph)

            /**
             * When we simulate the nodes, we need to define their strength of attracting or repelling each other.
             * The higher the strength, the more they repel each other.
             * The more nodes we have, the stronger our strength need to be in order to create the space for the nodes
             * https://www.d3indepth.com/force-layout/#forcemanybody
             */
            const generateStrength = (nodes: GraphVertice[]) => {
                if (nodes.length > 20) return -150
                if (nodes.length > 10) return -100
                return -30 // Default
            }

            const simulation = forceSimulation(nodes as SimulationNodeDatum[])
                .force(
                    'link',
                    forceLink(links).id((d: any) => d.id)
                )
                .force(
                    'charge',
                    forceManyBody().strength(generateStrength(nodes))
                )
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
                .on('mouseover', handleMouseInteraction)
                .on('mouseout', handleMouseInteraction)
                .on('click', (event, d) =>
                    handleMouseInteraction(event, d, svg)
                )

            // Update
            simulation.on('tick', () => {
                link.attr('x1', (d: D3Link) => (d.source.x || 0) + 100)
                    .attr('y1', (d: D3Link) => (d.source.y || 0) + 200)
                    .attr('x2', (d: D3Link) => (d.target.x || 0) + 100)
                    .attr('y2', (d: D3Link) => (d.target.y || 0) + 200)

                node.attr('transform', (d: any) => {
                    const x = d.x + 100
                    const y = d.y + 200
                    return 'translate(' + x + ' ' + y + ')'
                })
            })
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [links, nodes, handleMouseInteraction])

        return (
            <>
                <NetworkLegend />
                <NetworkGraphButtons activeNode={activeNode} />
                <NetworkGraphPopup activeNode={activeNode} />
                <NetworkGraphTooltip
                    ref={tooltipRef}
                    variables={tooltipVariables}
                    content={tooltipContent}
                />
                <svg className="w-full h-full" ref={ref} />
            </>
        )
    }
)

export default NetworkVisual
