import React, { Component } from 'react'
import axios from 'axios'
import Leaflet from 'leaflet'
import {
    Map,
    GeoJSON,
    TileLayer,
    LayersControl,
    Marker,
    Popup,
    FeatureGroup,
    Circle,
} from 'react-leaflet'
// import jsonData from './leafletData'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './../../../node_modules/leaflet/dist/leaflet.css'
import Proj from 'proj4leaflet'

// const geoJsonData = jsonData

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

export default class GebiedLeaflet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _RDCrs: RDCrs,
            viewport: DEFAULT_VIEWPORT,
        }
        this.leafletMap = React.createRef()

        this.getInitialData = this.getInitialData.bind(this)
        this.addCustomController = this.addCustomController.bind(this)
    }

    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    onViewportChanged = (viewport: Viewport) => {
        this.setState({ viewport })
    }

    getInitialData(leafletMap) {
        import('./../../API/axiosGeoJSON').then(api => {
            api.getGeoJsonData(this.props.gebiedType, this.props.gebiedUUID)
                .then(data => {
                    Leaflet.Proj.geoJson(data, {
                        style: feature => {
                            return {
                                stroke: true,
                                fillColor: 'fffff',
                                fillOpacity: 0,
                            }
                        },
                    }).addTo(leafletMap.leafletElement)
                })
                .catch(function(thrown) {
                    if (axios.isCancel(thrown)) {
                        console.log('Request canceled -', thrown.message)
                    } else {
                        console.log(thrown)
                    }
                })
        })
    }

    addCustomController(leafletMap) {}

    componentDidMount() {
        const leafletMap = this.leafletMap.current
        this.getInitialData(leafletMap)
        this.addCustomController(leafletMap)
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
            <Map
                onClick={this.onClickReset}
                onViewportChanged={this.onViewportChanged}
                viewport={this.state.viewport}
                scrollWheelZoom={true}
                zoomControl={true}
                crs={this.state._RDCrs}
                drawControl={true}
                ref={this.leafletMap}
                className="z-0"
                id="half-screen-leaflet"
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked={true} name="Layer 1">
                        <TileLayer
                            url="https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png"
                            minZoom="3"
                            continuousWorld="true"
                            tms="true"
                            attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Layer 2">
                        <TileLayer
                            url="https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2018_ortho25/EPSG:28992/{z}/{x}/{y}.pnggit"
                            minZoom="3"
                            continuousWorld="true"
                            tms="true"
                            attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {/* maxZoom='15' */}

                {/* L.Proj.GeoJson */}
            </Map>
        )
    }
}
