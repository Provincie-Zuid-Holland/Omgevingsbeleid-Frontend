import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import { RegulationAction } from '@/store/regulationStore'

export function findItemsByType(root: Structure[], currentNode: Structure) {
    const results: Structure[] = []

    function traverse(node: Structure[]) {
        for (const item of node) {
            if (item.type === currentNode.type) {
                results.push(item)
            }

            if (item.children) {
                traverse(item.children)
            }
        }
    }

    traverse(root)
    return {
        total: results.length,
        current: results.findIndex(s => s.uuid === currentNode.uuid) + 1,
    }
}

export function generateIndex(
    node: Structure,
    item: Structure,
    index: number,
    nodes: Structure[],
    parent?: Structure
): string {
    // Get the parent index configuration from section defaults
    const parentIndex = sections[node.type].defaults.parentIndex

    // Calculate the child index within the item's children, if applicable
    const childIndex =
        item.children?.length && node
            ? findItemsByType(item.children, node).current
            : undefined

    let newIndex: string

    if (parentIndex === undefined) {
        // If parent index is undefined, format as "index.childIndex"
        newIndex = `${index + 1}.${childIndex}`
    } else if (parentIndex === false) {
        // If parent index is set to false, find the node's index within the nodes array
        const nodeIndex = nodes.findIndex(item => item.uuid === node.uuid) + 1
        newIndex = `${nodeIndex}`
    } else {
        // If parent index is specified, find the index of the node within nodes of the same type
        const filteredNodes = nodes.filter(item => item.type === node.type)
        const itemIndex =
            filteredNodes.findIndex(item => item.uuid === node.uuid) + 1
        newIndex = `${parent?.index}.${itemIndex}`
    }

    return newIndex
}

export const formatStructure = (structure: Structure[]): Structure[] => {
    // Map each item in the structure array to a new formatted object
    return structure.map((item, index) => {
        // Recursive function to update children and generate indices
        const updateChildren = (
            nodes: Structure[],
            parent?: Structure
        ): Structure[] => {
            // If there are multiple nodes, process each one
            if (nodes.length > 1) {
                nodes.forEach(node => {
                    if (!!node.children?.length) {
                        // Update index and children for the current node
                        const newIndex = generateIndex(
                            node,
                            item,
                            index,
                            nodes,
                            parent
                        )
                        node.index = newIndex
                        node.children = updateChildren(node.children, node)
                    } else {
                        // Update index for leaf nodes
                        const newIndex = generateIndex(
                            node,
                            item,
                            index,
                            nodes,
                            parent
                        )
                        node.index = newIndex
                    }
                })
            } else {
                // If there's only one node, update index and children if applicable
                const currentNode = nodes[nodes.length > 1 ? index : 0]

                if (currentNode && !!currentNode.children?.length) {
                    const newIndex = generateIndex(
                        currentNode,
                        item,
                        index,
                        nodes,
                        parent
                    )
                    currentNode.index = newIndex
                    currentNode.children = updateChildren(currentNode.children)
                } else if (currentNode) {
                    const newIndex = generateIndex(
                        currentNode,
                        item,
                        index,
                        nodes,
                        parent
                    )
                    currentNode.index = newIndex
                }
            }

            return nodes
        }

        // Format the current item with updated index and children
        return {
            ...item,
            index: `${index + 1}`,
            children: updateChildren(item.children || []),
        }
    })
}

export function findObjectByUUID(
    uuid: string,
    nestedArray: Structure[]
): Structure | null {
    // Recursive function to search for an object by UUID in a nested array
    for (const obj of nestedArray) {
        if (obj.uuid === uuid) {
            return obj
        }

        // If the object has children, search within them recursively
        if (obj.children && Array.isArray(obj.children)) {
            const result = findObjectByUUID(uuid, obj.children)
            if (result) {
                return result
            }
        }
    }

    // If the object is not found, return null
    return null
}

export function flattenNestedArray(nestedArray: Structure[]): Structure[] {
    const flattenedArray: Structure[] = []

    // Recursive function to flatten a nested array of objects
    function flattenObjects(node: Structure[]): void {
        for (const obj of node) {
            flattenedArray.push(obj)

            // If the object has children, recursively flatten them
            if (obj.children) {
                flattenObjects(obj.children)
            }
        }
    }

    // Start flattening from the root of the nested array
    flattenObjects(nestedArray)
    return flattenedArray
}

export function calculateNewIndex(
    structure: Structure[],
    itemAction?: RegulationAction
) {
    // If itemAction doesn't have a path, there's nothing to calculate
    if (!itemAction?.path) {
        return
    }

    // If itemAction doesn't have a UUID, add a new item at the end of the structure
    if (!itemAction.uuid) {
        return structure.length + 1
    }

    // Get the parent index from the section defaults
    const parentIndex = sections[itemAction.type].defaults.parentIndex

    // Find the index of a child with the specified UUID in the given children array
    const findChildIndex = (children: Structure[], uuid: string) => {
        const child = children.find(item => item.uuid === uuid)
        if (child?.children?.length) {
            const lastChildUuid = child.children[child.children.length - 1].uuid
            return children.findIndex(item => item.uuid === lastChildUuid) + 1
        }
        return children.findIndex(item => item.uuid === child?.uuid) + 1
    }

    // Find the total count of items of a specific type within a parent
    const findParentTotal = (uuid: string) => {
        const parent = findObjectByUUID(uuid, structure)
        if (!!parent?.children?.length) {
            return findItemsByType(parent.children, itemAction).total + 1
        }
        return 1
    }

    // Calculate the new index based on different scenarios
    if (parentIndex === undefined) {
        const parent = structure[itemAction.path[0]]
        const children = [parent, ...flattenNestedArray(parent.children || [])]
        const childIndex = findChildIndex(children, itemAction.uuid)
        const amount =
            parent.uuid === itemAction.uuid
                ? children.filter(s => s.type === itemAction.type).length + 1
                : children
                      .slice(0, childIndex)
                      .filter(s => s.type === itemAction.type).length + 1

        return `${itemAction.path[0] + 1}.${amount}`
    } else if (parentIndex === false) {
        return `${findParentTotal(itemAction.uuid) || 1}`
    } else {
        const parentTotal = findParentTotal(itemAction.uuid)
        return `${findObjectByUUID(itemAction.uuid, structure)?.index}.${
            parentTotal || 1
        }`
    }
}
