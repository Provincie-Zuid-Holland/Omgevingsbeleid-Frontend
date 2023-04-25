import { Selection, select, symbol, symbolCircle, zoom } from 'd3'

import { GraphResponse, GraphVertice } from '@/api/fetchers.schemas'

export const formatGraphData = (
    graph?: GraphResponse
): { links: { source: string; target: string }[]; nodes: GraphVertice[] } => {
    const links =
        graph?.Edges?.filter(
            edge =>
                !!graph.Vertices.some(
                    vertice => vertice.Code === edge.Vertice_A_Code
                ) &&
                !!graph.Vertices.some(
                    vertice => vertice.Code === edge.Vertice_B_Code
                )
        ).map(edge => ({
            source: edge.Vertice_A_Code,
            target: edge.Vertice_B_Code,
        })) || []

    const nodes =
        graph?.Vertices?.map(vertice => ({
            ...vertice,
            id: vertice.Code,
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
        .attr('fill', d => getColor(d.Object_Type))
        .attr('d', d => getShape(d.Object_Type))
        .attr('stroke-width', 1.5)
        .attr(
            'class',
            'cursor-pointer stroke-pzh-white hover:stroke-pzh-blue-dark data-[active=true]:stroke-pzh-blue-dark'
        )
        .attr('data-code-shape', d => d.Code)

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
            return '#00804D'
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
    const tooltipHeight = container?.offsetHeight || 0

    const leftPosition = x - tooltipWidth / 2 + width / 2
    const bottomPosition = bottom - height - tooltipHeight - 10

    return {
        left: leftPosition,
        top: bottomPosition,
    }
}

/**
 * Filter connections based on clicked node
 */
export const filterConnections = (links: any[], d: GraphVertice) => {
    return links
        .filter(link => {
            if (typeof link.target === 'string') {
                return link.target === d.Code || link.source === d.Code
            } else {
                return (
                    link.target.Code === d.Code || link.source.Code === d.Code
                )
            }
        })
        .flatMap(link => {
            if (
                d.Object_Type === 'beleidskeuze' &&
                link.source.Object_Type === 'beleidsdoel'
            ) {
                return [
                    ...links.filter(e => {
                        if (typeof e.target === 'string') {
                            return e.target === link.source.Code
                        } else {
                            return e.target.Code === link.source.Code
                        }
                    }),
                    link,
                ]
            }

            return link
        })
}

/**
 * Highlight connections on click
 */
export const highlightConnections = (links: any[], node: GraphVertice) => {
    const svgElement = select('[data-d3="container"]')

    svgElement
        .selectAll('path')
        .attr('data-active', (d: any) => d.Code === node.Code)
        .attr('fill-opacity', (d: any) =>
            !links.length
                ? d.Code === node.Code
                    ? 1
                    : 0.3
                : !!!links.find(
                      link =>
                          link.source.Code === d.Code ||
                          link.target.Code === d.Code
                  )
                ? 0.3
                : 1
        )

    svgElement
        .selectAll('line')
        .attr('stroke-opacity', (d: any) =>
            !!!links.find(
                link =>
                    link.source.Code === d.source.Code &&
                    link.target.Code === d.target.Code
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
