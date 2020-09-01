import React, { Component } from 'react'
import axios from 'axios'
import Leaflet from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'
import { toast } from 'react-toastify'
import Proj from 'proj4leaflet'
import LoaderLeafletTinyViewer from './../LoaderLeafletTinyViewer'

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
        if (this.props.fullscreen !== prevProps.fullscreen) {
            this.leafletMap.current.leafletElement.invalidateSize()
            this.forceUpdate()
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
            api.getGeoJsonData(this.props.gebiedType, this.props.gebiedUUID)
                .then((data) => {
                    this.setState(
                        {
                            dataReceived: true,
                        },
                        () => {
                            const leafletMap = this.leafletMap.current

                            const jsonLayer = Leaflet.Proj.geoJson(data, {
                                style: (feature) => {
                                    return {
                                        stroke: true,
                                        fillColor: '#3388ff',
                                        fillOpacity: 0.1,
                                    }
                                },
                            })

                            jsonLayer.addTo(leafletMap.leafletElement)
                            const bounds = jsonLayer.getBounds()
                            if (!bounds.isValid()) return

                            // leafletMap.fitBounds(jsonLayer.getBounds())
                            this.setState({
                                bounds: jsonLayer.getBounds(),
                                boundsObject: jsonLayer,
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

        import('./../../API/axiosGeoJSON').then((api) => {
            api.getOnderverdeling(this.props.gebiedType, this.props.gebiedUUID)
                .then((data) => {
                    console.log(data)
                    // this.setState(
                    //     {
                    //         dataReceived: true,
                    //     },
                    //     () => {
                    //         const leafletMap = this.leafletMap.current
                    //         const jsonLayer = Leaflet.Proj.geoJson(data, {
                    //             style: (feature) => {
                    //                 return {
                    //                     stroke: true,
                    //                     fillColor: '#3388ff',
                    //                     fillOpacity: 0.1,
                    //                 }
                    //             },
                    //         })
                    //         // !Refactor!
                    //         jsonLayer.addTo(leafletMap.leafletElement)
                    //         const bounds = jsonLayer.getBounds()
                    //         if (!bounds.isValid()) return
                    //         // leafletMap.fitBounds(jsonLayer.getBounds())
                    //         this.setState({
                    //             bounds: jsonLayer.getBounds(),
                    //             boundsObject: jsonLayer,
                    //         })
                    //     }
                    // )
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

    componentWillUnmount() {
        // import('./../../API/axiosGeoJSON').then(api => {
        //     api.cancelRequest()
        // })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.dataReceived === true ? (
                    <Map
                        onClick={this.onClickReset}
                        onViewportChanged={this.onViewportChanged}
                        viewport={this.state.viewport}
                        scrollWheelZoom={true}
                        zoomControl={true}
                        bounds={this.state.bounds}
                        boundsOptions={{ padding: [100, 100] }}
                        crs={this.state._RDCrs}
                        ref={this.leafletMap}
                        className="z-0"
                        id={`${
                            this.props.fullscreen ? 'full-screen-leaflet' : ''
                        }`}
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
