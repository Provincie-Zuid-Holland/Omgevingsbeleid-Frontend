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
) {
    const parentIndex = sections[node.type].defaults.parentIndex
    const childIndex =
        !!item.children?.length &&
        !!node &&
        findItemsByType(item.children, node).current

    let newIndex: string

    if (parentIndex === undefined) {
        newIndex = `${index + 1}.${childIndex}`
    } else if (parentIndex === false) {
        newIndex = `${nodes.findIndex(item => item.uuid === node.uuid) + 1}`
    } else {
        const filteredNodes = nodes.filter(item => item.type === node.type)
        const itemIndex =
            filteredNodes.findIndex(item => item.uuid === node.uuid) + 1

        newIndex = `${parent?.index}.${itemIndex}`
    }

    return newIndex
}

export const formatStructure = (structure: Structure[]) =>
    structure.map((item, index) => {
        const updateChildren = (nodes: Structure[], parent?: Structure) => {
            if (nodes.length > 1) {
                nodes.forEach(node => {
                    if (!!node.children?.length) {
                        node.index = generateIndex(
                            node,
                            item,
                            index,
                            nodes,
                            parent
                        )

                        node.children = updateChildren(node.children, node)
                    } else {
                        node.index = generateIndex(
                            node,
                            item,
                            index,
                            nodes,
                            parent
                        )
                    }

                    return nodes
                })
            } else {
                const currentNode = nodes[nodes.length > 1 ? index : 0]

                if (currentNode && !!currentNode.children?.length) {
                    currentNode.children = updateChildren(currentNode.children)
                } else if (currentNode) {
                    currentNode.index = generateIndex(
                        currentNode,
                        item,
                        index,
                        nodes,
                        parent
                    )
                }
            }

            return nodes
        }

        return {
            ...item,
            index: `${index + 1}`,
            children: updateChildren(item.children || []),
        }
    })

export function findObjectByUUID(
    uuid: string,
    nestedArray: Structure[]
): Structure | null {
    for (const obj of nestedArray) {
        if (obj.uuid === uuid) {
            return obj
        }

        if (obj.children && Array.isArray(obj.children)) {
            const result = findObjectByUUID(uuid, obj.children)
            if (result) {
                return result
            }
        }
    }

    return null
}

export function flattenNestedArray(nestedArray: Structure[]): Structure[] {
    const flattenedArray: Structure[] = []

    function flattenObjects(node: Structure[]): void {
        for (const obj of node) {
            flattenedArray.push(obj)

            if (obj.children) {
                flattenObjects(obj.children)
            }
        }
    }

    flattenObjects(nestedArray)
    return flattenedArray
}

export function calculateNewIndex(
    structure: Structure[],
    itemAction?: RegulationAction
) {
    if (!itemAction?.path) return

    if (!itemAction.uuid) {
        return structure.length + 1
    }

    const parentIndex = sections[itemAction.type].defaults.parentIndex

    const findChildIndex = (children: Structure[], uuid: string) => {
        const child = children.find(item => item.uuid === uuid)
        if (child?.children?.length) {
            const lastChildUuid = child.children[child.children.length - 1].uuid
            return children.findIndex(item => item.uuid === lastChildUuid) + 1
        }
        return children.findIndex(item => item.uuid === child?.uuid) + 1
    }

    const findParentTotal = (uuid: string) => {
        const parent = findObjectByUUID(uuid, structure)
        if (!!parent?.children?.length) {
            return findItemsByType(parent.children, itemAction).total + 1
        }
        return 1
    }

    if (parentIndex === undefined) {
        const parent = structure[itemAction.path[0]]
        const children = [parent, ...flattenNestedArray(parent.children || [])]
        const childIndex = findChildIndex(children, itemAction.uuid)
        const amount =
            children
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
