import React, { Component } from 'react'

import Leaflet from 'leaflet'
import { Map, TileLayer, Rectangle, LatLngBounds, type Viewport, FeatureGroup } from 'react-leaflet'

import './../../../../node_modules/leaflet/dist/leaflet.css'
import WFS from 'leaflet-wfst'
import Proj from 'proj4leaflet'

// const outer = [[50.505, -29.09], [52.505, 29.09]]
// const inner = [[49.505, -2.09], [53.505, 2.09]]


const RDProj4 = `+proj=sterea+lat_0=52.15616055555555+lon_0=5.38763888888889+k=0.9999079+x_0=155000+y_0=463000+ellps=bessel+units=m+no_defs`
const RDCrs = new Proj.CRS('EPSG:28992', RDProj4,
    {
        origin: [-285401.92, 22598.08],
        resolutions: [
            3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21,
        ],
        zoom: 10,
        bounds: Leaflet.bounds([[-285401.92, 22598.08], [595401.92, 903401.92]]),
    });


const DEFAULT_VIEWPORT = {
  center: [52.086531, 4.316168],
  zoom: 5,
}



export default class ViewportExample extends Component<{}, { viewport: Viewport },> {
  constructor(props) {
    super(props)
    this.state = {
      _RDCrs: RDCrs,
      viewport: DEFAULT_VIEWPORT,
    }
  }

  onClickReset = () => {
    this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  onViewportChanged = (viewport: Viewport) => {
    this.setState({ viewport })
  }

  componentDidMount() {
    console.log(Leaflet.WFS)
  }

  render() {
    return (
      <Map
        onClick={this.onClickReset}
        onViewportChanged={this.onViewportChanged}
        viewport={this.state.viewport}
        crs={this.state._RDCrs}
        >
        <TileLayer url='https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png' maxZoom='15'
          minZoom='3'
          continuousWorld='true'
          tms='true'
          attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
        />

        <FeatureGroup 
        
        />
      </Map>
    )
  }
}
