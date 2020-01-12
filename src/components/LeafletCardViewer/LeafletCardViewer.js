import React, { Component } from 'react'
import axios from 'axios'
import Leaflet from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'
import './../../../node_modules/leaflet/dist/leaflet.css'
import Proj from 'proj4leaflet'
import LoaderLeafletTinyViewer from './../LoaderLeafletTinyViewer'

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
    bounds: Leaflet.bounds([
        [-285401.92, 22598.08],
        [595401.92, 903401.92],
    ]),
})

const DEFAULT_VIEWPORT = {
    center: [52.086531, 4.316168],
    zoom: 5,
}

export default class LeafletCardViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _RDCrs: RDCrs,
            viewport: DEFAULT_VIEWPORT,
            dataReceived: false,
        }
        this.leafletMap = React.createRef()
    }

    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    onViewportChanged = viewport => {
        this.setState({ viewport: viewport, bounds: null })
    }

    componentDidUpdate(prevProps) {
        if (this.props.fullscreen !== prevProps.fullscreen) {
            this.leafletMap.current.leafletElement.invalidateSize()
            this.forceUpdate()
            this.setState({
                bounds: this.state.boundsObject.getBounds(),
            })
        }
    }

    componentDidMount() {
        import('./../../API/axiosGeoJSON').then(api => {
            api.getGeoJsonData(this.props.gebiedType, this.props.gebiedUUID)
                .then(data => {
                    this.setState(
                        {
                            dataReceived: true,
                        },
                        () => {
                            const leafletMap = this.leafletMap.current

                            const jsonLayer = Leaflet.Proj.geoJson(data, {
                                style: feature => {
                                    return {
                                        stroke: true,
                                        fillColor: '#3388ff',
                                        fillOpacity: 0.1,
                                    }
                                },
                            })

                            jsonLayer.addTo(leafletMap.leafletElement)
                            // leafletMap.fitBounds(jsonLayer.getBounds())
                            this.setState({
                                bounds: jsonLayer.getBounds(),
                                boundsObject: jsonLayer,
                            })
                        }
                    )
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

    render() {
        return (
            <React.Fragment>
                {this.state.dataReceived === true ? (
                    <Map
                        // onClick={this.onClickReset}
                        onViewportChanged={this.onViewportChanged}
                        viewport={this.state.viewport}
                        scrollWheelZoom={false}
                        zoomControl={false}
                        dragging={false}
                        bounds={this.state.bounds}
                        boundsOptions={{ padding: [100, 100] }}
                        crs={this.state._RDCrs}
                        ref={this.leafletMap}
                        className="z-0"
                        doubleClickZoom={false}
                        id={`leaflet-preview-card`}
                    >
                        <TileLayer
                            url="https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png"
                            minZoom="3"
                            continuousWorld="true"
                            tms="true"
                            attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                        />
                    </Map>
                ) : (
                    <LoaderLeafletTinyViewer />
                )}
            </React.Fragment>
        )
    }
}
