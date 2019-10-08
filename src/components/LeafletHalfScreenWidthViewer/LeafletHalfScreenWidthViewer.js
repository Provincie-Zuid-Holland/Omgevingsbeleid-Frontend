import React, { Component } from 'react'
import axios from 'axios'
import Leaflet from 'leaflet'
import {
    Map,
    GeoJSON,
    TileLayer,
    LayersControl,
    ZoomControl,
    Control,
    Marker,
    Popup,
    FeatureGroup,
    Circle,
} from 'react-leaflet'
import Proj from 'proj4leaflet'
import { useSpring, animated } from 'react-spring'

import {
    faCaretDown,
    faMapMarkerAlt,
    faDrawPolygon,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './../../../node_modules/leaflet/dist/leaflet.css'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import LeafletController from './../../components/LeafletController'
import LeafletDrawController from './../../components/LeafletDrawController'
import LeafletSearchInput from './../../components/LeafletSearchInput'

delete Leaflet.Icon.Default.prototype._getIconUrl
Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
})

const RDProj4 = `+proj=sterea+lat_0=52.15616055555555+lon_0=5.38763888888889+k=0.9999079+x_0=155000+y_0=463000+ellps=bessel+units=m+no_defs`
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
    bounds: Leaflet.bounds([[-285401.92, 22598.08], [595401.92, 903401.92]]),
})

const DEFAULT_VIEWPORT = {
    center: [52.086531, 4.316168],
    zoom: 4,
}

function getGeoJson() {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [-122.47979164123535, 37.830124319877235],
                        [-122.47721672058105, 37.809377088502615],
                    ],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-122.46923446655273, 37.80293476836673],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-122.48399734497069, 37.83466623607849],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-122.47867584228514, 37.81893781173967],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-122.48069286346434, 37.800637436707525],
                            [-122.48069286346434, 37.803104310307276],
                            [-122.47950196266174, 37.803104310307276],
                            [-122.47950196266174, 37.800637436707525],
                            [-122.48069286346434, 37.800637436707525],
                        ],
                    ],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-122.48103886842728, 37.833075326166274],
                            [-122.48065531253813, 37.832558431940114],
                            [-122.4799284338951, 37.8322660885204],
                            [-122.47963070869446, 37.83231693093747],
                            [-122.47948586940764, 37.832467339549524],
                            [-122.47945636510849, 37.83273426112019],
                            [-122.47959315776825, 37.83289737938241],
                            [-122.48004108667372, 37.833109220743104],
                            [-122.48058557510376, 37.83328293020496],
                            [-122.48080283403395, 37.83332529830436],
                            [-122.48091548681259, 37.83322785163939],
                            [-122.48103886842728, 37.833075326166274],
                        ],
                    ],
                },
            },
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-122.48043537139893, 37.82564992009924],
                            [-122.48129367828368, 37.82629397920697],
                            [-122.48240947723389, 37.82544653184479],
                            [-122.48373985290527, 37.82632787689904],
                            [-122.48425483703613, 37.82680244295304],
                            [-122.48605728149415, 37.82639567223645],
                            [-122.4898338317871, 37.82663295542695],
                            [-122.4930953979492, 37.82415839321614],
                            [-122.49700069427489, 37.821887146654376],
                            [-122.4991464614868, 37.82171764783966],
                            [-122.49850273132326, 37.81798857543524],
                            [-122.50923156738281, 37.82090404811055],
                            [-122.51232147216798, 37.823344820392535],
                            [-122.50150680541992, 37.8271414168374],
                            [-122.48743057250977, 37.83093781796035],
                            [-122.48313903808594, 37.82822612280363],
                            [-122.48043537139893, 37.82564992009924],
                        ],
                    ],
                },
            },
        ],
    }
}

function PinpointMarker() {
    document.addEventListener(
        'mousemove',
        function(ev) {
            document.getElementById('pinpointMarker').style.transform =
                'translateY(' + ev.clientY + 'px)'
            document.getElementById('pinpointMarker').style.transform +=
                'translateX(' + ev.clientX + 'px)'
        },
        false
    )

    return (
        <FontAwesomeIcon
            className="text-xl inline-block text-red-800 absolute top-0 left-0 z-50 select-none"
            id="pinpointMarker"
            icon={faMapMarkerAlt}
        />
    )
}

function PopUpContainer() {
    // return `<span>'JOE'</span>`
}

export default class LeafletHalfScreenWidthViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _RDCrs: RDCrs,
            viewport: DEFAULT_VIEWPORT,
            pinpointMarker: false,
            leafletSearch: false,
            activeSearchMarker: null,
        }
        this.leafletMap = React.createRef()
        this.togglePinMarker = this.togglePinMarker.bind(this)
        this.toggleLeafletSearch = this.toggleLeafletSearch.bind(this)
        this.mapPanTo = this.mapPanTo.bind(this)
        this.leafletSearch = React.createRef()
    }

    _onEdited = e => {
        let numEdited = 0
        e.layers.eachLayer(layer => {
            numEdited += 1
        })
        console.log(`_onEdited: edited ${numEdited} layers`, e)

        this._onChange()
    }

    _createCustomPopup(lat, lng, layer) {
        layer.bindPopup('Adress aan het laden...').openPopup()
        // layer._popup.setContent('something else')

        import('./../../API/axiosLocatieserver').then(api => {
            api.getAdresData(lat, lng)
                .then(data => {
                    console.log(data)
                    const customPopupHTML = `<div class="text-base"> <span class="font-bold block">Gemarkeerde Locatie</span><ul class="mb-4"><li>${
                        data.weergavenaam.split(',')[0]
                    }</li><li>${
                        data.weergavenaam.split(',')[1]
                    }</li> <li>GPS Locatie: ${lat.toFixed(7)}, ${lng.toFixed(
                        7
                    )}</li> </ul> <span class="mbg-color cursor-pointer hover:bg-blue-600 text-white inline-block py-2 px-8 rounded focus:outline-none focus:shadow-outline">Bekijk beleid van deze locatie</span></div>`

                    layer._popup.setContent(customPopupHTML)
                })
                .catch(function(thrown) {
                    console.log(thrown)
                })
        })
    }

    _onCreated = e => {
        let type = e.layerType
        let layer = e.layer

        if (type === 'marker') {
            // Do marker specific actions
            console.log(e.layer._latlng.lat)
            console.log(e.layer._latlng.lng)

            this._createCustomPopup(
                e.layer._latlng.lat,
                e.layer._latlng.lng,
                e.layer
            )

            console.log('_onCreated: marker created', e)
        } else {
            console.log('_onCreated: something else created:', type, e)
        }
        // Do whatever else you need to. (save to db; etc)

        this._onChange()
    }

    _onDeleted = e => {
        let numDeleted = 0
        e.layers.eachLayer(layer => {
            numDeleted += 1
        })
        console.log(`onDeleted: removed ${numDeleted} layers`, e)

        this._onChange()
    }

    _onMounted = drawControl => {
        console.log('_onMounted', drawControl)
    }

    _onEditStart = e => {
        console.log('_onEditStart', e)
    }

    _onEditStop = e => {
        console.log('_onEditStop', e)
    }

    _onDeleteStart = e => {
        console.log('_onDeleteStart', e)
    }

    _onDeleteStop = e => {
        console.log('_onDeleteStop', e)
    }

    _editableFG = null

    _onFeatureGroupReady = reactFGref => {
        const leafletMap = this.leafletMap.current

        // populate the leaflet FeatureGroup with the geoJson layers
        // let leafletGeoJSON = new leafletMap.leafletElement.GeoJSON(getGeoJson())
        // let leafletFG = reactFGref.leafletElement

        // leafletGeoJSON.eachLayer(layer => {
        //     leafletFG.addLayer(layer)
        // })

        // store the ref for future access to content

        this._editableFG = reactFGref
    }

    _onChange = () => {
        // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

        const { onChange } = this.props

        if (!this._editableFG || !onChange) {
            return
        }

        const geojsonData = this._editableFG.leafletElement.toGeoJSON()
        onChange(geojsonData)
    }

    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    onViewportChanged = viewport => {
        // this.setState({ viewport })
    }

    togglePinMarker() {
        this.setState({
            pinpointMarker: !this.state.pinpointMarker,
        })
    }

    toggleLeafletSearch() {
        this.setState(
            {
                leafletSearch: !this.state.leafletSearch,
            },
            () => {
                if (
                    this.leafletSearch.current !== null &&
                    this.state.leafletSearch
                ) {
                    this.leafletSearch.current.select()
                }
            }
        )
    }

    mapPanTo(lng, lat, type) {
        let zoomLevel
        switch (type) {
            case 'adres':
                zoomLevel = 10
                break
            case 'postcode':
                zoomLevel = 12
                break
            case 'weg':
                zoomLevel = 14
                break
            case 'woonplaats':
                zoomLevel = 7
                break
            case 'gemeente':
                zoomLevel = 8
                break
            case 'provincie':
                zoomLevel = 5
                break
            default:
                zoomLevel = 5
        }

        const leafletMap = this.leafletMap.current

        console.log(Leaflet.latLng(lng, lat))
        console.log(zoomLevel)

        const markerID = Leaflet.marker(Leaflet.latLng(lng, lat)).addTo(
            leafletMap.leafletElement
        )

        if (this.state.activeSearchMarker) {
            leafletMap.leafletElement.removeLayer(this.state.activeSearchMarker)
        }

        this.setState({
            activeSearchMarker: markerID,
        })

        console.log('Marker:')
        console.log(markerID)

        leafletMap.leafletElement.setView(Leaflet.latLng(lng, lat), zoomLevel)
    }

    componentDidMount() {
        const leafletMap = this.leafletMap.current

        // leafletMap.leafletElement.on('click', function(e) {
        //     var coord = e.latlng.toString().split(',')
        //     var lat = coord[0].split('(')
        //     var lng = coord[1].split(')')
        //     console.log(
        //         'You clicked the map at latitude: ' +
        //             lat[1] +
        //             ' and longitude:' +
        //             lng[0]
        //     )
        // })
    }

    componentWillUnmount() {
        import('./../../API/axiosGeoJSON').then(api => {
            api.cancelRequest()
        })
    }

    render() {
        let geoStyle = {
            color: '#ff7800',
            weight: 5,
            opacity: 0.65,
        }

        return (
            <React.Fragment>
                {/* <PinpointMarker /> */}
                <Map
                    // onClick={this.onClickReset}
                    onViewportChanged={this.onViewportChanged}
                    viewport={this.state.viewport}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    crs={this.state._RDCrs}
                    // drawControl={true}
                    ref={this.leafletMap}
                    className="z-0"
                    id="half-screen-leaflet"
                >
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked={true} name="Map">
                            <TileLayer
                                url="https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png"
                                minZoom="3"
                                continuousWorld="true"
                                tms="true"
                                attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satelliet">
                            <TileLayer
                                url="https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2018_ortho25/EPSG:28992/{z}/{x}/{y}.png"
                                minZoom="3"
                                continuousWorld="true"
                                tms="true"
                                attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <LeafletController position="topleft">
                        <div
                            id="leaflet-search"
                            className="bg-white rounded shadow relative flex justify-between items-center z-10 h-10 cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 flex justify-center items-center text-gray-600 hover:text-gray-700 ${
                                    this.state.leafletSearch
                                        ? 'border-r border-gray-300'
                                        : null
                                }`}
                                onClick={this.toggleLeafletSearch}
                            >
                                <FontAwesomeIcon
                                    className="text-lg inline-block w-10 cursor-pointer"
                                    icon={faSearch}
                                    onClick={this.toggleLeafletSearch}
                                />
                            </div>
                            {this.state.leafletSearch ? (
                                <LeafletSearchInput
                                    mapPanTo={this.mapPanTo}
                                    reference={this.leafletSearch}
                                />
                            ) : null}
                        </div>
                    </LeafletController>
                    <FeatureGroup
                        ref={reactFGref => {
                            this._onFeatureGroupReady(reactFGref)
                        }}
                    >
                        <LeafletDrawController
                            position="topleft"
                            onEdited={this._onEdited}
                            onCreated={this._onCreated}
                            onDeleted={this._onDeleted}
                            onMounted={this._onMounted}
                            onEditStart={this._onEditStart}
                            onEditStop={this._onEditStop}
                            onDeleteStart={this._onDeleteStart}
                            onDeleteStop={this._onDeleteStop}
                            draw={{
                                marker: true,
                                polygon: true,
                                circle: false,
                                rectangle: false,
                                polyline: false,
                                circlemarker: false,
                            }}
                        />
                    </FeatureGroup>

                    {/* maxZoom='15' */}

                    {/* L.Proj.GeoJson */}
                </Map>
            </React.Fragment>
        )
    }
}
