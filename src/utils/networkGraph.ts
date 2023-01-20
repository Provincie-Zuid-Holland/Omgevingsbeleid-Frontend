import * as d3 from 'd3'
import { matchPath } from 'react-router-dom'

import { GetGraph200 } from '@/api/fetchers.schemas'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'

/**
 * Function to filter out the inactive types from the links and the nodes
 * @param {object} data - Contains two properties, links and nodes
 * @param {object} filters - Contains keys with boolean values indicating which types are active
 * @returns {object[]} - Returns the filtered [links, nodes]
 */
const getFilteredData = (
    data: GetGraph200 | null | undefined,
    filters: any
) => {
    if (!data || !data.links || !data.nodes) return [null, null]

    const links = data.links
    const nodes = data.nodes

    if (!links || !nodes) return [null, null]

    const activeTypes = Object.keys(filters).filter(key => filters[key])

    /**
     * Contains the UUIDs of nodes that are not active.
     * Used to filter out Links to/from inactive nodes
     */
    const inactiveNodes: string[] = []

    // const filteredLinks = links.filter(link => )
    const filteredNodes = nodes.filter(node => {
        const nodeIsActive = activeTypes.includes(node.Type || '')
        if (!nodeIsActive) inactiveNodes.push(node.UUID || '')
        return nodeIsActive
    })

    const filteredLinks = links.filter(link => {
        const linkIsActive =
            !inactiveNodes.includes(link.source || '') &&
            !inactiveNodes.includes(link.target || '')
        return linkIsActive
    })

    return [filteredLinks, filteredNodes]
}

const removeCircleActiveNode = () => {
    const domClickedNodeCircle = document.getElementById(`active-circle-node`)
    if (!domClickedNodeCircle) return
    domClickedNodeCircle.remove()
}

/**
 * Check if there is a previous URL with an UUID
 * @returns {null|string} - if found return string containing the UUID, else return null
 */
const getUUIDFromPreviousUrl = (lastLocation?: string) => {
    if (!lastLocation) return null

    const getMatch = () => {
        if (lastLocation?.includes('verordening')) {
            const activeUUID = lastLocation.split('actief=')[1]

            return {
                params: { uuid: activeUUID },
            }
        } else {
            return matchPath('/detail/:slug/:uuid', lastLocation)
        }
    }

    const match = getMatch()

    const uuidFromUrl = (match?.params as any)?.uuid
    if (!uuidFromUrl) return null

    return uuidFromUrl
}

const updateGraphSearch = (
    searchQuery: string,
    svgElement: d3.Selection<SVGElement | null, unknown, null, undefined>
) => {
    if (searchQuery === '') {
        svgElement.selectAll('path').attr('fill', (d: any) => d.color)
    } else {
        svgElement
            .selectAll('path')
            .attr('fill', (d: any) => d.color)
            .attr('r', 7.5)
            .filter(
                (e: any) =>
                    !e.Titel?.toLowerCase()?.includes(searchQuery.toLowerCase())
            )
            .attr('fill', (d: any) => d.colorLight)
    }

    svgElement.selectAll('line').attr('stroke-opacity', 0.6)
}

/**
 * Function that adds an SVG circle to the clicked node
 */
const addClickedNodeCircle = (UUID: string) => {
    const currentClickedNode = document.getElementById(UUID)
    if (!currentClickedNode) return

    const svgContainer = currentClickedNode.parentNode
    if (!svgContainer) return

    // Move the clicked node to the bottom of the SVG container
    // This will make sure that no other SVG elements will overlay it
    svgContainer.append(currentClickedNode)

    const transformValue = currentClickedNode.getAttribute('transform')

    const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
    )
    circle.setAttribute('r', '20')
    circle.setAttribute('fill', 'white')
    circle.setAttribute('class', 'circle-active')
    circle.setAttribute('cx', `0`)
    circle.setAttribute('cy', `0`)
    circle.setAttribute(
        'transform',
        transformValue?.replace('scale(1.5)', '') || ''
    )
    circle.setAttribute('id', 'active-circle-node')

    currentClickedNode.parentNode?.insertBefore(circle, currentClickedNode)
}

const generateNodes = (
    svgElement: d3.Selection<SVGElement, unknown, null, undefined>,
    nodes: any
) =>
    svgElement
        .append('g')
        .attr('data-testid', 'test-g-nodes')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(nodes as any)
        .join('path')
        .attr('id', (d: any) => d.id)
        .attr('class', 'cursor-pointer')
        .attr('fill', (d: any) => d.color)
        .attr('d', (d: any) => {
            const nodeType =
                d.Type as keyof typeof networkGraphConnectionProperties
            const nodeSymbol = networkGraphConnectionProperties[nodeType].symbol
            return d3.symbol().type(nodeSymbol).size(175)()
        })

export {
    getFilteredData,
    removeCircleActiveNode,
    getUUIDFromPreviousUrl,
    updateGraphSearch,
    addClickedNodeCircle,
    generateNodes,
}
