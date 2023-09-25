import axios from 'axios'
import Leaflet, { Map, latLng } from 'leaflet'
import ReactDOMServer from 'react-dom/server'

import { getGeoJsonData } from '@/api/axiosGeoJSON'
import { CreateCustomPopup } from '@/components/Leaflet/utils/createCustomPopup'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'
import { toastNotification } from '@/utils/toastNotification'

import { MAP_OPTIONS } from '../MapSearch'

type SelectedOption = { label: string; value: string }

const handleWerkingsgebiedSelect = async (
    mapInstance: Map | null,
    navigate: any,
    werkingsgebied: Leaflet.Proj.GeoJSON | null,
    setWerkingsgebied: (item: Leaflet.Proj.GeoJSON | null) => void,
    setAreaLoading: (loading: boolean) => void,
    selected?: SelectedOption | null,
    signal?: AbortSignal
) => {
    const location = document.location.toString()
    const searchParams = new URL(location).searchParams
    const searchOpen = searchParams.get('searchOpen')

    if (!selected || !mapInstance) return

    if (werkingsgebied && mapInstance.hasLayer(werkingsgebied)) {
        mapInstance.removeLayer(werkingsgebied)
    }

    let werkingsgebiedLayer: any
    let werkingsgebiedPopup: any

    return await getGeoJsonData('Werkingsgebieden', selected.value, {
        signal,
    })
        .then(res => {
            const geoJsonLayer = Leaflet.Proj.geoJson(res, {
                onEachFeature: (feature, layer: any) => {
                    if (feature.properties) {
                        const popup = layer.bindPopup(
                            'Gebied aan het laden...',
                            {
                                minWidth: 320,
                            }
                        )

                        const customPopupHTML = `<div>${ReactDOMServer.renderToString(
                            <CreateCustomPopup
                                type="polygon"
                                areaName={feature.properties.Gebied}
                            />
                        )}</div>`
                        layer._popup.setContent(customPopupHTML)

                        werkingsgebiedLayer = layer
                        werkingsgebiedPopup = popup
                    }
                },
            })

            setWerkingsgebied(geoJsonLayer)
            setAreaLoading(false)

            geoJsonLayer.addTo(mapInstance)
            mapInstance.fitBounds(geoJsonLayer.getBounds())

            if (searchOpen !== 'true') {
                werkingsgebiedPopup?.openPopup()

                handlePopupEvents(
                    mapInstance,
                    werkingsgebiedLayer,
                    geoJsonLayer,
                    navigate,
                    searchParams,
                    MAP_SEARCH_PAGE
                )

                mapInstance.on('popupopen', () =>
                    handlePopupEvents(
                        mapInstance,
                        werkingsgebiedLayer,
                        geoJsonLayer,
                        navigate,
                        searchParams,
                        MAP_SEARCH_PAGE
                    )
                )
            }

            searchParams.set('werkingsgebied', selected.value)
            navigate(`${MAP_SEARCH_PAGE}?${searchParams}`)
        })
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log('Request canceled -', err.message)
            } else {
                console.log(err)
                toastNotification('error')
                setAreaLoading(false)
            }
        })
}

const handlePopupEvents = (
    map: Map,
    werkingsgebiedLayer: any,
    layer: any,
    navigate: any,
    searchParams: URLSearchParams,
    path: string
) => {
    const popupContainer = werkingsgebiedLayer.getPopup().getElement()

    popupContainer
        .querySelector('.leaflet-close-popup')
        ?.addEventListener('click', () => {
            map.removeLayer(layer)

            const coordinates = latLng(
                MAP_OPTIONS.center[0],
                MAP_OPTIONS.center[1]
            )
            map?.setView(coordinates, MAP_OPTIONS.zoom)

            navigate(MAP_SEARCH_PAGE)
        })

    popupContainer
        .querySelector('.advanced-search-button')
        ?.addEventListener('click', () => {
            searchParams.append('searchOpen', 'true')
            navigate(`${path}?${searchParams}`)
        })
}

export default handleWerkingsgebiedSelect
