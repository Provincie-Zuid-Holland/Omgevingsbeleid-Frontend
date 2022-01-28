import { faSearch } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ControlPosition, latLng, Marker, marker } from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'

import { LeafletSearchInput } from '..'
import LeafletController from '../LeafletController'

interface LeafletSearchProps {
    position?: ControlPosition
}

const LeafletSearch = ({ position = 'topleft' }: LeafletSearchProps) => {
    const map = useMap()
    const searchInput = useRef<HTMLInputElement>(null)

    const [showLeafletSearch, setShowLeafletSearch] = useState(false)
    const [activeSearchMarker, setActiveSearchMarker] = useState<Marker | null>(
        null
    )

    /**
     * Function to set the zoomLevel of each type parameter value based on the value. Also to set the state of activeSearchMarker to the markerID value and create a popup pased on the parameters.
     */
    const mapPanTo = (lng: number, lat: number, type: string) => {
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

        const markerID = marker(latLng(lng, lat)).addTo(map)

        if (activeSearchMarker) {
            map.removeLayer(activeSearchMarker)
        }

        setActiveSearchMarker(markerID)

        const coordinates = latLng(lng, lat)

        map.setView(coordinates, zoomLevel)
    }

    /**
     * Function that sets the leafletSearch parameter to a toggled stat of leafletSearch.
     */
    const toggleLeafletSearch = () => {
        setShowLeafletSearch(!showLeafletSearch)
    }

    useEffect(() => {
        if (searchInput.current && showLeafletSearch) {
            searchInput.current.select()
        }
    }, [showLeafletSearch])

    return (
        <LeafletController position={position}>
            <div
                id="leaflet-search"
                className="relative z-10 flex items-center justify-between h-10 bg-white rounded shadow cursor-pointer">
                <div
                    className={`w-10 h-10 flex justify-center items-center text-gray-600 hover:text-gray-700 ${
                        showLeafletSearch ? 'border-r border-gray-300' : null
                    }`}
                    onClick={toggleLeafletSearch}>
                    <FontAwesomeIcon
                        className="inline-block w-10 text-lg cursor-pointer"
                        icon={faSearch}
                        onClick={toggleLeafletSearch}
                    />
                </div>
                {showLeafletSearch && (
                    <LeafletSearchInput mapPanTo={mapPanTo} ref={searchInput} />
                )}
            </div>
        </LeafletController>
    )
}

export default LeafletSearch
