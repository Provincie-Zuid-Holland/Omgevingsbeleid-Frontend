import {
    forceSimulation,
    forceY,
    scaleBand,
    select,
    SimulationNodeDatum,
    forceCollide,
    forceLink,
} from 'd3'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { GraphResponse } from '@/api/fetchers.schemas'
import { formatGraphData, generateNodes } from '@/utils/d3'
import { generateObjectPath } from '@/utils/dynamicObject'

interface VisualProps {
    graph: GraphResponse
}

const Visual = ({ graph }: VisualProps) => {
    const navigate = useNavigate()
    const containerRef = useRef(null)

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
        const svg = select(containerRef.current).attr(
            'viewBox',
            [50, 50, 100, 200]
        )

        svg.selectAll('*').remove()

        const yMap = scaleBand()
            .domain(nodes.map(d => d.Object_Type))
            .range([0, -100])

        // Generate the simulation with d3-force https://github.com/d3/d3-force
        const simulation = forceSimulation(nodes as SimulationNodeDatum[])
            .force(
                'link',
                forceLink(links).id((d: any) => d.id)
            )
            .force(
                'y',
                forceY((d: any) => yMap(d.Object_Type) || 0).strength(0.7)
            )
            .force('collide', forceCollide(15))

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
            link.attr('x1', (d: any) => d.source.x + 100)
                .attr('y1', (d: any) => d.source.y + 200)
                .attr('x2', (d: any) => d.target.x + 100)
                .attr('y2', (d: any) => d.target.y + 200)

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
