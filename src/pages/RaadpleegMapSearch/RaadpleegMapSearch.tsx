import { Map, point } from 'leaflet'
import Proj from 'proj4leaflet'
import { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { getWerkingsGebieden } from '@/api/axiosGeoJSON'
import { GetSearch200Item } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import { Container, ContainerMapSearch } from '@/components/Container'
import Footer from '@/components/Footer'
import Heading from '@/components/Heading'
import { LeafletMap } from '@/components/Leaflet'
import { mapPanTo } from '@/components/Leaflet/utils'
import SearchBar from '@/components/SearchBar'
import Text from '@/components/Text'
import { RDProj4, leafletBounds } from '@/constants/leaflet'

import SidebarInformation from './SidebarInformation'
import SidebarResults from './SidebarResults'

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

export const MAP_OPTIONS = {
    center: [51.985989, 4.6] as [number, number],
    zoom: 5,
}

const RaadpleegMapSearch = () => {
    const history = useHistory()
    const location = document.location.toString()
    const searchParams = new URL(location).searchParams
    const paramGeoQuery = searchParams.get('geoQuery')
    const paramSearchOpen = searchParams.get('searchOpen')

    const [initialized, setInitialized] = useState(false)
    const [mapInstance, setMapInstance] = useState<Map | null>(null)
    const [layer, setLayer] = useState<any>(null)
    const [UUIDs, setUUIDs] = useState<string[]>([])
    const [searchResults, setSearchResults] = useState<GetSearch200Item[]>([])
    const [searchResultsLoading, setSearchResultsLoading] = useState(true)
    const [searchOpen, setSearchOpen] = useState(paramSearchOpen === 'true')

    /**
     * Set UUIDs of current location or area
     */
    const onDraw = async (callback: any) => {
        if (
            callback.type === 'FeatureCollection' &&
            callback.features?.length
        ) {
            const werkingsgebiedenUUIDS = callback.features.map(
                (item: any) => item.properties.UUID
            )

            setUUIDs(werkingsgebiedenUUIDS)
        } else if (callback.type === 'adres') {
            const werkingsgebieden = await getWerkingsGebieden(
                callback.point.x,
                callback.point.y
            )

            const werkingsgebiedenUUIDS = werkingsgebieden.map(
                (item: any) => item.properties.UUID
            )

            setUUIDs(werkingsgebiedenUUIDS)
        }
    }

    /**
     * Get search results from API based on provided UUIDs
     */
    const getSearchResults = async (UUIDs: string[]) => {
        setSearchResultsLoading(true)

        const searchResults: GetSearch200Item[] = await axios
            .get(`/search/geo?query=${UUIDs.join(',')}`)
            .then(res => {
                setSearchResultsLoading(false)
                return res.data
            })

        setSearchResults(searchResults)
    }

    /**
     * If URL contains searchOpen=true open the results sidebar.
     */
    useEffect(() => {
        if (paramSearchOpen === 'true') {
            setSearchOpen(true)
            mapInstance?.closePopup()
        } else {
            setSearchOpen(false)
        }

        if (paramSearchOpen === 'true' && UUIDs.length) {
            getSearchResults(UUIDs)
        }
    }, [paramSearchOpen, UUIDs, mapInstance])

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

                const layer = mapPanTo({
                    map: mapInstance,
                    history,
                    latLngs,
                    type: '',
                    layerType: 'polygon',
                    callback: onDraw,
                })

                setLayer(layer)
                setInitialized(true)
            } else {
                const [x, y] = geoQuery[0].split('+')

                const { lat, lng } = RDProjection.unproject(
                    point(parseFloat(x), parseFloat(y))
                )

                if (!mapInstance.hasLayer(layer)) {
                    const layer = mapPanTo({
                        map: mapInstance,
                        history,
                        lng: parseFloat(parseFloat(lng).toFixed(20)),
                        lat: parseFloat(parseFloat(lat).toFixed(20)),
                        type: '',
                        layerType: 'marker',
                        callback: onDraw,
                    })

                    setLayer(layer)
                    setInitialized(true)
                }
            }

            mapInstance.invalidateSize()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramGeoQuery, mapInstance])

    useEffectOnce(() => {
        const geoQuery = paramGeoQuery?.split(',')

        if (!geoQuery) return setInitialized(true)
    })

    /**
     * Memoize LeafletMap component so it won't rerender on changes
     */
    const map = useMemo(
        () => (
            <LeafletMap
                controllers={{
                    showLayers: false,
                    showDraw: true,
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
        []
    )

    return (
        <>
            <ContainerMapSearch className="border-b border-t overflow-hidden">
                <SidebarInformation
                    mapInstance={mapInstance}
                    searchOpen={searchOpen}
                    onDraw={onDraw}
                />

                <div className="w-full">{map}</div>

                <SidebarResults
                    searchOpen={searchOpen}
                    searchResults={searchResults}
                    isLoading={searchResultsLoading}
                />
            </ContainerMapSearch>

            <Container>
                <div className="col-span-6 lg:col-span-4 lg:col-start-2 py-10">
                    <Heading level="3">Liever zoeken op tekst?</Heading>
                    <div>
                        <Text type="body" className="mt-4">
                            Waar bent u naar op zoek binnen het beleid van de
                            provincie Zuid-Holland?
                        </Text>
                        <SearchBar className="mt-2" />
                    </div>
                </div>
            </Container>

            <Footer />
        </>
    )
}

export default RaadpleegMapSearch
