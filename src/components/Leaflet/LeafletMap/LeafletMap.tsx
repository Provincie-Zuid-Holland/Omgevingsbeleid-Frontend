import { MapOptions } from 'leaflet'
import { ReactNode } from 'react'
import {
    LayersControl,
    MapContainer,
    MapContainerProps,
    TileLayer,
} from 'react-leaflet'

import { RDCrs, leafletCenter, tileURL } from '@/constants/leaflet'

import {
    LeafletControlLayer,
    LeafletSearch,
    LeafletDraw,
    LeafletZoom,
} from '../LeafletLayers'

export interface LeafletMapProps {
    options?: MapOptions | MapContainerProps
    controllers?: {
        showZoom?: boolean
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
        zoomControl: false,
        scrollWheelZoom: true,
        ...options,
    }

    const mapControllers = {
        showZoom: true,
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

            {mapControllers.showDraw && <LeafletDraw />}

            {mapControllers.showSearch && <LeafletSearch />}

            {mapControllers.showZoom && <LeafletZoom />}

            {!mapControllers.showLayers && (
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Map">
                        <TileLayer
                            url={tileURL}
                            minZoom={3}
                            attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
            )}

            {children}
        </MapContainer>
    )
}

export default LeafletMap
