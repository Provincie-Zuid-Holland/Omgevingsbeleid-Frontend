import { TileLayer } from 'leaflet'
import { useState } from 'react'
import { useMap } from 'react-leaflet'

import { Eye, EyeSlash } from '@pzh-ui/icons'

import { Feature } from '@/api/axiosGeoJSON'

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

interface LeafletAreaLayer extends Feature {
    index: number
    layer: TileLayer.WMS
}

const LeafletAreaLayer = ({ index, layer, properties }: LeafletAreaLayer) => {
    const map = useMap()

    const [isActive, setIsActive] = useState(map.hasLayer(layer))

    return (
        <li
            className={`flex justify-between px-2 py-1 text-pzh-gray-700 hover:text-pzh-gray-800 focus:text-pzh-gray-800 hover:bg-pzh-gray-500${
                index ? ' pl-8' : ''
            }`}
            onClick={() => {
                setIsActive(!map.hasLayer(layer))
                map.hasLayer(layer) ? layer.remove() : layer.addTo(map)
            }}>
            <div
                className={`flex transition-opacity duration-100 ease-in ${
                    isActive ? 'opacity-100' : 'opacity-50'
                }`}>
                <div
                    className="mr-2 inline-block h-4 w-4 flex-none"
                    // style={{
                    //     backgroundColor: color
                    //         ? color
                    //         : index
                    //         ? colors[parseInt(index)]
                    //         : '#3388ff',
                    // }}
                />

                <span>{properties.Onderverdeling}</span>
            </div>
            <div className="ml-2 flex w-5 align-middle">
                {isActive ? <Eye size={18} /> : <EyeSlash size={18} />}
            </div>
        </li>
    )
}

export default LeafletAreaLayer
