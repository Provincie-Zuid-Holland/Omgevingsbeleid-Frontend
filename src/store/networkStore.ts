import { create } from 'zustand'

import { GraphVertice } from '@/api/fetchers.schemas'

interface NetworkState {
    /** Contains node (GraphVertice) which is currently active */
    activeNode?: GraphVertice
    /** Set active node (GraphVertice) */
    setActiveNode: (node?: GraphVertice) => void
    /** Contains connections which are connected to active node */
    activeConnections?: GraphVertice[]
    /** Set active connections based on active node */
    setActiveConnections: (activeConnections?: GraphVertice[]) => void
    /** Active tab */
    activeTab: 'visual' | 'textual'
    /** Set active tab */
    setActiveTab: (activeTab: 'visual' | 'textual') => void
}

const useNetworkStore = create<NetworkState>(set => ({
    setActiveNode: activeNode => set(state => ({ ...state, activeNode })),
    setActiveConnections: activeConnections =>
        set(state => ({ ...state, activeConnections })),
    activeTab: 'visual',
    setActiveTab: activeTab => set(state => ({ ...state, activeTab })),
}))

export default useNetworkStore
