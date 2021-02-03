import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import Leaflet from 'leaflet'
import { Map, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet'
import Proj from 'proj4leaflet'
import { toast } from 'react-toastify'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import './../../../node_modules/leaflet/dist/leaflet.css'

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

/**
 * Function to create a custom Popup
 *
 * @function
 *
 * @param {array} weergavenaam - Parameter used to show a string weergavenaam.
 * @param {Float} lat - Parameter used as a latitude value for the GPS location.
 * @param {float} lng - Paramter used as a longitude value for the GPS location.
 * @param {object} point - Parameter that is used in a url to show a certain location based on the parameters lat and lng.
 */
function CreateCustomPopup({ weergavenaam, lat, lng, point }) {
    return (
        <div className="text-base custom-popup">
            <span className="block font-bold">Gemarkeerde Locatie</span>
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
                className="inline-block px-8 py-2 text-white rounded cursor-pointer mbg-color hover:bg-blue-600 focus:outline-none focus:shadow-outline"
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

/**
 * Class that sets the state for a certain amount of variables and create a reference for the leafletMap and leafletSearch variable and binds certain variables.
 *
 * @class
 * @extends Component
 */
export default class LeafletViewer extends Component {
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

    /**
     * Function that creates a custom popup with the parameters lat, lng and layer.
     *
     * @function
     *
     * @param {float} lat - Parameter that contains the latitude value that is used in the custom created popup.
     * @param {float} lng - Parameter that contains the longitude value that is used in the custom created popup.
     * @param {string} layer - Parameter used to bind text to the popup.
     */
    _createCustomPopup(lat, lng, layer) {
        layer.bindPopup('Adres aan het laden...').openPopup()
        // layer._popup.setContent('something else')

        import('./../../API/axiosLocatieserver').then((api) => {
            api.getAdresData(lat, lng)
                .then((data) => {
                    const customPopupHTML = `<div>${ReactDOMServer.renderToString(
                        <CreateCustomPopup
                            weergavenaam={data.weergavenaam}
                            lat={lat}
                            lng={lng}
                            point={RDProjection.project({ lat: lat, lng: lng })}
                        />
                    )}</div>`
                    layer._popup.setContent(customPopupHTML)
                })
                .catch(function (err) {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        })
    }

    _onCreated = (e) => {
        let type = e.layerType

        if (type === 'marker') {
            // Do marker specific actions

            this._createCustomPopup(
                e.layer._latlng.lat,
                e.layer._latlng.lng,
                e.layer
            )

            // console.log('_onCreated: marker created', e)
        } else {
            // console.log('_onCreated: something else created:', type, e)
        }
        // Do whatever else you need to. (save to db; etc)

        this._onChange()
    }

    _onDeleted = (e) => {
        this._onChange()
    }

    _onMounted = (drawControl) => {
        // console.log('_onMounted', drawControl)
    }

    _onEditStart = (e) => {
        // console.log('_onEditStart', e)
    }

    _onEditStop = (e) => {
        // console.log('_onEditStop', e)
    }

    _onDeleteStart = (e) => {
        // console.log('_onDeleteStart', e)
    }

    _onDeleteStop = (e) => {
        // console.log('_onDeleteStop', e)
    }

    _editableFG = null

    _onFeatureGroupReady = (reactFGref) => {
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

    /**
     * Function that sets the viewport state to the default value viewport.
     *
     * @function
     */
    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    /**
     * Function that is not used in this javascript file.
     *
     * @function
     *
     * @param {object} viewport - Parameter that contains the viewport value.
     */
    onViewportChanged = (viewport) => {
        // this.setState({ viewport })
    }

    /**
     * Function that sets the pinpointMarker parameter to a toggled state of pinpointMarker.
     *
     * @function
     */
    togglePinMarker() {
        this.setState({
            pinpointMarker: !this.state.pinpointMarker,
        })
    }

    /**
     * Function that sets the leafletSearch parameter to a toggled stat of leafletSearch.
     *
     * @function
     */
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

    /**
     * Function to set the zoomLevel of each type parameter value based on the value. Also to set the state of activeSearchMarker to the markerID value and create a popup pased on the parameters.
     *
     * @function
     *
     * @param {float} lng - Parameter that contains the longitude value that is set for the coordinates object.
     * @param {float} lat - Parameter that contains the latitude value that is set for the coordinates object.
     * @param {string} type - Parameter that is used to check which type it is and to set the zoomLevel of each type value.
     */
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

        // Create popup
        const coordinates = Leaflet.latLng(lng, lat)
        this._createCustomPopup(coordinates.lat, coordinates.lng, markerID)

        leafletMap.leafletElement.setView(Leaflet.latLng(lng, lat), zoomLevel)
    }

    render() {
        return (
            <React.Fragment>
                <Map
                    onViewportChanged={this.onViewportChanged}
                    viewport={this.state.viewport}
                    scrollWheelZoom={true}
                    maxZoom={12}
                    zoomControl={true}
                    crs={this.state._RDCrs}
                    ref={this.leafletMap}
                    className={`z-0 ${
                        this.props.className ? this.props.className : ''
                    }`}
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
                            className="relative z-10 flex items-center justify-between h-10 bg-white rounded shadow cursor-pointer"
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
                                    className="inline-block w-10 text-lg cursor-pointer"
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
                        ref={(reactFGref) => {
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
                                polygon: false,
                                circle: false,
                                rectangle: false,
                                polyline: false,
                                circlemarker: false,
                            }}
                        />
                    </FeatureGroup>
                </Map>
            </React.Fragment>
        )
    }
}
