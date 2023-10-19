import { Map } from 'leaflet'
import { create } from 'zustand'

interface MapState {
    /** Instance of map */
    mapInstance: Map | null
    /** Set instance of map */
    setMapInstance: (mapInstance: Map | null) => void
    /** Is sidebar open */
    sidebarOpen: boolean
    /** Toggle sidebar state */
    setSidebarOpen: (sidebarOpen: boolean) => void
    /** Is data loading */
    isDataLoading: boolean
    /** Set is data loading */
    setIsDataLoading: (isDataLoading: boolean) => void
    /** Is area loading */
    isAreaLoading: boolean
    /** Set is area loading */
    setIsAreaLoading: (isAreaLoading: boolean) => void
    /** Type of drawn object */
    drawType?: 'polygon' | 'marker' | 'werkingsgebied'
    /** Set type of drawn object */
    setDrawType: (drawType: 'polygon' | 'marker' | 'werkingsgebied') => void
}

const useMapStore = create<MapState>(set => ({
    mapInstance: null,
    setMapInstance: mapInstance => set(state => ({ ...state, mapInstance })),
    sidebarOpen: false,
    setSidebarOpen: sidebarOpen => set(state => ({ ...state, sidebarOpen })),
    isDataLoading: false,
    setIsDataLoading: isDataLoading =>
        set(state => ({ ...state, isDataLoading })),
    isAreaLoading: false,
    setIsAreaLoading: isAreaLoading =>
        set(state => ({ ...state, isAreaLoading })),
    setDrawType: drawType => set(state => ({ ...state, drawType })),
}))

export default useMapStore
