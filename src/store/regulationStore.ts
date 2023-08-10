import { create } from 'zustand'

import { Structure } from '@/config/regulations/types'

interface RegulationState {
    /** Regulation structure */
    structure: Structure[]
    /** Set regulation structure */
    setStructure: (structure: Structure[]) => void
    /** Add an item at a specific location */
    addItem: (path: number[], newItem: Structure) => void
    /** Move an item to a specific location */
    moveItem: (fromPath: number[], toPath: number[]) => void
    /** Item which is currently being dragged */
    draggingItem: number[] | null
    /** Set dragging item */
    setDraggingItem: (item: number[] | null) => void
}

const useRegulationStore = create<RegulationState>(set => ({
    structure: [],
    setStructure: structure => set(state => ({ ...state, structure })),
    addItem: (path, newItem) =>
        set(state => {
            const updateChildren = (nodes: Structure[], levels: number[]) => {
                if (levels.length === 0) {
                    if (!!!nodes.length) {
                        return [newItem]
                    }

                    return [...nodes, newItem]
                }

                const [currentLevel, ...remainingLevels] = levels
                const currentNode = nodes[currentLevel]

                if (currentNode && currentNode.children) {
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
    moveItem: (fromPath, toPath) =>
        set(state => {
            const moveRecursive = (
                nodes: Structure[],
                fromPath: number[],
                toPath: number[]
            ): Structure[] => {
                const [fromIndex, ...fromRest] = fromPath
                const [toIndex, ...toRest] = toPath

                if (fromIndex === undefined) {
                    return nodes
                }

                const [movedNode] = nodes.splice(fromIndex, 1)

                if (fromRest.length === 0) {
                    nodes.splice(
                        toIndex > nodes.length ? nodes.length : toIndex,
                        0,
                        movedNode
                    )
                } else {
                    if (!movedNode.children) {
                        movedNode.children = []
                    }
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

    draggingItem: null,
    setDraggingItem: draggingItem => set(state => ({ ...state, draggingItem })),
}))

export default useRegulationStore
