import { Map, point } from 'leaflet'
import Proj from 'proj4leaflet'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { useEffectOnce, useMedia, useUpdateEffect } from 'react-use'

import { getWerkingsGebieden } from '@/api/axiosGeoJSON'
import { postSearchGeo } from '@/api/fetchers'
import { GetSearchGeo200ResultsItem } from '@/api/fetchers.schemas'
import { ContainerMapSearch } from '@/components/Container'
import { LeafletMap } from '@/components/Leaflet'
import { mapPanTo } from '@/components/Leaflet/utils'
import { RDProj4, leafletBounds } from '@/constants/leaflet'
import useSearchFilterStore from '@/hooks/useSearchFilterStore'
import useSearchParam from '@/hooks/useSearchParam'

import SidebarInformation from './SidebarInformation'
import SidebarResults from './SidebarResults'

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

export const MAP_OPTIONS = {
    center: [51.985989, 4.6] as [number, number],
    zoom: 5,
}

const MapSearch = () => {
    const navigate = useNavigate()
    const { get } = useSearchParam()
    const [paramGeoQuery, paramSearchOpen, paramWerkingsgebied] = get([
        'geoQuery',
        'searchOpen',
        'werkingsgebied',
    ])
    const isSmall = useMedia('(max-width: 640px)')

    const [initialized, setInitialized] = useState(false)
    const [mapInstance, setMapInstance] = useState<Map | null>(null)
    const [UUIDs, setUUIDs] = useState<string[]>([])
    const [searchResultsTotal, setSearchResultsTotal] = useState(0)
    const [searchResults, setSearchResults] = useState<
        GetSearchGeo200ResultsItem[]
    >([])
    const [searchResultsLoading, setSearchResultsLoading] = useState(true)
    const [searchOpen, setSearchOpen] = useState(paramSearchOpen === 'true')
    const [drawType, setDrawType] = useState('')

    const initializeFilters = useSearchFilterStore(
        state => state.initializeFilters
    )

    /**
     * Set UUIDs of current location or area
     */
    const onDraw = async (callback: any) => {
        setSearchResults([])
        setUUIDs([])
        setSearchResultsLoading(true)

        if (callback.type === 'polygon') {
            setDrawType(callback.type)

            if (callback.features?.length) {
                const werkingsgebiedenUUIDS = callback.features.map(
                    (item: any) => item.properties.UUID
                )

                setUUIDs(werkingsgebiedenUUIDS)
            } else {
                setSearchResultsLoading(false)
            }
        } else if (callback.type === 'marker') {
            const werkingsgebieden = await getWerkingsGebieden(
                callback.point.x,
                callback.point.y
            )

            const werkingsgebiedenUUIDS = werkingsgebieden.map(
                (item: any) => item.properties.UUID
            )

            if (!werkingsgebieden.length) {
                setSearchResultsLoading(false)
            }

            setUUIDs(werkingsgebiedenUUIDS)
            setDrawType(callback.type)
        }
    }

    /**
     * Get search results from API based on provided UUIDs
     */
    const getSearchResults = async (UUIDs: string[]) => {
        setSearchResultsLoading(true)

        return postSearchGeo({ query: UUIDs.join(',') }).then(data => {
            setSearchResults(data.results || [])
            setSearchResultsTotal(data.total || 0)
            initializeFilters(data.results || [])
            setSearchResultsLoading(false)

            return data
        })
    }

    /**
     * If URL contains searchOpen=true open the results sidebar.
     */
    useUpdateEffect(() => {
        if (paramSearchOpen === 'true') {
            setSearchOpen(true)
            mapInstance?.closePopup()
        } else {
            setSearchResultsLoading(true)
            setSearchOpen(false)
        }

        if (
            paramSearchOpen === 'true' &&
            UUIDs.length &&
            !paramWerkingsgebied
        ) {
            getSearchResults(UUIDs)
        }

        if (paramSearchOpen === 'true' && paramWerkingsgebied) {
            getSearchResults([paramWerkingsgebied])
            setDrawType('werkingsgebied')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSearchOpen, paramWerkingsgebied, UUIDs, mapInstance])

    /**
     * If URL contains geoQuery, create marker or polygon.
     */
    useEffect(() => {
        const geoQuery = paramGeoQuery?.split(',')

        if (!geoQuery || !mapInstance || initialized) return

        mapInstance.whenReady(() => {
            if (geoQuery.length > 1) {
                const latLngs = geoQuery.map(item => {
                    const [x, y] = item.split('+')
                    const { lat, lng } = RDProjection.unproject(
                        point(parseFloat(x), parseFloat(y))
                    )

                    return { lat, lng }
                })

                mapPanTo({
                    map: mapInstance,
                    navigate,
                    latLngs,
                    type: '',
                    layerType: 'polygon',
                    callback: onDraw,
                })

                setInitialized(true)
            } else {
                const [x, y] = geoQuery[0].split('+')

                const { lat, lng } = RDProjection.unproject(
                    point(parseFloat(x), parseFloat(y))
                )

                mapPanTo({
                    map: mapInstance,
                    navigate,
                    lng: parseFloat(parseFloat(lng).toFixed(20)),
                    lat: parseFloat(parseFloat(lat).toFixed(20)),
                    type: '',
                    layerType: 'marker',
                    callback: onDraw,
                })

                setInitialized(true)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramGeoQuery, mapInstance])

    useEffectOnce(() => {
        const geoQuery = paramGeoQuery?.split(',')

        if (!geoQuery) return setInitialized(true)
    })

    useEffect(() => {
        if (searchOpen && isSmall) {
            mapInstance?.invalidateSize()
            window.scrollTo(0, 0)
        }
    }, [searchOpen, isSmall, mapInstance])

    /**
     * Memoize LeafletMap component so it won't rerender on changes
     */
    const map = useMemo(
        () => (
            <LeafletMap
                controllers={{
                    showLayers: false,
                    showDraw: isSmall ? !searchOpen : true,
                    showZoom: isSmall ? !searchOpen : true,
                    showSearch: false,
                }}
                callbacks={{
                    onDraw,
                }}
                options={{
                    ...MAP_OPTIONS,
                    whenCreated: setMapInstance,
                }}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchOpen && isSmall]
    )

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Zoeken op de kaart</title>
            </Helmet>
            <ContainerMapSearch className="overflow-hidden border-t">
                <SidebarInformation
                    mapInstance={mapInstance}
                    searchOpen={searchOpen}
                    onDraw={onDraw}
                />

                <div
                    className={`leaflet-advanced-search w-full md:h-auto ${
                        searchOpen ? 'h-44' : 'h-80'
                    }`}>
                    {map}
                </div>

                <SidebarResults
                    searchOpen={searchOpen}
                    searchResultsTotal={searchResultsTotal}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    isLoading={searchResultsLoading}
                    drawType={drawType}
                    UUIDs={UUIDs}
                />
            </ContainerMapSearch>

            <div id="select-werkingsgebied-portal" />
        </>
    )
}

export default MapSearch
