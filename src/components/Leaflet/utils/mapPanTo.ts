import { latLng, Map, marker, polygon } from 'leaflet'

import { createCustomPopup } from '.'

export interface PanToProps {
    map: Map
    navigate: any
    latLngs?: {
        lat: number
        lng: number
    }[]
    lng?: number
    lat?: number
    type: string
    layerType: 'marker' | 'polygon'
    callback?: (callback: any) => void
    locationName?: string
}

/**
 * Function to set the zoomLevel of each type parameter value based on the value. Also to set the state of activeSearchMarker to the markerID value and create a popup pased on the parameters.
 */
const mapPanTo = ({
    map,
    navigate,
    lng,
    lat,
    latLngs,
    type,
    layerType = 'marker',
    callback,
    locationName,
}: PanToProps) => {
    let zoomLevel

    switch (type) {
        case 'adres':
            zoomLevel = 10
            break
        case 'postcode':
            zoomLevel = 12
            break
        case 'weg':
            zoomLevel = 14
            break
        case 'woonplaats':
            zoomLevel = 7
            break
        case 'gemeente':
            zoomLevel = 8
            break
        case 'provincie':
            zoomLevel = 5
            break
        default:
            zoomLevel = 5
    }

    let layerID: any
    let coordinates

    if (layerType === 'marker' && lng && lat) {
        layerID = marker(latLng(lat, lng)).addTo(map)
        coordinates = { lat, lng }
    } else if (layerType === 'polygon' && latLngs) {
        layerID = polygon(latLngs).addTo(map)
        coordinates = layerID?._map.getBounds().getCenter()
    }

    // Create popup
    createCustomPopup(
        map,
        navigate,
        coordinates.lat,
        coordinates.lng,
        layerID,
        layerType,
        callback,
        locationName
    )

    map.setView(coordinates, zoomLevel)

    return layerID
}

export default mapPanTo
