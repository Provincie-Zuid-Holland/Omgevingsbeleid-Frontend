import { useUpdateEffect } from '@react-hookz/web'
import { useQueries } from '@tanstack/react-query'
import Leaflet, { Layer } from 'leaflet'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'

import { getGeoJsonData } from '@/api/axiosGeoJSON'
import ToggleableSection from '@/components/ToggleableSection'

import { LeafletAreaLayer, LeafletControlLayer } from '../LeafletLayers'
import LeafletMap from '../LeafletMap'

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

interface LeafletRevisionOverviewProps {
    area: {
        old?: string
        new?: string
        type: string
    }
    id?: string
}

const LeafletRevisionOverview = ({
    area,
    id = 'leaflet-revision-overview',
}: LeafletRevisionOverviewProps) => (
    <LeafletMap
        options={{
            center: [52.086531, 4.316168],
            zoom: 4,
            boundsOptions: { padding: [100, 100] },
        }}
        controllers={{ showLayers: false }}
        id={id}>
        <LeafletRevisionOverviewInner area={area} />
    </LeafletMap>
)

const LeafletRevisionOverviewInner = ({
    area,
}: LeafletRevisionOverviewProps) => {
    const controller = useMemo(() => new AbortController(), [])
    const signal = controller.signal

    const map = useMap()

    const [werkingsgebied, setWerkingsgebied] = useState<any[]>([])

    const geoQueries = useQueries({
        queries: [
            {
                queryKey: ['mainDataFrom', area.type, area.old],
                queryFn: () => getGeoJsonData(area.type, area.old!, { signal }),
                enabled: !!area.type && !!area.old,
            },
            {
                queryKey: ['mainDataTo', area.type, area.new],
                queryFn: () => getGeoJsonData(area.type, area.new!, { signal }),
                enabled: !!area.type && !!area.new && area.old !== area.new,
            },
        ],
    })

    /**
     * Function that removes a layer from the currentLeafletMap.leafletElement if currentLeafletmap and this.state.boundsObject contain a value.
     * It then imports the API axiosGeoJSON and then uses the GeoJsonData.
     */
    const initializeComponent = useCallback(() => {
        const mainData = {
            from: geoQueries[0].data,
            to: geoQueries[1].data,
        }

        const colorFrom =
            area.old === area.new
                ? '#7BADDE'
                : !area.new || area.old !== area.new
                ? '#00804D'
                : '#D11F3D'

        const colorTo =
            area.old === area.new
                ? '#7BADDE'
                : !area.old || area.old !== area.new
                ? '#D11F3D'
                : '#00804D'

        const mainLayer = {
            from:
                mainData.from &&
                Leaflet.Proj.geoJson(mainData.from, {
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
                            color: colorFrom,
                            fillColor: colorFrom,
                            fillOpacity: 0.2,
                        }
                    },
                }),
            to:
                mainData.to &&
                Leaflet.Proj.geoJson(mainData.to, {
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
                            color: colorTo,
                            fillColor: colorTo,
                            fillOpacity: 0.2,
                        }
                    },
                }),
        }

        mainLayer.from?.addTo(map)
        mainLayer.to?.addTo(map)

        const mainLayerArray: Layer[] = []

        mainLayer.from?.eachLayer((layer: Layer) => {
            mainLayerArray.push(layer)
        })

        mainLayer.to?.eachLayer((layer: Layer) => {
            mainLayerArray.push(layer)
        })

        setWerkingsgebied(mainLayerArray)
    }, [geoQueries, map, area])

    useEffect(() => {
        werkingsgebied.map(layer => {
            map.removeLayer(layer)
        })
        setWerkingsgebied([])

        if (!area) return

        initializeComponent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, area])

    useUpdateEffect(() => {
        initializeComponent()
    }, [geoQueries[0].data, geoQueries[1].data])

    useEffect(() => {
        map.invalidateSize()
    }, [map])

    useEffect(() => {
        return () => {
            controller.abort()
        }
    }, [controller])

    return (
        <LeafletControlLayer>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="p-2">
                    {werkingsgebied?.map(layer => (
                        <LeafletAreaLayer
                            key={layer?.feature?.id}
                            layer={layer}
                            color={layer.options.color}
                        />
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletRevisionOverview
