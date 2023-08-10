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
            const moveElement = (
                nodes: Structure[],
                fromLevels: number[],
                toLevels: number[]
            ) => {
                if (fromLevels.length === 0 || toLevels.length === 0) {
                    return nodes
                }

                const [fromLevel, ...remainingFromLevels] = fromLevels
                const [toLevel, ...remainingToLevels] = toLevels

                const fromNode = nodes[fromLevel]
                if (!fromNode) {
                    return nodes
                }

                let toIndex = toLevel

                if (fromNode.children && fromNode.children.length > 0) {
                    const newNode = { ...fromNode }
                    newNode.children = moveElement(
                        newNode.children || [],
                        remainingFromLevels,
                        remainingToLevels
                    )
                    nodes.splice(fromLevel, 1, newNode)
                } else {
                    const [movedNode] = nodes.splice(fromLevel, 1)
                    if (toIndex > nodes.length) {
                        toIndex = nodes.length
                    }
                    nodes.splice(toIndex, 0, movedNode)
                }

                return nodes
            }

            const updatedStructure = moveElement(
                [...state.structure],
                fromPath,
                toPath
            )

            return {
                ...state,
                structure: updatedStructure,
            }
        }),
    draggingItem: null,
    setDraggingItem: draggingItem => set(state => ({ ...state, draggingItem })),
}))

export default useRegulationStore
