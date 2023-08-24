import { MagnifyingGlass } from '@pzh-ui/icons'
import { ControlPosition, Marker } from 'leaflet'
import { useState } from 'react'
import { useMap } from 'react-leaflet'

import { LeafletSearchInput } from '..'
import LeafletController from '../LeafletController'

interface LeafletSearchProps {
    position?: ControlPosition
}

const LeafletSearch = ({ position = 'topleft' }: LeafletSearchProps) => {
    const map = useMap()

    const [showLeafletSearch, setShowLeafletSearch] = useState(false)
    const [activeSearchMarker, setActiveSearchMarker] = useState<Marker | null>(
        null
    )

    const searchCallback = (marker: Marker) => {
        if (activeSearchMarker) {
            map.removeLayer(activeSearchMarker)
        }

        setActiveSearchMarker(marker)
    }

    /**
     * Function that sets the leafletSearch parameter to a toggled stat of leafletSearch.
     */
    const toggleLeafletSearch = () => {
        setShowLeafletSearch(!showLeafletSearch)
    }

    return (
        <LeafletController position={position}>
            <div className="leaflet-search relative z-10 flex items-center justify-between h-8 bg-white cursor-pointer">
                <div
                    className={`w-8 h-8 flex justify-center items-center ${
                        showLeafletSearch ? 'border-r border-gray-300' : null
                    }`}
                    onClick={toggleLeafletSearch}>
                    <MagnifyingGlass
                        size={16}
                        className="inline-block cursor-pointer"
                        onClick={toggleLeafletSearch}
                    />
                </div>
                {showLeafletSearch && (
                    <LeafletSearchInput
                        mapInstance={map}
                        searchCallback={marker => searchCallback(marker)}
                    />
                )}
            </div>
        </LeafletController>
    )
}

export default LeafletSearch
