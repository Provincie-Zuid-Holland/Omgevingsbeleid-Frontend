import { MapOptions } from 'leaflet'
import { ReactNode, useMemo } from 'react'
import {
    LayersControl,
    MapContainer,
    MapContainerProps,
    TileLayer,
} from 'react-leaflet'

import { RDCrs, leafletCenter, tileURL } from '@/constants/leaflet'

import {
    LeafletControlLayer,
    LeafletDraw,
    LeafletSearch,
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
    callbacks?: {
        onDraw?: (callback: any) => void
    }
    className?: string
    id?: string
    children?: ReactNode
}

const LeafletMap = ({
    options,
    controllers,
    callbacks,
    className,
    id,
    children,
}: LeafletMapProps) => {
    const mapOptions = {
        crs: RDCrs,
        center: leafletCenter,
        zoom: 4,
        maxZoom: 12,
        minZoom: 3,
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

    const leafletMap = useMemo(
        () => (
            <MapContainer
                {...mapOptions}
                className={`leaflet-map z-0 ${className || ''}`}
                id={id}>
                {mapControllers.showLayers && <LeafletControlLayer />}

                {mapControllers.showDraw && (
                    <LeafletDraw onDraw={callbacks?.onDraw} />
                )}

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
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]
    )

    return leafletMap
}

export default LeafletMap
