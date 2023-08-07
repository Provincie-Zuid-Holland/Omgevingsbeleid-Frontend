import { Transition } from '@headlessui/react'
import { AngleRight, LayerGroup } from '@pzh-ui/icons'
import { ReactNode, useState } from 'react'
import { TileLayer, LayersControl, useMap } from 'react-leaflet'
import { useUpdateEffect } from 'react-use'

import ToggleableSection from '@/components/ToggleableSection'
import { tileURL, tileURLSattelite } from '@/constants/leaflet'

import LeafletController from '../LeafletController'

interface LeafletLayerProps {
    children?: ReactNode
}

const LeafletControlLayer = ({ children }: LeafletLayerProps) => {
    const map = useMap()

    const [layerControlOpen, setLayerControlOpen] = useState(false)
    const [activeMapTiles, setActiveMapTiles] = useState('Map')

    useUpdateEffect(() => {
        if (layerControlOpen) {
            map.scrollWheelZoom.disable()
        } else {
            map.scrollWheelZoom.enable()
        }
    }, [layerControlOpen])

    return (
        <>
            <LeafletController position="topright">
                <div className="leaflet-layers-control">
                    <div className="flex">
                        <button
                            className={`leaflet-layers absolute right-0 top-0 flex h-8 w-8 items-center justify-center bg-white p-2 ${
                                layerControlOpen ? 'hidden' : ''
                            }`}
                            onClick={() =>
                                setLayerControlOpen(!layerControlOpen)
                            }
                            data-testid="leaflet-layers-control-toggle">
                            <span className="sr-only">Kaartlagen</span>
                            {layerControlOpen ? (
                                <AngleRight
                                    size={16}
                                    className="text-gray-700"
                                />
                            ) : (
                                <LayerGroup
                                    size={16}
                                    className="text-gray-700"
                                />
                            )}
                        </button>
                        <Transition
                            show={layerControlOpen}
                            enter="ease-out duration-300"
                            enterFrom="transform translate-x-64 opacity-0"
                            enterTo="transform translate-x-0 opacity-100"
                            leave="ease-in duration-300"
                            leaveFrom="transform translate-x-0 opacity-100"
                            leaveTo="transform translate-x-64 opacity-0"
                            className="leaflet-control-layer-container relative">
                            <button
                                className="absolute left-0 top-0 mr-8 flex h-8 w-8 -translate-x-8 transform items-center justify-center rounded-l bg-gray-100 p-2 text-gray-700 opacity-100 hover:text-gray-800"
                                onClick={() =>
                                    setLayerControlOpen(!layerControlOpen)
                                }>
                                <AngleRight size={16} />
                            </button>
                            <div
                                className="relative z-10 h-[500px] w-[375px] max-w-full cursor-pointer overflow-y-auto bg-white"
                                data-testid="leaflet-layers-control-pane">
                                <div className="w-full">
                                    {children}
                                    <ToggleableSection
                                        title="Achtergrondlaag"
                                        positionTop>
                                        <ul className="p-2">
                                            <li className="cursor-pointer px-2 py-1 text-gray-700 hover:bg-gray-50 hover:text-gray-800 focus:text-gray-900">
                                                <div>
                                                    <input
                                                        className="mr-2"
                                                        type="radio"
                                                        id="Satelliet"
                                                        name="drone"
                                                        value="Satelliet"
                                                        onChange={() =>
                                                            setActiveMapTiles(
                                                                'Satelliet'
                                                            )
                                                        }
                                                        checked={
                                                            activeMapTiles ===
                                                            'Satelliet'
                                                        }
                                                    />
                                                    <label htmlFor="Satelliet">
                                                        Satelliet
                                                    </label>
                                                </div>
                                            </li>
                                            <li className="cursor-pointer px-2 py-1 text-gray-700 hover:bg-gray-50 hover:text-gray-800 focus:text-gray-900">
                                                <div>
                                                    <input
                                                        className="mr-2"
                                                        type="radio"
                                                        id="Map"
                                                        name="drone"
                                                        value="Map"
                                                        onChange={() =>
                                                            setActiveMapTiles(
                                                                'Map'
                                                            )
                                                        }
                                                        checked={
                                                            activeMapTiles ===
                                                            'Map'
                                                        }
                                                    />
                                                    <label htmlFor="Map">
                                                        Map
                                                    </label>
                                                </div>
                                            </li>
                                        </ul>
                                    </ToggleableSection>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </LeafletController>
            <LayersControl position="topright">
                <LayersControl.BaseLayer
                    checked={activeMapTiles === 'Map'}
                    name="Map">
                    <TileLayer
                        url={tileURL}
                        minZoom={3}
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer
                    checked={activeMapTiles === 'Satelliet'}
                    name="Satelliet">
                    <TileLayer
                        url={tileURLSattelite}
                        minZoom={3}
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
        </>
    )
}

export default LeafletControlLayer
