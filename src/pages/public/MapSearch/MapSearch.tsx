import classNames from 'classnames'
import { point } from 'leaflet'
import Proj from 'proj4leaflet'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { useEffectOnce, useUpdateEffect } from 'react-use'

import { getWerkingsGebieden } from '@/api/axiosGeoJSON'
import { ContainerMapSearch } from '@/components/Container'
import { LeafletMap } from '@/components/Leaflet'
import { mapPanTo } from '@/components/Leaflet/utils'
import { LoaderSpinner } from '@/components/Loader'
import { RDProj4, leafletBounds } from '@/constants/leaflet'
import useBreakpoint from '@/hooks/useBreakpoint'
import useSearchParam from '@/hooks/useSearchParam'
import useMapStore from '@/store/mapStore'

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
    const [paramGeoQuery, paramSidebarOpen, paramWerkingsgebied] = get([
        'geoQuery',
        'sidebarOpen',
        'werkingsgebied',
    ])
    const { isMobile } = useBreakpoint()

    const mapInstance = useMapStore(state => state.mapInstance)
    const setMapInstance = useMapStore(state => state.setMapInstance)
    const sidebarOpen = useMapStore(
        state => (state.sidebarOpen = paramSidebarOpen === 'true')
    )
    const isAreaLoading = useMapStore(state => state.isAreaLoading)
    const setSidebarOpen = useMapStore(state => state.setSidebarOpen)
    const setIsDataLoading = useMapStore(state => state.setIsDataLoading)
    const setDrawType = useMapStore(state => state.setDrawType)

    const [previousRequestController, setPreviousRequestController] =
        useState<AbortController | null>(null)

    const [initialized, setInitialized] = useState(false)
    const [UUIDs, setUUIDs] = useState<string[]>([])

    /**
     * Set UUIDs of current location or area
     */
    const onDraw = async (callback: any) => {
        // Check if there's a previous request and cancel it
        if (previousRequestController) {
            previousRequestController.abort() // Cancel the previous request
        }

        // Create a new AbortController instance for the current request
        const currentRequestController = new AbortController()
        setPreviousRequestController(currentRequestController)

        setUUIDs([])
        setIsDataLoading(true)

        if (callback.type === 'polygon') {
            setDrawType(callback.type)

            if (callback.features?.length) {
                const werkingsgebiedenUUIDS = callback.features.map(
                    (item: any) => item.properties.UUID
                )

                setUUIDs(werkingsgebiedenUUIDS)
                setIsDataLoading(false)
            } else {
                setIsDataLoading(false)
            }
        } else if (callback.type === 'marker') {
            const werkingsgebieden = await getWerkingsGebieden(
                callback.point.x,
                callback.point.y,
                { signal: currentRequestController.signal }
            ).then(data => {
                setIsDataLoading(false)
                return data
            })

            const werkingsgebiedenUUIDS = werkingsgebieden.map(
                (item: any) => item.properties.UUID
            )

            if (!werkingsgebieden.length) {
                setIsDataLoading(false)
            }

            setUUIDs(werkingsgebiedenUUIDS)
            setDrawType(callback.type)
        }
    }

    /**
     * If URL contains sidebarOpen=true open the results sidebar.
     */
    useUpdateEffect(() => {
        if (paramSidebarOpen === 'true') {
            setSidebarOpen(true)
            mapInstance?.closePopup()
        } else {
            setSidebarOpen(false)
        }

        if (sidebarOpen && paramWerkingsgebied) {
            setDrawType('werkingsgebied')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSidebarOpen, paramWerkingsgebied, mapInstance])

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
        if (sidebarOpen && isMobile) {
            mapInstance?.invalidateSize()
            window.scrollTo(0, 0)
        }
    }, [sidebarOpen, isMobile, mapInstance])

    /**
     * Memoize LeafletMap component so it won't rerender on changes
     */
    const map = useMemo(
        () => (
            <LeafletMap
                controllers={{
                    showLayers: false,
                    showDraw: isMobile ? !sidebarOpen : true,
                    showZoom: isMobile ? !sidebarOpen : true,
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
        [sidebarOpen && isMobile]
    )

    return (
        <>
            <Helmet title="Zoeken op de kaart" />
            <ContainerMapSearch className="overflow-hidden">
                <SidebarInformation onDraw={onDraw} />

                <div
                    className={classNames('relative w-full md:h-auto', {
                        'h-44': sidebarOpen,
                        'h-80': !sidebarOpen,
                    })}>
                    {isAreaLoading && (
                        <div className="absolute left-0 top-0 z-1 flex h-full w-full items-center justify-center">
                            <LoaderSpinner />
                        </div>
                    )}
                    <div
                        className={classNames(
                            'leaflet-advanced-search h-full w-full',
                            {
                                'animate-pulse': isAreaLoading,
                            }
                        )}>
                        {map}
                    </div>{' '}
                </div>

                <SidebarResults UUIDs={UUIDs} />
            </ContainerMapSearch>

            <div id="select-werkingsgebied-portal" />
        </>
    )
}

export default MapSearch
