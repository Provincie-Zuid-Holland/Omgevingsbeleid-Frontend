import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import Leaflet from 'leaflet'

import {
    Map,
    TileLayer,
    LayersControl,
    FeatureGroup,
    Layer,
} from 'react-leaflet'
import Proj from 'proj4leaflet'
import { toast } from 'react-toastify'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    RDProj4,
    RDCrs,
    leafletBounds,
    tileURL,
    tileURLSattelite,
    leafletCenter,
} from './../../constants/leaflet'

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

const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

const DEFAULT_VIEWPORT = {
    zoom: 4,
}

export default class LeafletViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
        let numDeleted = 0
        e.layers.eachLayer((layer) => {
            numDeleted += 1
        })
        // console.log(`onDeleted: removed ${numDeleted} layers`, e)

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

    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
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

        // Create popup
        const coordinates = Leaflet.latLng(lng, lat)
        this._createCustomPopup(coordinates.lat, coordinates.lng, markerID)

        leafletMap.leafletElement.setView(Leaflet.latLng(lng, lat), zoomLevel)
    }

    render() {
        return (
            <React.Fragment>
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
                    }`}
                >
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
