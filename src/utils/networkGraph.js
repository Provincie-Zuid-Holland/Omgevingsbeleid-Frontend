/**
 * Function to filter out the inactive types from the links and the nodes
 * @param {object} data - Contains two properties, links and nodes
 * @param {object} filters - Contains keys with boolean values indicating which types are active
 * @returns {object[]} - Returns the filtered [links, nodes]
 */
const getFilteredData = (data, filters) => {
    const links = data.links
    const nodes = data.nodes

    if (!links || !nodes) return [null, null]

    const activeTypes = Object.keys(filters).filter((key) => filters[key])

    /**
     * Contains the UUIDs of nodes that are not active.
     * Used to filter out Links to/from inactive nodes
     */
    const inactiveNodes = []

    // const filteredLinks = links.filter(link => )
    const filteredNodes = nodes.filter((node) => {
        const nodeIsActive = activeTypes.includes(node.Type)
        if (!nodeIsActive) inactiveNodes.push(node.UUID)
        return nodeIsActive
    })

    const filteredLinks = links.filter((link) => {
        const linkIsActive =
            !inactiveNodes.includes(link.source) &&
            !inactiveNodes.includes(link.target)
        return linkIsActive
    })

    return [filteredLinks, filteredNodes]
}

export { getFilteredData }
