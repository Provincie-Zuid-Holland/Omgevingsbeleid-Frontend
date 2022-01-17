import { faSearch } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Leaflet from 'leaflet'
import Proj from 'proj4leaflet'
import { Component, createRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Map, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet'
import { toast } from 'react-toastify'

import {
    LeafletController,
    LeafletDrawController,
    LeafletSearchInput,
} from '../'
import {
    RDProj4,
    RDCrs,
    leafletBounds,
    tileURL,
    tileURLSattelite,
    leafletCenter,
} from './../../../constants/leaflet'

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
 * @param {array} weergavenaam - Parameter used to show a string weergavenaam.
 * @param {Float} lat - Parameter used as a latitude value for the GPS location.
 * @param {float} lng - Paramter used as a longitude value for the GPS location.
 * @param {object} point - Parameter that is used in a url to show a certain location based on the parameters lat and lng.
 */
function CreateCustomPopup({ weergavenaam, lat, lng, point }) {
    return (
        <div className="text-sm custom-popup">
            <span className="block font-bold">Gemarkeerde Locatie</span>
            <ul className="mt-1 mb-4 text-xs">
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
                className="inline-block p-2 text-white rounded cursor-pointer bg-pzh-blue hover:bg-blue-600 focus:outline-none focus:ring">
                Bekijk provinciaal beleid van deze locatie
            </a>
        </div>
    )
}

const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

const DEFAULT_VIEWPORT = {
    zoom: 4,
}

/**
 * Class that sets the state for a certain amount of variables and create a reference for the leafletMap and leafletSearch variable and binds certain variables.
 */
export default class LeafletViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewport: DEFAULT_VIEWPORT,
            pinpointMarker: false,
            leafletSearch: false,
            activeSearchMarker: null,
        }
        this.leafletMap = createRef()
        this.togglePinMarker = this.togglePinMarker.bind(this)
        this.toggleLeafletSearch = this.toggleLeafletSearch.bind(this)
        this.mapPanTo = this.mapPanTo.bind(this)
        this.leafletSearch = createRef()
    }

    /**
     * Function that creates a custom popup with the parameters lat, lng and layer.
     *
     *
     *
     * @param {float} lat - Parameter that contains the latitude value that is used in the custom created popup.
     * @param {float} lng - Parameter that contains the longitude value that is used in the custom created popup.
     * @param {string} layer - Parameter used to bind text to the popup.
     */
    _createCustomPopup(lat, lng, layer) {
        layer.bindPopup('Adres aan het laden...').openPopup()
        // layer._popup.setContent('something else')

        import('../../../api/axiosLocatieserver').then(api => {
            api.getAddressData(lat, lng)
                .then(data => {
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

    _onCreated = e => {
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

    _onDeleted = () => {
        this._onChange()
    }

    _onMounted = () => {
        // console.log('_onMounted', drawControl)
    }

    _onEditStart = () => {
        // console.log('_onEditStart', e)
    }

    _onEditStop = () => {
        // console.log('_onEditStop', e)
    }

    _onDeleteStart = () => {
        // console.log('_onDeleteStart', e)
    }

    _onDeleteStop = () => {
        // console.log('_onDeleteStop', e)
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

    /**
     * Function that sets the viewport state to the default value viewport.
     *
     *
     */
    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    togglePinMarker() {
        this.setState({
            pinpointMarker: !this.state.pinpointMarker,
        })
    }

    /**
     * Function that sets the leafletSearch parameter to a toggled stat of leafletSearch.
     *
     *
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
     *
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
            <>
                <Map
                    center={leafletCenter}
                    continuousWorld={true}
                    viewport={this.state.viewport}
                    scrollWheelZoom={true}
                    maxZoom={12}
                    zoomControl={true}
                    crs={RDCrs}
                    ref={this.leafletMap}
                    className={`z-0 ${
                        this.props.className ? this.props.className : ''
                    }`}>
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked={true} name="Map">
                            <TileLayer
                                url={tileURL}
                                minZoom="3"
                                continuousWorld="true"
                                attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satelliet">
                            <TileLayer
                                url={tileURLSattelite}
                                minZoom="3"
                                continuousWorld="true"
                                wmts={false}
                                attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <LeafletController position="topleft">
                        <div
                            id="leaflet-search"
                            className="relative z-10 flex items-center justify-between h-10 bg-white rounded shadow cursor-pointer">
                            <div
                                className={`w-10 h-10 flex justify-center items-center text-gray-600 hover:text-gray-700 ${
                                    this.state.leafletSearch
                                        ? 'border-r border-gray-300'
                                        : null
                                }`}
                                onClick={this.toggleLeafletSearch}>
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
                        ref={reactFGref => {
                            this._onFeatureGroupReady(reactFGref)
                        }}>
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
            </>
        )
    }
}
