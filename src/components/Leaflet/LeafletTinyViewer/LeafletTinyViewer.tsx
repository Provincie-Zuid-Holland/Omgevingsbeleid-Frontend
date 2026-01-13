import { useQuery } from '@tanstack/react-query'
import Leaflet, { TileLayer } from 'leaflet'
import { useCallback, useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'

import {
    Feature,
    getGeoserverLayer,
    getWerkingsgebied,
} from '@/api/axiosGeoJSON'
import ToggleableSection from '@/components/ToggleableSection'

import { LeafletAreaLayer, LeafletControlLayer } from '../LeafletLayers'
import LeafletMap from '../LeafletMap'

interface LeafletTinyViewerProps {
    uuid: string
    isSource?: boolean
}

const LeafletTinyViewer = ({ uuid, isSource }: LeafletTinyViewerProps) => (
    <LeafletMap
        options={{
            center: [52, 4.316168],
            zoom: 4,
            boundsOptions: { padding: [100, 100] },
        }}
        controllers={{ showLayers: false }}
        id={`leaflet-tiny-viewer-${uuid}`}
        ariaLabel="Hier staat een kaartviewer waarin de kaart wordt weergegeven waar ons beleid van toepassing is.">
        <LeafletTinyViewerInner uuid={uuid} isSource={isSource} />
    </LeafletMap>
)

const LeafletTinyViewerInner = ({ uuid, isSource }: LeafletTinyViewerProps) => {
    const map = useMap()

    const { data: werkingsgebied } = useQuery({
        queryKey: ['werkingsgebied', uuid],
        queryFn: () => getWerkingsgebied(uuid),
        enabled: !!uuid,
    })
    // const { data: onderverdeling } = useQuery({
    //     queryKey: ['onderverdeling', uuid],
    //     queryFn: () => getOnderverdeling(uuid),
    //     enabled: !!uuid,
    // })

    const [layerIntance, setLayerInstance] = useState<{
        werkingsgebied?: TileLayer.WMS
        onderverdeling?: TileLayer.WMS
    }>()
    const [layers, setLayers] = useState<Feature[]>([])
    const [layerFilter, setLayerFilter] = useState<{
        werkingsgebied?: boolean
        layers?: string[]
    }>({ werkingsgebied: true })

    const initializeMap = () => {
        // const filters = onderverdeling?.features
        //     ?.map(s => s.properties.Onderverdeling)
        //     .filter(Boolean)
        setLayerFilter({
            ...layerFilter,
            //layers: filters
        })

        const defaultLayerOptions = {
            version: '1.3.0',
            format: 'image/png',
            transparent: true,
            cql_filter: `Werkingsgebied_UUID='${uuid}'`,
            tiled: true,
            updateWhenZooming: false,
            tileSize: 512,
        }

        const layerInstance = Leaflet.tileLayer.wms(
            `${
                import.meta.env.VITE_GEOSERVER_API_URL
            }/geoserver/Omgevingsbeleid/wms`,
            {
                layers: getGeoserverLayer(isSource),
                zIndex: 1,
                ...defaultLayerOptions,
            }
        )
        // const subLayerInstance = Leaflet.tileLayer.wms(
        //     `${
        //         import.meta.env.VITE_GEOSERVER_API_URL
        //     }/geoserver/Omgevingsbeleid/wms`,
        //     {
        //         layers: 'Omgevingsbeleid:Werkingsgebieden_Onderverdeling',
        //         zIndex: 2,
        //         ...defaultLayerOptions,
        //     }
        // )

        layerInstance.addTo(map)
        // subLayerInstance.addTo(map)

        const layers: Feature[] = []

        // onderverdeling?.features?.forEach(feature => {
        //     layers.push(feature)
        // })

        setLayerInstance({
            werkingsgebied: layerInstance,
            // onderverdeling: subLayerInstance,
        })
        setLayers(layers)
    }

    useEffect(
        () => /*onderverdeling || */ werkingsgebied && initializeMap(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [/* onderverdeling , */ werkingsgebied]
    )

    const handleFilter = useCallback(
        (name: string) => {
            let newFilter: string[]

            if (layerFilter?.layers?.includes(name)) {
                newFilter = layerFilter?.layers.filter(s => s !== name)
            } else {
                newFilter = [...(layerFilter.layers || []), name]
            }

            setLayerFilter({ ...layerFilter, layers: newFilter })

            layerIntance?.onderverdeling?.setParams({
                // @ts-ignore
                cql_filter: `UUID='${uuid}' AND Onderverdeling IN (${newFilter
                    .map(s => `'${s}'`)
                    .join(', ')})`,
            })
        },
        [layerFilter, layerIntance?.onderverdeling, uuid]
    )

    return (
        <LeafletControlLayer>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="flex flex-col gap-1 p-2 text-left">
                    {werkingsgebied?.features?.[0] &&
                        layerIntance?.werkingsgebied && (
                            <LeafletAreaLayer
                                isActive={layerFilter?.werkingsgebied}
                                onClick={() => {
                                    map.hasLayer(layerIntance.werkingsgebied!)
                                        ? layerIntance.werkingsgebied?.remove()
                                        : layerIntance.werkingsgebied?.addTo(
                                              map
                                          )
                                    setLayerFilter({
                                        ...layerFilter,
                                        werkingsgebied:
                                            !layerFilter.werkingsgebied,
                                    })
                                }}
                                {...werkingsgebied?.features?.[0]}
                            />
                        )}
                    {layers?.map((layer, index) => (
                        <LeafletAreaLayer
                            key={layer?.id}
                            index={(index + 1).toString()}
                            isActive={layerFilter?.layers?.includes(
                                layer?.properties.Onderverdeling || ''
                            )}
                            onClick={handleFilter}
                            {...layer}
                        />
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletTinyViewer
