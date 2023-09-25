import classNames from 'classnames'
import { useState } from 'react'
import { useMap } from 'react-leaflet'

import { Eye, EyeSlash } from '@pzh-ui/icons'

import { Feature, generateImageUrl } from '@/api/axiosGeoJSON'
import { colors } from '@/constants/leaflet'

interface LeafletAreaLayer {
    index?: string
    interactive?: boolean
    layer?: any
    color?: string
    properties?: Feature['properties']
}

const LeafletAreaLayer = ({
    index,
    properties,
    interactive,
    layer,
    color,
}: LeafletAreaLayer) => {
    const map = useMap()

    const [isActive, setIsActive] = useState(layer && map.hasLayer(layer))

    if (interactive) {
        return (
            <li
                className={classNames(
                    'flex justify-between px-2 py-1 text-pzh-gray-700 hover:bg-pzh-gray-100 hover:text-pzh-gray-800 focus:text-pzh-gray-800',
                    {
                        'pl-6': index,
                    }
                )}
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
                            layer.feature.properties.Gebied}
                    </span>
                </div>
                <div className="ml-2 flex w-5 align-middle">
                    {isActive ? <Eye size={18} /> : <EyeSlash size={18} />}
                </div>
            </li>
        )
    }

    return (
        <li
            className={classNames(
                'flex items-baseline gap-x-2 px-2 py-1 text-s text-pzh-gray-700',
                {
                    'pl-8': parseInt(index || '0') > 0,
                }
            )}>
            <div className="min-w-[20px]">
                {properties?.symbol && (
                    <img
                        src={generateImageUrl(properties.symbol)}
                        alt={properties.symbol}
                        className="-mb-1"
                    />
                )}
            </div>

            <span>{properties?.Onderverdeling || properties?.Gebied}</span>
        </li>
    )
}

export default LeafletAreaLayer
