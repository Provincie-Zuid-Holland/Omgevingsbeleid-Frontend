import React, { Component } from 'react'
import { Map, TileLayer, Rectangle } from 'react-leaflet';
import './../../../../node_modules/leaflet/dist/leaflet.css'

const outer = [[50.505, -29.09], [52.505, 29.09]]
const inner = [[49.505, -2.09], [53.505, 2.09]]

type State = {
  bounds: Array<[number, number]>,
}

export default class BoundsExample extends Component {
  state = {
    lat: 37.7900,
    lng: -122.401,
    bounds: outer,
  }

  onClickInner = () => {
    this.setState({ bounds: inner })
  }

  onClickOuter = () => {
    this.setState({ bounds: outer })
  }

  componentDidMount() {
    console.log(this.refs.map.leafletElement.getBounds);
  }

  render() {
    return (
      <Map ref="map" bounds={this.state.bounds} center={[37.7900, -122.401]}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Rectangle
          bounds={outer}
          color={this.state.bounds === outer ? 'red' : 'white'}
          onClick={this.onClickOuter}
        />
        <Rectangle
          bounds={inner}
          color={this.state.bounds === inner ? 'red' : 'white'}
          onClick={this.onClickInner}
        />
      </Map>
    )
  }
}
