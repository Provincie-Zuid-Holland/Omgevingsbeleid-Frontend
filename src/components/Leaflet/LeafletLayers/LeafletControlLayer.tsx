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
                            className={`leaflet-layers absolute top-0 right-0 p-2 w-8 h-8 flex justify-center items-center bg-white ${
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
                            className="relative leaflet-control-layer-container">
                            <button
                                className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 p-2 mr-8 text-gray-700 transform -translate-x-8 bg-gray-100 rounded-l opacity-100 hover:text-gray-800"
                                onClick={() =>
                                    setLayerControlOpen(!layerControlOpen)
                                }>
                                <AngleRight size={16} />
                            </button>
                            <div
                                className="relative z-10 bg-white cursor-pointer overflow-y-auto"
                                style={{
                                    width: '375px',
                                    maxWidth: '100%',
                                    height: '500px',
                                }}
                                data-testid="leaflet-layers-control-pane">
                                <div className="w-full">
                                    {children}
                                    <ToggleableSection
                                        title="Achtergrondlaag"
                                        positionTop>
                                        <ul className="p-2">
                                            <li className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50">
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
                                            <li className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50">
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
