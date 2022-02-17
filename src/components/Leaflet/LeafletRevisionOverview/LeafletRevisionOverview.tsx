import axios from 'axios'
import Leaflet, { Layer, PathOptions } from 'leaflet'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import { toast } from 'react-toastify'

import { getGeoJsonData, getOnderverdeling } from '@/api/axiosGeoJSON'
import { LoaderLeafletTinyViewer } from '@/components/Loader'
import ToggleableSection from '@/components/ToggleableSection'
import { colors } from '@/constants/leaflet'

import { LeafletMap } from '..'
import { LeafletAreaLayer, LeafletControlLayer } from '../LeafletLayers'

/**
 * Function that renders the LeafletRevisionOverwiew component based on if the dataReceived state is set to true, it will display the following components imported from react-leaflet:
 * - Map -- In which the user sees a map it can interact with of all the Werkingsgebieden.
 * - LeafletController -- Which contains a interactive legenda, which the user can use to filter on the map.
 * - LayersControl -- Which contains an interactive layer control, which the user can use to cycle through layers on the map to present different information and overlays.
 *
 * If the dataReceived state is false, the default imported LoaderLeafletTinyViewer component will be shown.
 */

interface LeafletRevisionOverviewProps {
    gebiedenChanges: any
    gebiedenUUIDS: any
}

const LeafletRevisionOverview = ({
    gebiedenChanges,
    gebiedenUUIDS,
}: LeafletRevisionOverviewProps) => {
    const [layers, setLayers] = useState<any>(null)

    const getColorOfGebied = useCallback(
        (uuid: string) => {
            // Fallback
            if (!uuid || typeof uuid !== 'string') {
                console.error(
                    `The argument of 'uuid' was not of the type 'string' but of type '${typeof uuid}'`
                )
                return {
                    stroke: true,
                    color: '#2980B9',
                    fillColor: '#2980B9',
                    fillOpacity: 0.2,
                }
            }

            uuid = uuid.toUpperCase()

            const isDeleted = gebiedenChanges.removed.includes(uuid)
            const isSame = gebiedenChanges.same.includes(uuid)
            const isNew = gebiedenChanges.new.includes(uuid)
            const hexColor = isDeleted
                ? '#E74C3C' // Red
                : isSame
                ? '#2980B9' // Blue
                : isNew
                ? '#2ECC71' // Green
                : '#2980B9' // Default

            return {
                stroke: true,
                color: hexColor, // custom blue color for the first werkingsgebied,
                fillColor: hexColor, // custom blue color for the first werkingsgebied,
                fillOpacity: 0.2,
            }
        },
        [gebiedenChanges]
    )

    const initializeComponent = () => {
        gebiedenUUIDS.forEach(async (uuid: string) => {
            Promise.all([
                getGeoJsonData('Werkingsgebieden', uuid),
                getOnderverdeling(uuid),
            ])
                .then(responses => {
                    const geoJsonData = responses[0]
                    const onderverdelingData = responses[1]

                    let colorsIndex = -1

                    const geoJsonLayer = Leaflet.Proj.geoJson(geoJsonData, {
                        style: () => getColorOfGebied(uuid) as PathOptions,
                    })

                    const onderverdelingJsonLayer = Leaflet.Proj.geoJson(
                        onderverdelingData,
                        {
                            onEachFeature: (feature, layer) => {
                                if (feature.properties) {
                                    layer.bindPopup(
                                        feature.properties.Onderverdeling
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

                    setLayers({ geoJsonLayer, onderverdelingJsonLayer })
                })
                .catch(err => {
                    if (axios.isCancel(err)) {
                        console.log('Request canceled -', err.message)
                    } else {
                        console.log(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    }
                })
        })
    }

    useEffect(() => {
        initializeComponent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gebiedenUUIDS])

    if (!layers) return <LoaderLeafletTinyViewer />

    return (
        <LeafletMap
            options={{
                boundsOptions: { padding: [100, 100] },
            }}
            controllers={{ showLayers: false }}
            id="leaflet-tiny-viewer">
            <LeafletRevisionOverviewInner
                gebiedenUUIDS={gebiedenUUIDS}
                {...layers}
            />
        </LeafletMap>
    )
}

interface LeafletRevisionOverviewInnerProps {
    geoJsonLayer: Leaflet.Proj.GeoJSON
    onderverdelingJsonLayer: Leaflet.Proj.GeoJSON
}

const LeafletRevisionOverviewInner = ({
    geoJsonLayer,
    onderverdelingJsonLayer,
}: LeafletRevisionOverviewInnerProps) => {
    const map = useMap()

    const [onderverdelingen, setOnderverdelingen] = useState<any[]>([])
    const [werkingsgebied, setWerkingsgebied] = useState<any[]>([])

    const initializeComponent = () => {
        const geoJsonLayerArray: Layer[] = []
        const onderverdelingLayerArray: Layer[] = []

        geoJsonLayer.addTo(map)
        onderverdelingJsonLayer.eachLayer(layer =>
            onderverdelingLayerArray.push(layer)
        )
        geoJsonLayer.eachLayer(layer => geoJsonLayerArray.push(layer))

        setWerkingsgebied([...werkingsgebied, ...geoJsonLayerArray])
        setOnderverdelingen([...onderverdelingen, ...onderverdelingLayerArray])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => initializeComponent(), [])

    return (
        <LeafletControlLayer>
            <ToggleableSection positionTop title="Legenda">
                <ul className="p-2">
                    {werkingsgebied?.map(layer => (
                        <Fragment key={layer.feature.id}>
                            <LeafletAreaLayer
                                key={layer.feature.id}
                                layer={layer}
                            />

                            {onderverdelingen
                                ?.filter(
                                    onderverdeling =>
                                        onderverdeling.feature.properties
                                            .Werkingsgebied ===
                                        layer.feature.properties.Gebied
                                )
                                .map((layer, index) => (
                                    <LeafletAreaLayer
                                        key={layer.feature.id}
                                        layer={layer}
                                        index={index.toString()}
                                    />
                                ))}
                        </Fragment>
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletRevisionOverview
