import { Eye, EyeSlash } from '@pzh-ui/icons'
import { useState } from 'react'
import { useMap } from 'react-leaflet'

import { colors } from '@/constants/leaflet'

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

interface LeafletAreaLayerProps {
    layer: any
    index?: string
    color?: string
}

const LeafletAreaLayer = ({ layer, index, color }: LeafletAreaLayerProps) => {
    const map = useMap()

    const [isActive, setIsActive] = useState(map.hasLayer(layer))

    return (
        <li
            className={`flex justify-between px-2 py-1 text-gray-700 hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50${
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
                    className="flex-none inline-block w-4 h-4 mr-2"
                    style={{
                        backgroundColor: color
                            ? color
                            : index
                            ? colors[parseInt(index)]
                            : '#3388ff',
                    }}
                />

                <span>
                    {layer.feature.properties.Onderverdeling ||
                        layer.feature.properties.Gebied ||
                        ''}
                </span>
            </div>
            <div className="flex align-middle w-5 ml-2">
                {isActive ? <Eye size={18} /> : <EyeSlash size={18} />}
            </div>
        </li>
    )
}

export default LeafletAreaLayer
