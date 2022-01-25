import {
    faLayerGroup,
    faAngleRight,
    faChevronUp,
    faChevronDown,
    faEye,
    faEyeSlash,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import axios from 'axios'
import Leaflet, { LatLngExpression, Layer } from 'leaflet'
import { FC, useEffect, useRef, useState } from 'react'
import { Map, TileLayer, LayersControl, Viewport } from 'react-leaflet'
import { toast } from 'react-toastify'

import { getGeoJsonData, getOnderverdeling } from '@/api/axiosGeoJSON'
import { LoaderLeafletTinyViewer } from '@/components/Loader'
import {
    colors,
    RDCrs,
    tileURL,
    tileURLSattelite,
    leafletCenter,
} from '@/constants/leaflet'
import useStateCallback from '@/hooks/useStateCallback'

import LeafletController from '../LeafletController'

const DEFAULT_VIEWPORT = {
    center: [52.086531, 4.316168],
    zoom: 5,
}

/**
 * Function that sets the state for a certain amount of variables and create a reference for the leafletMap variable and binds the initializeComponent.
 */

interface LeafletTinyViewerProps {
    fullscreen?: boolean
    gebiedUUID: string
    gebiedType: string
}

const LeafletTinyViewer = ({
    fullscreen,
    gebiedUUID,
    gebiedType,
}: LeafletTinyViewerProps) => {
    const [dataReceived, setDataReceived] = useStateCallback(false)
    const [layerControlOpen, setLayerControlOpen] = useState(false)
    const [activeMapTiles, setActiveMapTiles] = useState('Map')
    const [viewport, setViewPort] = useState<Viewport>(
        DEFAULT_VIEWPORT as Viewport
    )
    const [onderverdelingen, setOnderverdelingen] = useState<any[]>([])
    const [werkingsgebied, setWerkingsgebied] = useState<any[]>([])

    const leafletMap = useRef<Map>(null)

    /**
     * Function that changes the viewport by setting the state based on the viewport value.
     */
    const onViewportChanged = (viewport: Viewport) => {
        setViewPort(viewport)
    }

    /**
     * Function that removes a layer from the currentLeafletMap.leafletElement if currentLeafletmap and this.state.boundsObject contain a value.
     * It then imports the API axiosGeoJSON and then uses the GeoJsonData.
     *
     *
     */
    const initializeComponent = () => {
        Promise.all([
            getGeoJsonData(gebiedType, gebiedUUID),
            getOnderverdeling(gebiedType, gebiedUUID),
        ])
            .then(responses => {
                const geoJsonData = responses[0]
                const onderverdelingData = responses[1]

                setDataReceived(true, () => {
                    let colorsIndex = -1

                    const geoJsonLayer = Leaflet.Proj.geoJson(geoJsonData, {
                        onEachFeature: (feature, layer) => {
                            if (feature.properties) {
                                layer.bindPopup(
                                    feature.properties.Gebied
                                        ? feature.properties.Gebied
                                        : 'Deze laag heeft nog geen titel'
                                )
                            }
                        },
                        style: () => {
                            return {
                                stroke: true,
                                color: '#3388ff', // custom blue color for the first werkingsgebied,
                                fillColor: '#3388ff', // custom blue color for the first werkingsgebied,
                                fillOpacity: 0.2,
                            }
                        },
                    })

                    const onderverdelingJsonLayer = Leaflet.Proj.geoJson(
                        onderverdelingData,
                        {
                            onEachFeature: (feature, layer) => {
                                if (feature.properties) {
                                    layer.bindPopup(
                                        feature.properties.Onderverdeling
                                            ? feature.properties.Onderverdeling
                                            : 'Deze laag heeft nog geen titel'
                                    )
                                }
                            },
                            style: () => {
                                colorsIndex++
                                return {
                                    stroke: true,
                                    color: colors[colorsIndex],
                                    fillColor: colors[colorsIndex],
                                    fillOpacity: 0.2,
                                }
                            },
                        }
                    )

                    geoJsonLayer.addTo(leafletMap.current!.leafletElement)

                    const geoJsonLayerArray: Layer[] = []
                    const onderverdelingLayerArray: Layer[] = []

                    geoJsonLayer.eachLayer(function (layer) {
                        geoJsonLayerArray.push(layer)
                    })

                    onderverdelingJsonLayer.eachLayer(function (layer) {
                        onderverdelingLayerArray.push(layer)
                    })

                    setWerkingsgebied(geoJsonLayerArray)
                    setOnderverdelingen(onderverdelingLayerArray)
                })
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled -', err.message)
                } else {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }

    /**
     * Function that calls the initializeComponent function within this javascript file.
     */

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => initializeComponent(), [gebiedType, gebiedUUID])

    useEffect(() => {
        if (leafletMap.current) {
            leafletMap.current.leafletElement.invalidateSize()
        }
    }, [fullscreen])

    console.log(dataReceived)

    if (!dataReceived) return <LoaderLeafletTinyViewer />

    return (
        <Map
            center={leafletCenter as LatLngExpression}
            onViewportChanged={onViewportChanged}
            viewport={viewport}
            scrollWheelZoom={!layerControlOpen}
            zoomControl
            boundsOptions={{ padding: [100, 100] }}
            crs={RDCrs}
            ref={leafletMap}
            className="z-0"
            id="leaflet-tiny-viewer">
            <LeafletController position="topright">
                <div id="leaflet-layers-control">
                    <div className="flex">
                        <div
                            className={`absolute top-0 right-0 p-2 w-8 h-8 flex justify-center items-center shadow-xl bg-white rounded ${
                                layerControlOpen ? 'hidden' : ''
                            }`}
                            style={
                                layerControlOpen
                                    ? undefined
                                    : {
                                          marginTop: '10px',
                                          marginRight: '10px',
                                          boxShadow:
                                              '0 1px 5px rgba(0,0,0,0.65)',
                                      }
                            }
                            onClick={() =>
                                setLayerControlOpen(!layerControlOpen)
                            }>
                            <FontAwesomeIcon
                                className="text-lg text-gray-700"
                                icon={
                                    layerControlOpen
                                        ? faAngleRight
                                        : faLayerGroup
                                }
                            />
                        </div>
                        <Transition
                            show={layerControlOpen}
                            enter="ease-out duration-300"
                            enterFrom="transform translate-x-64 opacity-0"
                            enterTo="transform translate-x-0 opacity-100"
                            leave="ease-in duration-300"
                            leaveFrom="transform translate-x-0 opacity-100"
                            leaveTo="transform translate-x-64 opacity-0">
                            <div>
                                <button
                                    className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 p-2 mr-8 text-gray-700 transform -translate-x-8 bg-orange-100 rounded-l opacity-100 hover:text-gray-800"
                                    onClick={() =>
                                        setLayerControlOpen(!layerControlOpen)
                                    }>
                                    <FontAwesomeIcon
                                        className="text-lg"
                                        icon={faAngleRight}
                                    />
                                </button>
                                <div
                                    className={`relative z-10 bg-white rounded cursor-pointer overflow-y-auto`}
                                    style={{
                                        width: '375px',
                                        maxWidth: '100%',
                                        height: fullscreen ? '1000px' : '500px',
                                    }}>
                                    <div className="w-full">
                                        <ToggleableSection title="Legenda">
                                            <ul className="p-2">
                                                {werkingsgebied?.map(layer => (
                                                    <li
                                                        key={layer?.feature?.id}
                                                        className="flex justify-between px-2 py-1 text-gray-700 hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                        onClick={() => {
                                                            leafletMap.current!.leafletElement.hasLayer(
                                                                layer
                                                            )
                                                                ? layer.remove()
                                                                : layer.addTo(
                                                                      leafletMap.current!
                                                                          .leafletElement
                                                                  )
                                                        }}>
                                                        <div
                                                            className={`flex transition-opacity duration-100 ease-in ${
                                                                leafletMap.current!.leafletElement.hasLayer(
                                                                    layer
                                                                )
                                                                    ? 'opacity-100'
                                                                    : 'opacity-50'
                                                            }`}>
                                                            <div
                                                                className="flex-none inline-block w-4 h-4 mr-2"
                                                                style={{
                                                                    backgroundColor:
                                                                        '#3388ff',
                                                                }}
                                                            />

                                                            <span>
                                                                {layer.feature
                                                                    .properties
                                                                    .Onderverdeling
                                                                    ? layer
                                                                          .feature
                                                                          .properties
                                                                          .Onderverdeling
                                                                    : layer
                                                                          .feature
                                                                          .properties
                                                                          .Gebied
                                                                    ? layer
                                                                          .feature
                                                                          .properties
                                                                          .Gebied
                                                                    : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex-none w-5 ml-2">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    leafletMap.current!.leafletElement.hasLayer(
                                                                        layer
                                                                    )
                                                                        ? faEye
                                                                        : faEyeSlash
                                                                }
                                                            />
                                                        </div>
                                                    </li>
                                                ))}
                                                {onderverdelingen?.map(
                                                    (layer, index) => (
                                                        <li
                                                            key={
                                                                layer?.feature
                                                                    ?.id
                                                            }
                                                            className="flex justify-between px-2 py-1 pl-8 text-gray-700 hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                            onClick={() => {
                                                                leafletMap.current!.leafletElement.hasLayer(
                                                                    layer
                                                                )
                                                                    ? layer.remove()
                                                                    : layer.addTo(
                                                                          leafletMap.current!
                                                                              .leafletElement
                                                                      )
                                                            }}>
                                                            <div
                                                                className={`flex transition-opacity duration-100 ease-in ${
                                                                    leafletMap.current!.leafletElement.hasLayer(
                                                                        layer
                                                                    )
                                                                        ? 'opacity-100'
                                                                        : 'opacity-50'
                                                                }`}>
                                                                <div
                                                                    className="flex-none inline-block w-4 h-4 mr-2"
                                                                    style={{
                                                                        backgroundColor:
                                                                            colors[
                                                                                index
                                                                            ],
                                                                    }}
                                                                />

                                                                <span>
                                                                    {layer
                                                                        .feature
                                                                        .properties
                                                                        .Onderverdeling
                                                                        ? layer
                                                                              .feature
                                                                              .properties
                                                                              .Onderverdeling
                                                                        : layer
                                                                              .feature
                                                                              .properties
                                                                              .Gebied
                                                                        ? layer
                                                                              .feature
                                                                              .properties
                                                                              .Gebied
                                                                        : ''}
                                                                </span>
                                                            </div>
                                                            <div className="flex-none w-5 ml-2">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        leafletMap.current!.leafletElement.hasLayer(
                                                                            layer
                                                                        )
                                                                            ? faEye
                                                                            : faEyeSlash
                                                                    }
                                                                />
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </ToggleableSection>
                                        <ToggleableSection title="Achtergrondlaag">
                                            <ul className="p-2">
                                                <li
                                                    className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                    onClick={() =>
                                                        setActiveMapTiles(
                                                            'Satelliet'
                                                        )
                                                    }>
                                                    <div>
                                                        <input
                                                            className="mr-2"
                                                            type="radio"
                                                            id="Satelliet"
                                                            name="drone"
                                                            value="Satelliet"
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
                                                <li
                                                    className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                    onClick={() =>
                                                        setActiveMapTiles('Map')
                                                    }>
                                                    <div>
                                                        <input
                                                            className="mr-2"
                                                            type="radio"
                                                            id="Map"
                                                            name="drone"
                                                            value="Map"
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
                        continuousWorld="true"
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer
                    checked={activeMapTiles === 'Satelliet'}
                    name="Satelliet">
                    <TileLayer
                        url={tileURLSattelite}
                        minZoom={3}
                        continuousWorld="true"
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
        </Map>
    )
}

/**
 * Function to toggle (open/close) the div inside this function. It uses to display the title and children value.
 */

interface ToggleableSectionProps {
    title: string
}

const ToggleableSection: FC<ToggleableSectionProps> = ({ children, title }) => {
    const [open, setOpen] = useState(true)

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-5 text-left bg-orange-100">
                <span className="font-bold">{title}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </button>
            {open ? <div className="pb-10">{children}</div> : null}
        </div>
    )
}

export default LeafletTinyViewer
