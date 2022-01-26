import axios from 'axios'
import Leaflet, { Layer } from 'leaflet'
import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import { toast } from 'react-toastify'

import { getGeoJsonData, getOnderverdeling } from '@/api/axiosGeoJSON'
import ToggleableSection from '@/components/ToggleableSection'
import { colors } from '@/constants/leaflet'

import { LeafletAreaLayer, LeafletLayer } from '../LeafletLayers'
import LeafletMap from '../LeafletMap'

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

interface LeafletTinyViewerProps {
    fullscreen?: boolean
    gebiedUUID: string
    gebiedType: string
}

const LeafletTinyViewer = ({
    fullscreen,
    gebiedUUID,
    gebiedType,
}: LeafletTinyViewerProps) => (
    <LeafletMap
        options={{
            center: [52.086531, 4.316168],
            zoom: 5,
            boundsOptions: { padding: [100, 100] },
        }}
        id="leaflet-tiny-viewer">
        <LeafletTinyViewerInner
            fullscreen={fullscreen}
            gebiedUUID={gebiedUUID}
            gebiedType={gebiedType}
        />
    </LeafletMap>
)

interface LeafletTinyViewerInnerProps {
    fullscreen?: boolean
    gebiedUUID: string
    gebiedType: string
}

const LeafletTinyViewerInner = ({
    fullscreen,
    gebiedType,
    gebiedUUID,
}: LeafletTinyViewerInnerProps) => {
    const map = useMap()

    const [onderverdelingen, setOnderverdelingen] = useState<any[]>([])
    const [werkingsgebied, setWerkingsgebied] = useState<any[]>([])

    /**
     * Function that removes a layer from the currentLeafletMap.leafletElement if currentLeafletmap and this.state.boundsObject contain a value.
     * It then imports the API axiosGeoJSON and then uses the GeoJsonData.
     */
    const initializeComponent = () => {
        Promise.all([
            getGeoJsonData(gebiedType, gebiedUUID),
            getOnderverdeling(gebiedType, gebiedUUID),
        ])
            .then(responses => {
                const geoJsonData = responses[0]
                const onderverdelingData = responses[1]

                let colorsIndex = -1

                const geoJsonLayer = Leaflet.Proj.geoJson(geoJsonData, {
                    onEachFeature: (feature, layer) => {
                        if (feature.properties) {
                            layer.bindPopup(
                                feature.properties.Gebied
                                    ? feature.properties.Gebied
                                    : 'Deze laag heeft nog geen titel'
                            )
                        }
                    },
                    style: () => {
                        return {
                            stroke: true,
                            color: '#3388ff', // custom blue color for the first werkingsgebied,
                            fillColor: '#3388ff', // custom blue color for the first werkingsgebied,
                            fillOpacity: 0.2,
                        }
                    },
                })

                const onderverdelingJsonLayer = Leaflet.Proj.geoJson(
                    onderverdelingData,
                    {
                        onEachFeature: (feature, layer) => {
                            if (feature.properties) {
                                layer.bindPopup(
                                    feature.properties.Onderverdeling
                                        ? feature.properties.Onderverdeling
                                        : 'Deze laag heeft nog geen titel'
                                )
                            }
                        },
                        style: () => {
                            colorsIndex++
                            return {
                                stroke: true,
                                color: colors[colorsIndex],
                                fillColor: colors[colorsIndex],
                                fillOpacity: 0.2,
                            }
                        },
                    }
                )

                geoJsonLayer.addTo(map)

                const geoJsonLayerArray: Layer[] = []
                const onderverdelingLayerArray: Layer[] = []

                geoJsonLayer.eachLayer(function (layer) {
                    geoJsonLayerArray.push(layer)
                })

                onderverdelingJsonLayer.eachLayer(function (layer) {
                    onderverdelingLayerArray.push(layer)
                })

                setWerkingsgebied(geoJsonLayerArray)
                setOnderverdelingen(onderverdelingLayerArray)
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled -', err.message)
                } else {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }

    useEffect(() => {
        initializeComponent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, gebiedType, gebiedUUID])

    useEffect(() => {
        map.invalidateSize()
    }, [fullscreen, map])

    return (
        <LeafletLayer fullscreen={fullscreen}>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="p-2">
                    {werkingsgebied?.map(layer => (
                        <LeafletAreaLayer
                            key={layer?.feature?.id}
                            layer={layer}
                        />
                    ))}
                    {onderverdelingen?.map((layer, index) => (
                        <LeafletAreaLayer
                            key={layer?.feature?.id}
                            layer={layer}
                            index={index.toString()}
                        />
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletLayer>
    )
}

export default LeafletTinyViewer
