import { Eye, EyeSlash } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useState } from 'react'
import { useMap } from 'react-leaflet'

import { Feature, generateImageUrl } from '@/api/axiosGeoJSON'
import { colors } from '@/constants/leaflet'

interface LeafletAreaLayer {
    index?: string
    layer?: any
    color?: string
    properties?: Feature['properties']
    isActive?: boolean
    onClick?: (name: string) => void
}

const LeafletAreaLayer = ({
    index,
    properties,
    layer,
    color,
    isActive: providedIsActive,
    onClick,
}: LeafletAreaLayer) => {
    const map = useMap()

    const [isActive, setIsActive] = useState(layer && map.hasLayer(layer))

    if (!properties) {
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
                            layer.feature.properties.Werkingsgebied}
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
                'flex cursor-pointer items-baseline justify-between gap-2 px-2 py-1 text-s text-pzh-gray-700',
                {
                    'pl-8': parseInt(index || '0') > 0,
                }
            )}
            onClick={() => {
                onClick?.(
                    properties?.Onderverdeling ||
                        properties?.Werkingsgebied ||
                        ''
                )
            }}>
            <div className="flex items-baseline gap-2">
                <div className="min-w-[20px]">
                    {properties?.symbol && (
                        <img
                            src={generateImageUrl(properties.symbol)}
                            alt={properties.symbol}
                            className="-mb-1"
                        />
                    )}
                </div>

                <span
                    className={classNames({
                        'line-through': !providedIsActive,
                    })}>
                    {properties?.Onderverdeling || properties?.Werkingsgebied}
                </span>
            </div>

            <div className="w-5">
                {providedIsActive ? (
                    <Eye size={18} className="-mb-1" />
                ) : (
                    <EyeSlash size={18} className="-mb-1" />
                )}
            </div>
        </li>
    )
}

export default LeafletAreaLayer
