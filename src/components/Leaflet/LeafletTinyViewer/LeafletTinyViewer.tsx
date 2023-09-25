import { useQueries, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Leaflet, { FeatureGroup, Layer, TileLayer } from 'leaflet'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'
import { useUpdateEffect } from 'react-use'

import { Feature, getGeoJsonData, getOnderverdeling } from '@/api/axiosGeoJSON'
import ToggleableSection from '@/components/ToggleableSection'
import { colors } from '@/constants/leaflet'

import { LeafletAreaLayer, LeafletControlLayer } from '../LeafletLayers'
import LeafletMap from '../LeafletMap'

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

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
    // const controller = useMemo(() => new AbortController(), [])
    // const signal = controller.signal

    const map = useMap()

    const { data } = useQuery({
        queryKey: ['onderverdeling', uuid],
        queryFn: () => getOnderverdeling(uuid),
        enabled: !!uuid,
    })

    const [layers, setLayers] = useState<
        { layer: TileLayer.WMS; context: Feature }[]
    >([])

    const onderverdelingen = useMemo(() => data?.features, [data])

    // /**
    //  * Function that removes a layer from the currentLeafletMap.leafletElement if currentLeafletmap and this.state.boundsObject contain a value.
    //  * It then imports the API axiosGeoJSON and then uses the GeoJsonData.
    //  */
    // const initializeComponent = useCallback(() => {
    //     const mainData = geoQueries[0].data
    //     const subData = geoQueries[1].data

    //     let colorsIndex = -1

    //     const mainLayer = Leaflet.Proj.geoJson(mainData, {
    //         onEachFeature: (feature, layer) => {
    //             if (feature.properties) {
    //                 layer.bindPopup(
    //                     feature.properties.Gebied
    //                         ? feature.properties.Gebied
    //                         : 'Deze laag heeft nog geen titel'
    //                 )
    //             }
    //         },
    //         style: () => {
    //             return {
    //                 stroke: true,
    //                 color: '#3388ff', // custom blue color for the first werkingsgebied,
    //                 fillColor: '#3388ff', // custom blue color for the first werkingsgebied,
    //                 fillOpacity: 0.2,
    //             }
    //         },
    //     })

    //     const subLayer = Leaflet.Proj.geoJson(subData, {
    //         onEachFeature: (feature, layer) => {
    //             if (feature.properties) {
    //                 layer.bindPopup(
    //                     feature.properties.Onderverdeling
    //                         ? feature.properties.Onderverdeling
    //                         : 'Deze laag heeft nog geen titel'
    //                 )
    //             }
    //         },
    //         style: () => {
    //             colorsIndex++
    //             return {
    //                 stroke: true,
    //                 color: colors[colorsIndex],
    //                 fillColor: colors[colorsIndex],
    //                 fillOpacity: 0.2,
    //             }
    //         },
    //     })

    //     mainLayer.addTo(map)
    //     subLayer.addTo(map)

    //     const mainLayerArray: Layer[] = []
    //     const subLayerArray: Layer[] = []

    //     mainLayer.eachLayer(layer => {
    //         mainLayerArray.push(layer)
    //     })

    //     subLayer.eachLayer(layer => {
    //         subLayerArray.push(layer)
    //     })

    //     setWerkingsgebied(mainLayerArray)
    //     setOnderverdelingen(subLayerArray)
    // }, [geoQueries, map])

    // useEffect(() => {
    //     werkingsgebied.map(layer => {
    //         map.removeLayer(layer)
    //     })
    //     setWerkingsgebied([])
    //     setOnderverdelingen([])

    //     if (!gebiedUUID) return

    //     initializeComponent()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [map, gebiedType, gebiedUUID])

    // useUpdateEffect(() => {
    //     initializeComponent()
    // }, [geoQueries[0].data, geoQueries[1].data])

    // useEffect(() => {
    //     map.invalidateSize()
    // }, [map])

    // useEffect(() => {
    //     return () => {
    //         controller.abort()
    //     }
    // }, [controller])

    const initializeMap = useCallback(
        (uuid: string) => {
            setLayers([])
            const layers: { layer: TileLayer.WMS; context: Feature }[] = []
            console.log(onderverdelingen)

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

            // ayerInstance.addTo(map)

            onderverdelingen?.forEach(onderverdeling => {
                const layer = Leaflet.tileLayer.wms(
                    `${import.meta.env.VITE_GEOSERVER_API_URL}/ows`,
                    {
                        layers: 'OMGEVINGSBELEID:Werkingsgebieden_Onderverdeling',
                        ...defaultLayerOptions,
                        cql_filter: `UUID='${onderverdeling.properties.UUID}'`,
                    }
                )

                layer.addTo(map)
                layers.push({ layer, context: onderverdeling })
            })

            setLayers(layers)

            console.log(layers)

            // subLayerInstance.addTo(map)
        },
        [onderverdelingen, map]
    )

    useUpdateEffect(() => {
        initializeMap(uuid)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onderverdelingen, uuid])

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
                    {layers?.map(({ layer, context }, index) => (
                        <LeafletAreaLayer
                            key={context.id}
                            layer={layer}
                            index={index}
                            {...context}
                        />
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletTinyViewer
