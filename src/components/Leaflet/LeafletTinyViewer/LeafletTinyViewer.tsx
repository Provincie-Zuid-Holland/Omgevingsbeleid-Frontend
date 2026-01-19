import { useQuery } from '@tanstack/react-query'
import Leaflet, { TileLayer } from 'leaflet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'

import {
    Feature,
    geoserverBaseURL,
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

const escapeCqlString = (s: string) => (s ?? '').replace(/'/g, "''")

const buildCql = (
    werkingsgebiedUuid: string,
    selectedOnderverdelingUuids: string[],
    isSource?: boolean
) => {
    const base = `${isSource ? 'Werkingsgebied_' : ''}UUID='${escapeCqlString(werkingsgebiedUuid)}'`

    if (!selectedOnderverdelingUuids?.length) return base

    const orChain = selectedOnderverdelingUuids
        .map(u => `Onderverdeling_UUID='${escapeCqlString(u)}'`)
        .join(' Or ')

    return orChain
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

    // This WFS response (as you showed) contains Onderverdeling_UUID + Onderverdeling
    // We use it to build the legend and to filter the single WMS layer.
    const { data: werkingsgebied } = useQuery({
        queryKey: ['werkingsgebied', uuid],
        queryFn: () => getWerkingsgebied(uuid),
        enabled: !!uuid,
    })

    const [layerFilter, setLayerFilter] = useState<{
        werkingsgebied: boolean
        onderverdelingUuids: string[]
    }>({ werkingsgebied: true, onderverdelingUuids: [] })

    const wmsRef = useRef<TileLayer.WMS | null>(null)

    // Legend items (deduped by Onderverdeling_UUID)
    const legendLayers: Feature[] = useMemo(() => {
        const feats = werkingsgebied?.features ?? []
        const seen = new Set<string>()
        const out: Feature[] = []

        for (const f of feats) {
            const u = f?.properties?.Onderverdeling_UUID
            if (!u) continue
            if (seen.has(u)) continue
            seen.add(u)
            out.push(f)
        }

        out.sort((a, b) =>
            (a?.properties?.Onderverdeling ?? '').localeCompare(
                b?.properties?.Onderverdeling ?? ''
            )
        )

        return out
    }, [werkingsgebied])

    useEffect(() => {
        if (!uuid) return
        if (!map) return
        if (!werkingsgebied) return

        if (wmsRef.current && map.hasLayer(wmsRef.current)) {
            map.removeLayer(wmsRef.current)
        }

        const layerInstance = Leaflet.tileLayer.wms(`${geoserverBaseURL}/wms`, {
            layers: getGeoserverLayer(isSource),
            zIndex: 1,
            version: '1.3.0',
            format: 'image/png',
            transparent: true,
            tiled: true,
            updateWhenZooming: false,
            tileSize: 512,
            cql_filter: buildCql(
                uuid,
                layerFilter.onderverdelingUuids,
                isSource
            ),
        })

        wmsRef.current = layerInstance

        if (layerFilter.werkingsgebied) {
            layerInstance.addTo(map)
        }

        // Cleanup on unmount
        return () => {
            if (wmsRef.current && map.hasLayer(wmsRef.current)) {
                map.removeLayer(wmsRef.current)
            }
            wmsRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, uuid, isSource, werkingsgebied])

    // Whenever selected onderverdelingen change, update the WMS CQL
    useEffect(() => {
        if (!uuid) return
        if (!wmsRef.current) return

        wmsRef.current.setParams({
            cql_filter: buildCql(uuid, layerFilter.onderverdelingUuids),
        })
    }, [uuid, layerFilter.onderverdelingUuids])

    // useEffect(() => {
    //     if (!werkingsgebied?.features?.length) return

    //     const allOnderverdelingUuids = Array.from(
    //         new Set(
    //             werkingsgebied.features
    //                 .map(f => f?.properties?.Onderverdeling_UUID)
    //                 .filter(Boolean)
    //         )
    //     )

    //     setLayerFilter(prev => {
    //         // prevent re-initializing if already set
    //         if (prev.onderverdelingUuids.length) return prev

    //         return {
    //             ...prev,
    //             onderverdelingUuids: allOnderverdelingUuids,
    //         }
    //     })
    // }, [werkingsgebied])

    const toggleOnderverdeling = useCallback((onderverdelingUuid: string) => {
        setLayerFilter(prev => {
            const prevSelected = prev.onderverdelingUuids ?? []
            const nextSelected = prevSelected.includes(onderverdelingUuid)
                ? prevSelected.filter(u => u !== onderverdelingUuid)
                : [...prevSelected, onderverdelingUuid]

            return { ...prev, onderverdelingUuids: nextSelected }
        })
    }, [])

    return (
        <LeafletControlLayer>
            <ToggleableSection title="Legenda" positionTop>
                <ul className="flex flex-col gap-1 p-2 text-left">
                    {legendLayers.map(layer => {
                        const u = layer?.properties?.Onderverdeling_UUID as
                            | string
                            | undefined
                        if (!u) return null

                        return (
                            <LeafletAreaLayer
                                key={layer.id ?? u}
                                isActive={layerFilter.onderverdelingUuids.includes(
                                    u
                                )}
                                onClick={() => toggleOnderverdeling(u)}
                                {...layer}
                            />
                        )
                    })}
                </ul>
            </ToggleableSection>
        </LeafletControlLayer>
    )
}

export default LeafletTinyViewer
