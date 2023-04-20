import { Selection, symbol, symbolCircle } from 'd3'

import { GraphResponse, GraphVertice } from '@/api/fetchers.schemas'

export const formatGraphData = (graph: GraphResponse) => {
    const links = graph.Edges.filter(
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
    }))
    const nodes = graph.Vertices.map(vertice => ({
        ...vertice,
        id: vertice.Code,
    }))

    return { links, nodes }
}

export const generateNodes = (
    svgElement: Selection<null, unknown, null, undefined>,
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
            'cursor-pointer stroke-pzh-white hover:stroke-pzh-blue-dark'
        )
        .attr('data-code-shape', d => d.Code)

export const getShape = (type: string) => {
    switch (type) {
        case 'beleidskeuze':
            return symbol().type(symbolCircle).size(150)()
        case 'beleidsdoel':
            return 'm-6,0 v8 a2,2 0 00 2,2 h8 a2,2 0 00 2,-2 v-8 a2,2 0 00 -2,-2 h-8 a2,2 0 00 -2,2 z'
        case 'ambitie':
            return 'M0 -6.9378221735089a1 1 0 0 1 1.7320508075689 0l5.2679491924311 9.1243556529821a1 1 0 0 1 -0.86602540378444 2l-10.535898384862 0a1 1 0 0 1 -0.86602540378444 -2 z'
        case 'maatregel':
            return 'm-6,0 v8 a2,2 0 00 2,2 h8 a2,2 0 00 2,-2 v-8 a2,2 0 00 -2,-2 h-8 a2,2 0 00 -2,2 z'
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
