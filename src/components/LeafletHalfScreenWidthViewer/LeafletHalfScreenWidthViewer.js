import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import Leaflet from 'leaflet'
import { Map, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet'
import Proj from 'proj4leaflet'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './../../../node_modules/leaflet/dist/leaflet.css'

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

function CreateCustomPopup({ weergavenaam, lat, lng, point }) {
    return (
        <div className="text-base custom-popup">
            <span className="font-bold block">Gemarkeerde Locatie</span>
            <ul className="mb-4">
                <li>{weergavenaam.split(',')[0]}</li>
                <li>{weergavenaam.split(',')[1]}</li>
                <li>
                    GPS Locatie: {lat.toFixed(7)}, {lng.toFixed(7)}
                </li>
            </ul>
            <a
                href={`/zoekresultaten?geoQuery=${point.x.toFixed(
                    2
                )}+${point.y.toFixed(2)}&LatLng=${lat.toFixed(7)}-${lng.toFixed(
                    7
                )}`}
                className="text-white mbg-color cursor-pointer hover:bg-blue-600 inline-block py-2 px-8 rounded focus:outline-none focus:shadow-outline"
            >
                Bekijk provinciaal beleid van deze locatie
            </a>
        </div>
    )
}

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
const RDProjection = new Proj.Projection(
    'EPSG:28992',
    RDProj4,
    Leaflet.bounds([
        [-285401.92, 22598.08],
        [595401.92, 903401.92],
    ])
)

const DEFAULT_VIEWPORT = {
    center: [52.086531, 4.316168],
    zoom: 4,
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

    _createCustomPopup(lat, lng, layer) {
        layer.bindPopup('Adres aan het laden...').openPopup()
        // layer._popup.setContent('something else')

        import('./../../API/axiosLocatieserver').then(api => {
            api.getAdresData(lat, lng)
                .then(data => {
                    console.log(lat, lng)
                    const customPopupHTML = `<div>${ReactDOMServer.renderToString(
                        <CreateCustomPopup
                            weergavenaam={data.weergavenaam}
                            lat={lat}
                            lng={lng}
                            point={RDProjection.project({ lat: lat, lng: lng })}
                        />
                    )}</div>`
                    //rd_latlong = proj4(RDCrs,[lat,long]);
                    // ${RDProjection.project({ lat: lat, lng: lng })}
                    layer._popup.setContent(customPopupHTML)
                })
                .catch(function(thrown) {
                    console.log(thrown)
                })
        })
    }

    _onCreated = e => {
        let type = e.layerType

        if (type === 'marker') {
            // Do marker specific actions

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
        // console.log('_onMounted', drawControl)
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

        const markerID = Leaflet.marker(Leaflet.latLng(lng, lat)).addTo(
            leafletMap.leafletElement
        )

        if (this.state.activeSearchMarker) {
            leafletMap.leafletElement.removeLayer(this.state.activeSearchMarker)
        }

        this.setState({
            activeSearchMarker: markerID,
        })

        leafletMap.leafletElement.setView(Leaflet.latLng(lng, lat), zoomLevel)
    }

    render() {
        return (
            <React.Fragment>
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
