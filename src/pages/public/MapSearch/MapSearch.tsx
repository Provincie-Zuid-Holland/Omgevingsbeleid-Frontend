import { useMountEffect, useUpdateEffect } from '@react-hookz/web'
import classNames from 'classnames'
import { point } from 'leaflet'
import Proj from 'proj4leaflet'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

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
    const { get, remove } = useSearchParam()
    const [paramGeoQuery, paramSidebarOpen, paramWerkingsgebied, paramPage] =
        get(['geoQuery', 'sidebarOpen', 'werkingsgebied', 'page'])
    const { isMobile } = useBreakpoint()

    const mapInstance = useMapStore(state => state.mapInstance)
    const setMapInstance = useMapStore(state => state.setMapInstance)
    const sidebarOpen = useMapStore(
        state => (state.sidebarOpen = paramSidebarOpen === 'true')
    )
    const isAreaLoading = useMapStore(state => state.isAreaLoading)
    const setSidebarOpen = useMapStore(state => state.setSidebarOpen)
    const setDrawType = useMapStore(state => state.setDrawType)
    const pagination = useMapStore(state => state.pagination)
    const setPagination = useMapStore(state => state.setPagination)
    const setCurrPage = useMapStore(state => state.setCurrPage)

    const [initialized, setInitialized] = useState(false)

    const paginationRef = useRef(pagination)
    const pageRef = useRef(paramPage)

    // Update the paginationRef when pagination changes
    useEffect(() => {
        paginationRef.current = pagination
        pageRef.current = paramPage
    }, [pagination, paramPage])

    /**
     * Set UUIDs of current location or area
     */
    const onDraw = async (callback: any) => {
        if (callback.type === 'polygon') {
            setDrawType(callback.type)
        } else if (callback.type === 'marker') {
            setDrawType(callback.type)
        }

        if (paginationRef.current.isLoaded) {
            setCurrPage(1)
            if (!!pageRef.current) {
                remove('page')
                setPagination({ isLoaded: false })
            }
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

    useMountEffect(() => {
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

                <SidebarResults />
            </ContainerMapSearch>

            <div id="select-werkingsgebied-portal" />
        </>
    )
}

export default MapSearch
