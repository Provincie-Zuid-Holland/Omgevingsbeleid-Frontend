import { useQuery } from '@tanstack/react-query'
import Leaflet from 'leaflet'
import { useMemo } from 'react'
import { useMap } from 'react-leaflet'
import { useEffectOnce } from 'react-use'

import { getOnderverdeling, getWerkingsgebied } from '@/api/axiosGeoJSON'
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

    const layers = useMemo(
        () =>
            werkingsgebied?.features?.[0]
                ? [
                      werkingsgebied?.features?.[0],
                      ...(onderverdeling?.features || []),
                  ]
                : onderverdeling?.features,
        [werkingsgebied, onderverdeling]
    )

    const initializeMap = () => {
        const defaultLayerOptions = {
            version: '1.3.0',
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
        const subLayerInstance = Leaflet.tileLayer.wms(
            `${import.meta.env.VITE_GEOSERVER_API_URL}/ows`,
            {
                layers: 'OMGEVINGSBELEID:Werkingsgebieden_Onderverdeling',
                ...defaultLayerOptions,
            }
        )

        layerInstance.addTo(map)
        subLayerInstance.addTo(map)
    }

    useEffectOnce(() => initializeMap())

    return (
        <LeafletControlLayer>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="p-2">
                    {/* {werkingsgebied?.map(layer => (
                        <LeafletAreaLayer
                            key={layer?.feature?.id}
                            layer={layer}
                        />
                    ))} */}
                    {layers?.map((layer, index) => (
                        <LeafletAreaLayer
                            key={layer.id}
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
