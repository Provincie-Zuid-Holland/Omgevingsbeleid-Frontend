import { useQueries } from '@tanstack/react-query'
import Leaflet, { Layer } from 'leaflet'
import 'leaflet.pattern'

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
        id={id}
        ariaLabel="Hier staat een kaartviewer wat de verschillen laat zien tussen twee versies van een kaart.">
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

    // store hatch patterns per map instance
    const patternRef = useRef<{
        same?: Leaflet.StripePattern
        from?: Leaflet.StripePattern
        to?: Leaflet.StripePattern
    }>({})

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

    const ensurePatterns = () => {
        // already created?
        if (patternRef.current.same) {
            return patternRef.current
        }

        // 1) blue (same)
        const samePattern = new Leaflet.StripePattern({
            weight: 4,
            spaceWeight: 4,
            color: '#281F6B',
            spaceColor: '#ffffff',
            opacity: 1,
            spaceOpacity: 0,
        })
        samePattern.addTo(map)

        // 2) green (from)
        const fromPattern = new Leaflet.StripePattern({
            weight: 4,
            spaceWeight: 4,
            color: '#00804D',
            spaceColor: '#ffffff',
            opacity: 1,
            spaceOpacity: 0,
            angle: 45,
        })
        fromPattern.addTo(map)

        // 3) red (to) – opposite angle for visual difference
        const toPattern = new Leaflet.StripePattern({
            weight: 4,
            spaceWeight: 4,
            color: '#D11F3D',
            spaceColor: '#ffffff',
            opacity: 1,
            spaceOpacity: 0,
            angle: 135,
        })
        toPattern.addTo(map)

        patternRef.current = {
            same: samePattern,
            from: fromPattern,
            to: toPattern,
        }

        return patternRef.current
    }

    const getPatternForColor = (color?: string) => {
        const patterns = ensurePatterns()
        switch (color) {
            case '#281F6B':
                return patterns.same
            case '#00804D':
                return patterns.from
            case '#D11F3D':
                return patterns.to
            default:
                return undefined
        }
    }
    // single effect that adds/removes layers deterministically
    useEffect(() => {
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
                ? '#281F6B'
                : !area.new || area.old !== area.new
                  ? '#00804D'
                  : '#D11F3D'

        const colorTo =
            area.old === area.new
                ? '#281F6B'
                : !area.old || area.old !== area.new
                  ? '#D11F3D'
                  : '#00804D'

        const sameUUID = oldUUID && newUUID && oldUUID === newUUID

        const fromPattern = getPatternForColor(colorFrom)
        const toPattern = getPatternForColor(colorTo)

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
                style: () =>
                    ({
                        stroke: true,
                        color: colorFrom,
                        weight: 1,
                        fillOpacity: 1,
                        // leaflet.pattern fills:
                        fillPattern: fromPattern,
                    }) as any,
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
                style: () =>
                    ({
                        stroke: true,
                        color: colorTo,
                        weight: 1,
                        fillOpacity: 1,
                        fillPattern: toPattern,
                    }) as any,
            })

        if (fromLayer) {
            fromLayer.addTo(map)
            layerRefs.current.from = fromLayer
        }
        if (toLayer) {
            toLayer.addTo(map)
            layerRefs.current.to = toLayer
        }

        const items: Layer[] = []
        layerRefs.current.from?.eachLayer((l: Layer) => items.push(l))
        layerRefs.current.to?.eachLayer((l: Layer) => items.push(l))
        setWerkingsgebied(items)

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
