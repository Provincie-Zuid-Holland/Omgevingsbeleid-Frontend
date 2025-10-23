import { useQueries } from '@tanstack/react-query'
import Leaflet, { Layer } from 'leaflet'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'

import { Feature, getGeoJsonData } from '@/api/axiosGeoJSON'
import ToggleableSection from '@/components/ToggleableSection'

import { useWerkingsgebied } from '@/hooks/useWerkingsgebied'
import { LeafletAreaLayer, LeafletControlLayer } from '../LeafletLayers'
import LeafletMap from '../LeafletMap'

type FeatureLayer = Layer & {
    feature?: Feature
}

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

interface LeafletRevisionOverviewProps {
    area: {
        old?: number
        new?: number
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

    const [werkingsgebied, setWerkingsgebied] = useState<FeatureLayer[]>([])
    const layerRefs = useRef<{
        from?: Leaflet.GeoJSON | null
        to?: Leaflet.GeoJSON | null
    }>({
        from: null,
        to: null,
    })

    const { Area_UUID: oldUUID } = useWerkingsgebied(area.old!) || {}
    const { Area_UUID: newUUID } = useWerkingsgebied(area.new!) || {}

    const geoQueries = useQueries({
        queries: [
            {
                queryKey: ['mainDataFrom', area.type, oldUUID],
                queryFn: () => getGeoJsonData(area.type, oldUUID!, { signal }),
                enabled: !!area.type && !!oldUUID,
            },
            {
                queryKey: ['mainDataTo', area.type, newUUID],
                queryFn: () => getGeoJsonData(area.type, newUUID!, { signal }),
                enabled: !!area.type && !!newUUID && area.old !== area.new,
            },
        ],
    })

    // single effect that adds/removes layers deterministically
    useEffect(() => {
        // remove previous layers first (handles StrictMode re-runs and data changes)
        if (layerRefs.current.from && map.hasLayer(layerRefs.current.from)) {
            map.removeLayer(layerRefs.current.from)
        }
        if (layerRefs.current.to && map.hasLayer(layerRefs.current.to)) {
            map.removeLayer(layerRefs.current.to)
        }
        layerRefs.current = { from: null, to: null }
        setWerkingsgebied([])

        const mainData = {
            from: geoQueries[0]?.data,
            to: geoQueries[1]?.data,
        }

        if (!area) return

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

        // Optional: if the UUIDs are the same, only render one layer
        const sameUUID = oldUUID && newUUID && oldUUID === newUUID

        const fromLayer =
            mainData.from &&
            Leaflet.Proj.geoJson(mainData.from, {
                onEachFeature: (feature, layer) => {
                    if (feature.properties) {
                        layer.bindPopup(
                            feature.properties.Source_Title
                                ? feature.properties.Source_Title
                                : 'Deze laag heeft nog geen titel'
                        )
                    }
                },
                style: () => ({
                    stroke: true,
                    color: colorFrom,
                    fillColor: colorFrom,
                    fillOpacity: 0.2,
                }),
            })

        const toLayer =
            !sameUUID &&
            mainData.to &&
            Leaflet.Proj.geoJson(mainData.to, {
                onEachFeature: (feature, layer) => {
                    if (feature.properties) {
                        layer.bindPopup(
                            feature.properties.Source_Title
                                ? feature.properties.Source_Title
                                : 'Deze laag heeft nog geen titel'
                        )
                    }
                },
                style: () => ({
                    stroke: true,
                    color: colorTo,
                    fillColor: colorTo,
                    fillOpacity: 0.2,
                }),
            })

        if (fromLayer) {
            fromLayer.addTo(map)
            layerRefs.current.from = fromLayer
        }
        if (toLayer) {
            toLayer.addTo(map)
            layerRefs.current.to = toLayer
        }

        // build legend items from the *current* layers
        const items: Layer[] = []
        layerRefs.current.from?.eachLayer((l: Layer) => items.push(l))
        layerRefs.current.to?.eachLayer((l: Layer) => items.push(l))
        setWerkingsgebied(items)

        // cleanup between runs & on unmount
        return () => {
            if (
                layerRefs.current.from &&
                map.hasLayer(layerRefs.current.from)
            ) {
                map.removeLayer(layerRefs.current.from)
            }
            if (layerRefs.current.to && map.hasLayer(layerRefs.current.to)) {
                map.removeLayer(layerRefs.current.to)
            }
            layerRefs.current = { from: null, to: null }
            setWerkingsgebied([])
        }
        // Depend on the actual data so we only run when layers can be drawn
    }, [map, area, oldUUID, newUUID, geoQueries[0]?.data, geoQueries[1]?.data])

    useEffect(() => {
        map.invalidateSize()
    }, [map])

    useEffect(() => () => controller.abort(), [controller])

    return (
        <LeafletControlLayer>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="p-2">
                    {werkingsgebied?.map(layer => (
                        <LeafletAreaLayer
                            key={
                                layer?.feature?.id ?? Leaflet.Util.stamp(layer)
                            }
                            layer={layer}
                            color={(layer as any).options?.color}
                        />
                    ))}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletRevisionOverview
