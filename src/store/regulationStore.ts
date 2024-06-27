import { create } from 'zustand'

import { SectionType } from '@/config/regulations/sections/types'
import { Structure } from '@/config/regulations/types'

export type RegulationAction = {
    action: 'add' | 'delete' | 'edit'
    type: SectionType
    path?: number[]
    uuid?: string
    index?: string
}

interface RegulationState {
    /** Regulation structure */
    structure: Structure[]
    /** Add an item at a specific location */
    addItem: (path: number[], newItem: Structure) => void
    /** Edit an item by it's UUID */
    editItem: (uuid: string, updatedItem: Structure) => void
    /** Move an item to a specific location */
    moveItem: (fromPath: number[], toPath: number[]) => void
    /** Delete an item */
    deleteItem: (uuid: string) => void
    /** Item which is currently being dragged */
    draggingItem: number[] | null
    /** Set dragging item */
    setDraggingItem: (item: number[] | null) => void
    /** Active item */
    activeItem?: string | null
    /** Set active item */
    setActiveItem: (item?: string | null) => void
    /** Active item */
    itemAction?: RegulationAction
    /** Set active item */
    setItemAction: (action?: RegulationAction) => void
}

const useRegulationStore = create<RegulationState>(set => ({
    structure: [],
    addItem: (path, newItem) =>
        set(state => {
            const updateChildren = (nodes: Structure[], levels: number[]) => {
                if (levels.length === 0) {
                    if (!!!nodes.length) return [newItem]

                    return [...nodes, newItem]
                }

                const [currentLevel, ...remainingLevels] = levels
                const currentNode = nodes[currentLevel]

                if (currentNode?.children) {
                    currentNode.children = updateChildren(
                        currentNode.children,
                        remainingLevels
                    )
                } else if (currentNode) {
                    currentNode.children = [newItem]
                }

                return nodes
            }

            return {
                ...state,
                structure: updateChildren([...state.structure], path),
            }
        }),
    editItem: (uuid, updatedItem) =>
        set(state => {
            const editRecursive = (nodes: Structure[]): Structure[] => {
                return nodes.map(node => {
                    if (node.uuid === uuid) return updatedItem

                    if (node.children) {
                        return {
                            ...node,
                            children: editRecursive(node.children),
                        }
                    }

                    return node
                })
            }

            return {
                ...state,
                structure: editRecursive(state.structure),
            }
        }),
    moveItem: (fromPath, toPath) =>
        set(state => {
            const moveRecursive = (
                nodes: Structure[],
                fromPath: number[],
                toPath: number[]
            ): Structure[] => {
                const [fromIndex, ...fromRest] = fromPath
                const [toIndex, ...toRest] = toPath

                if (fromIndex === undefined) return nodes

                const [movedNode] = nodes.splice(fromIndex, 1)

                if (fromRest.length === 0) {
                    nodes.splice(
                        toIndex > nodes.length ? nodes.length : toIndex,
                        0,
                        movedNode
                    )
                } else {
                    if (!movedNode.children) movedNode.children = []

                    movedNode.children = moveRecursive(
                        movedNode.children,
                        fromRest,
                        toRest
                    )

                    nodes.splice(fromIndex, 0, movedNode)
                }

                return nodes
            }

            return {
                ...state,
                structure: moveRecursive(
                    [...state.structure],
                    fromPath,
                    toPath
                ),
            }
        }),
    deleteItem: uuid =>
        set(state => {
            const deleteRecursive = (
                nodes: Structure[],
                targetUuid: string
            ): Structure[] =>
                nodes
                    .map(node => ({
                        ...node,
                        children: node.children
                            ? deleteRecursive(node.children, targetUuid)
                            : undefined,
                    }))
                    .filter(node => node.uuid !== targetUuid)

            return {
                ...state,
                structure: deleteRecursive(state.structure, uuid),
            }
        }),
    draggingItem: null,
    setDraggingItem: draggingItem => set(state => ({ ...state, draggingItem })),
    setActiveItem: activeItem => set(state => ({ ...state, activeItem })),
    setItemAction: itemAction => set(state => ({ ...state, itemAction })),
}))

export default useRegulationStore
