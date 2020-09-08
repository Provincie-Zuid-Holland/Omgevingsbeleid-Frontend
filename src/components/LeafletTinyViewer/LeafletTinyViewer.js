import React, { Component } from 'react'
import axios from 'axios'
import Leaflet from 'leaflet'
import { Map, TileLayer, LayersControl } from 'react-leaflet'
import { toast } from 'react-toastify'
import Proj from 'proj4leaflet'
import LoaderLeafletTinyViewer from './../LoaderLeafletTinyViewer'
import LeafletController from './../LeafletController'
import Transition from './../Transition'

import {
    faLayerGroup,
    faAngleRight,
    faChevronUp,
    faChevronDown,
    faEye,
    faEyeSlash,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const colors = [
    '#3388ff', // custom blue color for the first werkingsgebied
    '#ED8936', //orange-500
    '#D53F8C', //pink-600
    '#ECC94B', //yellow-500
    '#48BB78', //green-500
    '#3182CE', //blue-600
    '#38B2AC', //teal-500
    '#E53E3E', //red-600
    '#805AD5', //purple-600
    '#718096', //gray-600
]

const RDProj4 = `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs`
const RDCrs = new Proj.CRS('EPSG:28992', RDProj4, {
    origin: [-285401.92, 22598.08],
    resolutions: [
        3440.64,
        1720.32,
        860.16,
        430.08,
        215.04,
        107.52,
        53.76,
        26.88,
        13.44,
        6.72,
        3.36,
        1.68,
        0.84,
        0.42,
        0.21,
    ],
    zoom: 10,
    bounds: Leaflet.bounds([
        [-285401.92, 22598.08],
        [595401.92, 903401.92],
    ]),
})

const DEFAULT_VIEWPORT = {
    center: [52.086531, 4.316168],
    zoom: 5,
}

export default class LeafletTinyViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _RDCrs: RDCrs,
            viewport: DEFAULT_VIEWPORT,
            dataReceived: false,
            jsonLayer: [],
            layerControlOpen: false,
            activeMapTiles: 'Map',
        }
        this.leafletMap = React.createRef()
        this.initializeComponent = this.initializeComponent.bind(this)
    }

    onClickReset = () => {
        // this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    onViewportChanged = (viewport) => {
        this.setState({ viewport: viewport, bounds: null })
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.fullscreen !== prevProps.fullscreen &&
            this.leafletMap.current
        ) {
            this.leafletMap.current.leafletElement.invalidateSize()
            this.forceUpdate()
            if (!this.state.boundsObject) return
            this.setState({
                bounds: this.state.boundsObject.getBounds(),
            })
        } else if (this.props.gebiedUUID !== prevProps.gebiedUUID) {
            this.initializeComponent()
        }
    }

    initializeComponent() {
        const currentLeafletMap = this.leafletMap.current
        if (currentLeafletMap && this.state.boundsObject) {
            currentLeafletMap.leafletElement.removeLayer(
                this.state.boundsObject
            )
        }

        import('./../../API/axiosGeoJSON').then((api) => {
            api.getOnderverdeling(this.props.gebiedType, this.props.gebiedUUID)
                .then((data) => {
                    this.setState(
                        {
                            dataReceived: true,
                        },
                        () => {
                            let colorsIndex = -1
                            const leafletMap = this.leafletMap.current

                            function onEachFeature(feature, layer) {
                                if (feature.properties) {
                                    layer.bindPopup(
                                        feature.properties.Onderverdeling
                                    )
                                }
                            }

                            const jsonLayer = Leaflet.Proj.geoJson(data, {
                                onEachFeature: onEachFeature,
                                style: (feature) => {
                                    colorsIndex++
                                    return {
                                        stroke: true,
                                        color: colors[colorsIndex],
                                        fillColor: colors[colorsIndex],
                                        fillOpacity: 0.2,
                                    }
                                },
                            })
                            jsonLayer.addTo(leafletMap.leafletElement)
                            let layerArray = []
                            jsonLayer.eachLayer(function (layer) {
                                layerArray.push(layer)
                            })
                            this.setState({
                                jsonLayer: layerArray,
                            })
                        }
                    )
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log('Request canceled -', err.message)
                    } else {
                        console.log(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    }
                })
        })
    }

    componentDidMount() {
        this.initializeComponent()
    }

    render() {
        return (
            <React.Fragment>
                {this.state.dataReceived === true ? (
                    <Map
                        onClick={this.onClickReset}
                        onViewportChanged={this.onViewportChanged}
                        viewport={this.state.viewport}
                        scrollWheelZoom={!this.state.layerControlOpen}
                        zoomControl={true}
                        bounds={this.state.bounds}
                        boundsOptions={{ padding: [100, 100] }}
                        crs={this.state._RDCrs}
                        ref={this.leafletMap}
                        className="z-0"
                        id="leaflet-tiny-viewer"
                    >
                        <LeafletController position="topright">
                            <div id="leaflet-layers-control" className="">
                                <div className="flex">
                                    <div
                                        className={`absolute top-0 right-0 p-2 w-8 h-8 flex justify-center items-center shadow-xl bg-white rounded ${
                                            this.state.layerControlOpen
                                                ? 'hidden'
                                                : ''
                                        }`}
                                        style={
                                            this.state.layerControlOpen
                                                ? null
                                                : {
                                                      marginTop: '10px',
                                                      marginRight: '10px',
                                                      boxShadow:
                                                          '0 1px 5px rgba(0,0,0,0.65)',
                                                  }
                                        }
                                        onClick={() =>
                                            this.setState({
                                                layerControlOpen: !this.state
                                                    .layerControlOpen,
                                            })
                                        }
                                    >
                                        <FontAwesomeIcon
                                            className="text-lg text-gray-700"
                                            icon={
                                                this.state.layerControlOpen
                                                    ? faAngleRight
                                                    : faLayerGroup
                                            }
                                        />
                                    </div>
                                    <Transition
                                        show={this.state.layerControlOpen}
                                        enter="ease-out duration-300"
                                        enterFrom="transform translate-x-64 opacity-0"
                                        enterTo="transform translate-x-0 opacity-100"
                                        leave="ease-in duration-300"
                                        leaveFrom="transform translate-x-0 opacity-100"
                                        leaveTo="transform translate-x-64 opacity-0"
                                    >
                                        <div>
                                            <button
                                                className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 p-2 mr-8 text-gray-700 transform -translate-x-8 bg-orange-100 rounded-l opacity-100 hover:text-gray-800"
                                                onClick={() =>
                                                    this.setState({
                                                        layerControlOpen: !this
                                                            .state
                                                            .layerControlOpen,
                                                    })
                                                }
                                            >
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
                                                    height: this.props
                                                        .fullscreen
                                                        ? '800px'
                                                        : '250px',
                                                }}
                                            >
                                                <div className="w-full">
                                                    <ToggleableSection title="Legenda">
                                                        <ul className="p-2">
                                                            {this.state
                                                                .jsonLayer
                                                                ? this.state.jsonLayer.map(
                                                                      (
                                                                          layer,
                                                                          index
                                                                      ) => (
                                                                          <li
                                                                              className="flex justify-between px-2 py-1 text-gray-700 hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                                              onClick={() => {
                                                                                  this.forceUpdate()
                                                                                  this.leafletMap.current.leafletElement.hasLayer(
                                                                                      layer
                                                                                  )
                                                                                      ? layer.remove()
                                                                                      : layer.addTo(
                                                                                            this
                                                                                                .leafletMap
                                                                                                .current
                                                                                                .leafletElement
                                                                                        )
                                                                              }}
                                                                          >
                                                                              <div
                                                                                  className={`flex transition-opacity duration-100 ease-in ${
                                                                                      this.leafletMap.current.leafletElement.hasLayer(
                                                                                          layer
                                                                                      )
                                                                                          ? 'opacity-100'
                                                                                          : 'opacity-50 line-through'
                                                                                  }`}
                                                                              >
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
                                                                                      {
                                                                                          layer
                                                                                              .feature
                                                                                              .properties
                                                                                              .Onderverdeling
                                                                                      }
                                                                                  </span>
                                                                              </div>
                                                                              <div className="flex-none w-5 ml-2">
                                                                                  <FontAwesomeIcon
                                                                                      icon={
                                                                                          this.leafletMap.current.leafletElement.hasLayer(
                                                                                              layer
                                                                                          )
                                                                                              ? faEye
                                                                                              : faEyeSlash
                                                                                      }
                                                                                  />
                                                                              </div>
                                                                          </li>
                                                                      )
                                                                  )
                                                                : null}
                                                        </ul>
                                                    </ToggleableSection>
                                                    <ToggleableSection title="Achtergrondlaag">
                                                        <ul className="p-2">
                                                            <li
                                                                className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            activeMapTiles:
                                                                                'Satelliet',
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <div>
                                                                    <input
                                                                        className="mr-2"
                                                                        type="radio"
                                                                        id="Satelliet"
                                                                        name="drone"
                                                                        value="Satelliet"
                                                                        checked={
                                                                            this
                                                                                .state
                                                                                .activeMapTiles ===
                                                                            'Satelliet'
                                                                        }
                                                                    />
                                                                    <label for="Satelliet">
                                                                        Satelliet
                                                                    </label>
                                                                </div>
                                                            </li>
                                                            <li
                                                                className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50"
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            activeMapTiles:
                                                                                'Map',
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <div>
                                                                    <input
                                                                        className="mr-2"
                                                                        type="radio"
                                                                        id="Map"
                                                                        name="drone"
                                                                        value="Map"
                                                                        checked={
                                                                            this
                                                                                .state
                                                                                .activeMapTiles ===
                                                                            'Map'
                                                                        }
                                                                    />
                                                                    <label for="Map">
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
                                checked={this.state.activeMapTiles === 'Map'}
                                name="Map"
                            >
                                <TileLayer
                                    url="https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png"
                                    minZoom="3"
                                    continuousWorld="true"
                                    tms="true"
                                    attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                                />
                            </LayersControl.BaseLayer>
                            <LayersControl.BaseLayer
                                checked={
                                    this.state.activeMapTiles === 'Satelliet'
                                }
                                name="Satelliet"
                            >
                                <TileLayer
                                    url="https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2018_ortho25/EPSG:28992/{z}/{x}/{y}.png"
                                    minZoom="3"
                                    continuousWorld="true"
                                    tms="true"
                                    attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                                />
                            </LayersControl.BaseLayer>
                        </LayersControl>
                    </Map>
                ) : (
                    <LoaderLeafletTinyViewer />
                )}
            </React.Fragment>
        )
    }
}

const ToggleableSection = ({ children, title }) => {
    const [open, setOpen] = React.useState(true)
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-5 text-left bg-orange-100"
            >
                <span className="font-semibold">{title}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </button>
            {open ? <div className="pb-10">{children}</div> : null}
        </div>
    )
}
