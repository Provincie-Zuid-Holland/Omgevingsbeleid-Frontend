import { Button, Text } from '@pzh-ui/components'
import { LatLng, Map, Point } from 'leaflet'
import Proj from 'proj4leaflet'
import ReactDOMServer from 'react-dom/server'

import { LoaderSpinner } from '@/components/Loader'
import { MAP_SEARCH_PAGE, RDProj4, leafletBounds } from '@/constants/leaflet'

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

/**
 * Function that creates a custom popup with the parameters lat, lng and layer.
 */
const createCustomPopup = (
    map: Map,
    navigate: any,
    lat: number,
    lng: number,
    layer: any,
    type: 'marker' | 'polygon',
    callback?: (callback: any) => void,
    locationName?: string
) => {
    const isAdvancedSearch = window.location.pathname === MAP_SEARCH_PAGE
    const path = isAdvancedSearch ? MAP_SEARCH_PAGE : '/zoekresultaten'

    const point = RDProjection.project({ lat, lng })
    const searchParams = new URLSearchParams(window.location.search)
    const sidebarOpen = searchParams.get('sidebarOpen')

    const popupLoading = `
        <div class="flex">
            ${ReactDOMServer.renderToString(<LoaderSpinner />)}
            <span class="ml-2">${
                type === 'marker' ? 'Adres' : 'Gebied'
            } aan het laden...</span>
        </div>
    `

    const popup = layer.bindPopup(popupLoading, {
        minWidth: 320,
    })

    if (sidebarOpen !== 'true') {
        popup.openPopup()
    }

    if (type === 'marker') {
        const customPopupHTML = `<div>${ReactDOMServer.renderToString(
            <CreateCustomPopup
                type="marker"
                lat={lat}
                lng={lng}
                geoQuery={`${point.x.toFixed(2)}+${point.y.toFixed(2)}`}
                locationName={locationName}
            />
        )}</div>`
        layer._popup.setContent(customPopupHTML)

        if (isAdvancedSearch) {
            searchParams.set(
                'geoQuery',
                `${point.x.toFixed(2)}+${point.y.toFixed(2)}`
            )
            navigate(`${MAP_SEARCH_PAGE}?${searchParams}`)
        }

        callback?.({
            point: { x: point.x.toFixed(2), y: point.y.toFixed(2) },
            type: 'marker',
        })
    } else if (type === 'polygon') {
        const points = layer._latlngs
            .flat(2)
            .map(({ lat, lng }: LatLng) => RDProjection.project({ lat, lng }))
        const pointsArray = [...points, points[0]]

        const geoQuery = pointsArray
            .map((part: Point) =>
                [part.x.toFixed(2), part.y.toFixed(2)].join('+')
            )
            .join(',')

        const customPopupHTML = `<div>${ReactDOMServer.renderToString(
            <CreateCustomPopup
                type="polygon"
                lat={lat}
                lng={lng}
                geoQuery={geoQuery}
            />
        )}</div>`
        layer._popup.setContent(customPopupHTML)

        if (isAdvancedSearch) {
            searchParams.set('geoQuery', geoQuery)
            navigate(`${MAP_SEARCH_PAGE}?${searchParams}`)
        }

        callback?.({
            type: 'polygon',
        })
    }

    if (sidebarOpen !== 'true') {
        handlePopupEvents(
            map,
            layer,
            navigate,
            searchParams,
            isAdvancedSearch ? path : undefined
        )
    }

    map.on('popupopen', () =>
        handlePopupEvents(
            map,
            layer,
            navigate,
            searchParams,
            isAdvancedSearch ? path : undefined
        )
    )
}

const handlePopupEvents = (
    map: Map,
    layer: any,
    navigate: any,
    searchParams: URLSearchParams,
    path?: string
) => {
    const popupContainer = layer.getPopup().getElement()

    popupContainer
        ?.querySelector('.leaflet-close-popup')
        ?.addEventListener('click', () => {
            map.fireEvent('draw:deletestart')
            map.removeLayer(layer)
            path && navigate(path)
        })

    popupContainer
        ?.querySelector('.advanced-search-button')
        ?.addEventListener('click', () => {
            searchParams.append('sidebarOpen', 'true')
            navigate(`${path}?${searchParams}`)
        })
}

interface CreateCustomPopupProps {
    type: 'marker' | 'polygon'
    locationName?: string
    areaName?: string
    lat?: number
    lng?: number
    geoQuery?: string
}

export const CreateCustomPopup = ({
    type,
    locationName,
    areaName,
    lat,
    lng,
    geoQuery = '',
}: CreateCustomPopupProps) => {
    const isAdvancedSearch = window.location.pathname === MAP_SEARCH_PAGE

    const searchParams = new URLSearchParams({
        geoQuery,
    })

    return (
        <div className="custom-popup">
            <Text as="span" className="block font-bold">
                Locatie
            </Text>
            <ul className="mb-4 mt-2">
                {locationName && (
                    <Text size="s" as="li" bold>
                        {locationName}
                    </Text>
                )}
                {type === 'marker' && lat && lng && (
                    <Text size="s" as="li">
                        GPS Locatie:
                        <br />
                        {lat.toFixed(7)}, {lng.toFixed(7)}
                    </Text>
                )}
                {type === 'polygon' && (
                    <Text as="li">{areaName || 'Getekend gebied.'}</Text>
                )}
            </ul>
            <div className="flex justify-between text-m">
                {isAdvancedSearch ? (
                    <Button className="advanced-search-button">
                        Bekijk beleid
                    </Button>
                ) : (
                    <Button asChild className="flex items-center">
                        <a
                            href={`${MAP_SEARCH_PAGE}?${searchParams}&sidebarOpen=true`}>
                            Bekijk beleid
                        </a>
                    </Button>
                )}
                <button className="leaflet-close-popup text-s text-pzh-red-500 underline">
                    {type === 'marker' ? 'Pin' : 'Gebied'} verwijderen
                </button>
            </div>
        </div>
    )
}

export default createCustomPopup
