import { Transition } from '@headlessui/react'
import { ReactNode, useState } from 'react'
import { LayersControl, TileLayer, useMap } from 'react-leaflet'
import { useUpdateEffect } from 'react-use'

import { AngleRight, LayerGroup } from '@pzh-ui/icons'

import { tileURL } from '@/constants/leaflet'

import LeafletController from '../LeafletController'

interface LeafletLayerProps {
    children?: ReactNode
}

const LeafletControlLayer = ({ children }: LeafletLayerProps) => {
    const map = useMap()

    const [layerControlOpen, setLayerControlOpen] = useState(false)

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
                            className={`leaflet-layers z-11 absolute right-0 top-0 flex h-8 w-8 items-center justify-center bg-white p-2 ${
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
                                    className="text-pzh-gray-700"
                                />
                            ) : (
                                <LayerGroup
                                    size={16}
                                    className="text-pzh-gray-700"
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
                                className="hover:text-gray-800 absolute left-0 top-0 z-[11] mr-8 flex h-8 w-8 -translate-x-8 transform items-center justify-center rounded-l bg-pzh-gray-100 p-2 text-pzh-gray-700 opacity-100"
                                onClick={() =>
                                    setLayerControlOpen(!layerControlOpen)
                                }>
                                <AngleRight size={16} />
                            </button>
                            <div
                                className="relative z-10 h-[500px] w-[375px] max-w-full overflow-y-auto bg-white shadow-pane"
                                data-testid="leaflet-layers-control-pane">
                                <div className="w-full">{children}</div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </LeafletController>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Map">
                    <TileLayer
                        url={tileURL}
                        minZoom={3}
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
        </>
    )
}

export default LeafletControlLayer
