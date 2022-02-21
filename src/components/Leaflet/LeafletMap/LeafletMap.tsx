import { MapOptions } from 'leaflet'
import { ReactNode } from 'react'
import { MapContainer, MapContainerProps } from 'react-leaflet'

import { RDCrs, leafletCenter } from '@/constants/leaflet'

import {
    LeafletDraw,
    LeafletControlLayer,
    LeafletSearch,
} from '../LeafletLayers'

export interface LeafletMapProps {
    options?: MapOptions | MapContainerProps
    controllers?: {
        showSearch?: boolean
        showDraw?: boolean
        showLayers?: boolean
    }
    className?: string
    id?: string
    children?: ReactNode
}

const LeafletMap = ({
    options,
    controllers,
    className,
    id,
    children,
}: LeafletMapProps) => {
    const mapOptions = {
        crs: RDCrs,
        center: leafletCenter,
        zoom: 4,
        maxZoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        ...options,
    }

    const mapControllers = {
        showSearch: false,
        showDraw: false,
        showLayers: true,
        ...controllers,
    }

    return (
        <MapContainer
            {...mapOptions}
            className={`z-0 leaflet-map ${className || ''}`}
            id={id}>
            {mapControllers.showLayers && <LeafletControlLayer />}

            {mapControllers.showSearch && <LeafletSearch />}

            {mapControllers.showDraw && <LeafletDraw />}

            {children}
        </MapContainer>
    )
}

export default LeafletMap
