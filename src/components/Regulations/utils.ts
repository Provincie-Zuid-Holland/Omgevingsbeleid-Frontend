import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'

function findItemsByType(root: Structure[], currentNode: Structure) {
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
    return results.findIndex(s => s.uuid === currentNode.uuid) + 1
}

function generateIndex(
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
        findItemsByType(item.children, node)

    let newIndex: string

    if (parentIndex === undefined) {
        newIndex = `${index + 1}.${childIndex}`
    } else if (parentIndex === false) {
        newIndex = `${childIndex}`
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
                        node.children = updateChildren(node.children, node)
                    } else if (node) {
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
