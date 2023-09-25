import { useQuery } from '@tanstack/react-query'
import Leaflet, { TileLayer } from 'leaflet'
import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'

import {
    Feature,
    getOnderverdeling,
    getWerkingsgebied,
} from '@/api/axiosGeoJSON'
import ToggleableSection from '@/components/ToggleableSection'

import { LeafletAreaLayer, LeafletControlLayer } from '../LeafletLayers'
import LeafletMap from '../LeafletMap'

interface LeafletTinyViewerProps {
    uuid: string
}

const LeafletTinyViewer = ({ uuid }: LeafletTinyViewerProps) => (
    <LeafletMap
        options={{
            center: [52, 4.316168],
            zoom: 4,
            boundsOptions: { padding: [100, 100] },
        }}
        controllers={{ showLayers: false }}
        id={`leaflet-tiny-viewer-${uuid}`}>
        <LeafletTinyViewerInner uuid={uuid} />
    </LeafletMap>
)

const LeafletTinyViewerInner = ({ uuid }: LeafletTinyViewerProps) => {
    const map = useMap()

    const { data: werkingsgebied } = useQuery({
        queryKey: ['werkingsgebied', uuid],
        queryFn: () => getWerkingsgebied(uuid),
        enabled: !!uuid,
    })
    const { data: onderverdeling } = useQuery({
        queryKey: ['onderverdeling', uuid],
        queryFn: () => getOnderverdeling(uuid),
        enabled: !!uuid,
    })

    const [layers, setLayers] = useState<
        { layer: TileLayer.WMS; context?: Feature }[]
    >([])

    const initializeMap = () => {
        const defaultLayerOptions = {
            version: '1.1.1',
            format: 'image/png',
            transparent: true,
            cql_filter: `UUID='${uuid}'`,
        }

        const layerInstance = Leaflet.tileLayer.wms(
            `${import.meta.env.VITE_GEOSERVER_API_URL}/ows`,
            {
                layers: 'OMGEVINGSBELEID:Werkingsgebieden',
                ...defaultLayerOptions,
            }
        )

        layerInstance.addTo(map)

        const layers = [
            {
                layer: layerInstance,
                context: werkingsgebied?.features?.[0],
            },
        ]

        onderverdeling?.features?.forEach(feature => {
            const layer = Leaflet.tileLayer.wms(
                `${import.meta.env.VITE_GEOSERVER_API_URL}/ows`,
                {
                    layers: 'OMGEVINGSBELEID:Werkingsgebieden_Onderverdeling',
                    ...defaultLayerOptions,
                    // @ts-ignore
                    cql_filter: `UUID='${feature.properties.UUID}' AND Onderverdeling='${feature.properties.Onderverdeling}'`,
                }
            )

            layer.addTo(map)

            layers.push({ layer, context: feature })
        })

        setLayers(layers)
    }

    useEffect(
        () => onderverdeling && werkingsgebied && initializeMap(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onderverdeling, werkingsgebied]
    )

    return (
        <LeafletControlLayer>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="flex flex-col gap-1 p-2">
                    {layers?.map((layer, index) => (
                        <LeafletAreaLayer
                            key={layer.context?.id}
                            index={index.toString()}
                            {...layer}
                        />
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletTinyViewer
