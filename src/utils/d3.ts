import { select, Selection, symbol, symbolCircle, zoom } from 'd3'

import { GraphResponse, GraphVertice } from '@/api/fetchers.schemas'

export const formatGraphData = (
    graph?: GraphResponse
): { links: { source: string; target: string }[]; nodes: GraphVertice[] } => {
    const links =
        graph?.edges
            ?.filter(
                edge =>
                    !!graph.vertices.some(
                        vertice => vertice.code === edge.vertice_a_code
                    ) &&
                    !!graph.vertices.some(
                        vertice => vertice.code === edge.vertice_b_code
                    )
            )
            .map(edge => ({
                source: edge.vertice_a_code,
                target: edge.vertice_b_code,
            })) || []

    const nodes =
        graph?.vertices?.map(vertice => ({
            ...vertice,
            id: vertice.code,
        })) || []

    return { links, nodes }
}

export const generateNodes = (
    svgElement: Selection<SVGSVGElement, unknown, null, undefined>,
    nodes: GraphVertice[]
) =>
    svgElement
        .append('g')
        .selectAll('path')
        .data(nodes)
        .join('path')
        .attr('id', (d: any) => d.id)
        .attr('fill', d => getColor(d.object_type))
        .attr('d', d => getShape(d.object_type))
        .attr('stroke-width', 1.5)
        .attr(
            'class',
            'cursor-pointer stroke-pzh-black hover:stroke-pzh-blue-900 data-[active=true]:stroke-pzh-blue-900'
        )
        .attr('data-code-shape', d => d.code)

export const getShape = (type: string) => {
    switch (type) {
        case 'beleidskeuze':
            return symbol().type(symbolCircle).size(150)()
        case 'beleidsdoel':
            return 'm-6,0 v8 a2,2 0 00 2,2 h8 a2,2 0 00 2,-2 v-8 a2,2 0 00 -2,-2 h-8 a2,2 0 00 -2,2 z'
        case 'ambitie':
            return 'M -1 -7 a 1 1 0 0 1 1.7321 0 l 5 8 a 1 1.2 0 0 1 -0.7321 2 l -10 0 A 1.3 -1.3 0 0 1 -6 1 z'
        case 'maatregel':
            return 'm -1.4142 -3.0711 l -5.6569 5.6569 a 2 2 45 0 0 0 2.8284 l 5.6569 5.6569 a 2 2 45 0 0 2.8284 -0 l 5.6569 -5.6569 a 2 2 45 0 0 -0 -2.8284 l -5.6569 -5.6569 a 2 2 45 0 0 -2.8284 0 z'
        default:
            return symbol().type(symbolCircle).size(150)()
    }
}

export const getColor = (type: string) => {
    switch (type) {
        case 'beleidskeuze':
            return '#EFCC36'
        case 'beleidsdoel':
            return '#FF6B02'
        case 'ambitie':
            return '#76BC21'
        case 'maatregel':
            return '#281F6B'
        default:
            return '#000000'
    }
}

export const zoomHandler = (
    svgElement: Selection<SVGSVGElement, unknown, null, undefined>
) => {
    /**
     * Setup Zoom
     */
    const minimumZoom = 1
    const maximumZoom = 15

    const zoomed = (event: any) => {
        const transformEvent = event.transform
        const newZoom = transformEvent.k

        if (newZoom < minimumZoom) return

        const transform = transformEvent.toString()
        svgElement.selectAll('g').attr('transform', transform)

        const popupElement = document.getElementById('d3-tooltip-network-graph')

        if (popupElement) {
            popupElement.setAttribute('transform', transform)
        }
    }

    return zoom<SVGSVGElement, any>()
        .scaleExtent([minimumZoom, maximumZoom])
        .translateExtent([
            [-2000, -1500],
            [2000, 1500],
        ])
        .on('zoom', zoomed)
}

/**
 * Update tooltip X and Y coordinates based on the hovered node element.
 */
export const updateTooltipCoordinates = (
    container: HTMLDivElement,
    nodeElement: Element
) => {
    const { x, bottom, width, height } = nodeElement?.getBoundingClientRect()
    const tooltipWidth = container?.offsetWidth || 0

    const leftPosition = x - tooltipWidth / 2 + width / 2
    const bottomPosition = bottom + height + 5

    return {
        left: leftPosition,
        top: bottomPosition,
    }
}

/**
 * Filter connections based on clicked node
 */
export const filterConnections = (
    links: { target: any; source: any }[],
    d: GraphVertice
) =>
    links
        .filter(link => {
            if (typeof link.target === 'string') {
                return link.target === d.code || link.source === d.code
            } else {
                return (
                    link.target.code === d.code || link.source.code === d.code
                )
            }
        })
        .flatMap(link => {
            if (
                d.object_type === 'beleidskeuze' &&
                (link.source.object_type === 'beleidsdoel' ||
                    (typeof link.source === 'string' &&
                        link.source.includes('beleidsdoel')))
            ) {
                return [
                    ...links.filter(e => {
                        if (typeof e.target === 'string') {
                            return e.target === link.source
                        } else {
                            return e.target.code === link.source.code
                        }
                    }),
                    link,
                ]
            }

            return link
        })

/**
 * Highlight connections on click
 */
export const highlightConnections = (
    links: { target: GraphVertice; source: GraphVertice }[],
    node: GraphVertice
) => {
    const svgElement = select('[data-d3="container"]')

    svgElement
        .selectAll('path')
        .attr('data-active', (d: any) => d.code === node.code)
        .attr('fill-opacity', (d: any) =>
            !links.length
                ? d.code === node.code
                    ? 1
                    : 0.3
                : !!!links.find(
                        link =>
                            link.source.code === d.code ||
                            link.target.code === d.code
                    )
                  ? 0.3
                  : 1
        )

    svgElement
        .selectAll('line')
        .attr('stroke-opacity', (d: any) =>
            !!!links.find(
                link =>
                    link.source.code === d.source.code &&
                    link.target.code === d.target.code
            )
                ? 0.1
                : 1
        )
}

/**
 * Highlight connections on click
 */
export const resetHighlightConnections = () => {
    const svgElement = select('[data-d3="container"]')

    svgElement
        .selectAll('path')
        .attr('data-active', false)
        .attr('fill-opacity', 1)

    svgElement.selectAll('line').attr('stroke-opacity', 1)
}
