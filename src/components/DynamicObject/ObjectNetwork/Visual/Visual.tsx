import {
    forceSimulation,
    forceY,
    select,
    SimulationNodeDatum,
    forceLink,
    SimulationLinkDatum,
    forceManyBody,
    forceX,
} from 'd3'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { GraphResponse } from '@/api/fetchers.schemas'
import { formatGraphData, generateNodes } from '@/utils/d3'
import { generateObjectPath } from '@/utils/dynamicObject'

interface VisualProps {
    graph: GraphResponse
}

type D3Link = SimulationLinkDatum<SimulationNodeDatum> & {
    source: SimulationNodeDatum
    target: SimulationNodeDatum
}

const Visual = ({ graph }: VisualProps) => {
    const navigate = useNavigate()
    const containerRef = useRef<SVGSVGElement>(null)

    /**
     * Format connections for D3
     */
    const { links, nodes } = useMemo(() => formatGraphData(graph), [graph])

    /** Highlight connected shape on hover */
    const handleMouseInteraction = useCallback(({ type }, d) => {
        const el = document.querySelector(`[data-code-link="${d.Code}"]`)

        if (type === 'mouseover') {
            el?.classList.add('font-bold')
        } else {
            el?.classList.remove('font-bold')
        }
    }, [])

    /** Handle click event on node */
    const handleClick = useCallback(
        (_, d) => {
            const path = generateObjectPath(d.Object_Type, d.UUID)

            navigate(path)
        },
        [navigate]
    )

    useEffect(() => {
        if (!containerRef.current) return

        const svg = select(containerRef.current).attr(
            'viewBox',
            [50, 100, 100, 250]
        )

        svg.selectAll('*').remove()

        const simulation = forceSimulation(nodes as SimulationNodeDatum[])
            .force(
                'link',
                forceLink(links).id((d: any) => d.id)
            )
            .force('charge', forceManyBody().strength(-50))
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
            .on('click', handleClick)

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
    }, [links, nodes, handleMouseInteraction, handleClick])

    return <svg className="w-full h-[300px]" ref={containerRef} />
}

export default Visual
