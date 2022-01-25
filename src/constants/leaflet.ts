import Leaflet from 'leaflet'
import Proj from 'proj4leaflet'

export const RDProj4 =
    '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'

export const leafletBounds = Leaflet.bounds(
    [-285401.92, 903401.92],
    [595401.92, 22598.08]
)

export const RDCrs = new (Proj as any).CRS('EPSG:28992', RDProj4, {
    origin: [-285401.92, 903401.92],
    resolutions: [
        3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44,
        6.72, 3.36, 1.68, 0.84, 0.42,
    ],
    zoom: 10,
    bounds: leafletBounds,
})

export const leafletCenter = [52.176997, 5.2]

export const tileURL =
    'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=grijs&STYLE=default&FORMAT=image/png&TILEMATRIXSET=EPSG:28992&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'

export const tileURLSattelite =
    'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/2020_ortho25/EPSG:28992/{z}/{x}/{y}.png'

export const colors = [
    '#f56565', // .bg-red-500
    '#ed8936', // .bg-orange-500
    '#ecc94b', // .bg-yellow-500
    '#48bb78', // .bg-green-500
    '#38b2ac', // .bg-teal-500
    '#4299e1', // .bg-blue-500
    '#667eea', // .bg-indigo-500
    '#9f7aea', // .bg-purple-500
    '#ed64a6', // .bg-pink-500
    '#9b2c2c', // .bg-red-800
    '#9c4221', // .bg-orange-800
    '#975a16', // .bg-yellow-800
    '#276749', // .bg-green-800
    '#285e61', // .bg-teal-800
    '#2c5282', // .bg-blue-800
    '#434190', // .bg-indigo-800
    '#553c9a', // .bg-purple-800
    '#97266', // .bg-pink-800
    '#fc8181', // .bg-red-400
    '#f6ad55', // .bg-orange-400
    '#f6e05e', // .bg-yellow-400
    '#68d391', // .bg-green-400
    '#4fd1c5', // .bg-teal-400
    '#63b3ed', // .bg-blue-400
    '#7f9cf5', // .bg-indigo-400
    '#b794f4', // .bg-purple-400
    '#f687b3', // .bg-pink-400
    '#feb2b2', // .bg-red-300
    '#fbd38d', // .bg-orange-300
    '#faf089', // .bg-yellow-300
    '#9ae6b4', // .bg-green-300
    '#81e6d9', // .bg-teal-300
    '#90cdf4', // .bg-blue-300
    '#a3bffa', // .bg-indigo-300
    '#d6bcfa', // .bg-purple-300
    '#fbb6c', // .bg-pink-300
    '#e53e3e', // .bg-red-600
    '#dd6b20', // .bg-orange-600
    '#d69e2e', // .bg-yellow-600
    '#38a169', // .bg-green-600
    '#319795', // .bg-teal-600
    '#3182ce', // .bg-blue-600
    '#5a67d8', // .bg-indigo-600
    '#805ad5', // .bg-purple-600
    '#d53f8c', // .bg-pink-600
    '#c53030', // .bg-red-700
    '#c05621', // .bg-orange-700
    '#b7791f', // .bg-yellow-700
    '#2f855a', // .bg-green-700
    '#2c7a7b', // .bg-teal-700
    '#2b6cb0', // .bg-blue-700
    '#4c51bf', // .bg-indigo-700
    '#6b46c1', // .bg-purple-700
    '#b83280', // .bg-pink-700
    '#fed7d7', // .bg-red-200
    '#feebc8', // .bg-orange-200
    '#fefcbf', // .bg-yellow-200
    '#c6f6d5', // .bg-green-200
    '#b2f5ea', // .bg-teal-200
    '#bee3f8', // .bg-blue-200
    '#c3dafe', // .bg-indigo-200
    '#e9d8fd', // .bg-purple-200
    '#fed7e', // .bg-pink-200
    '#fff5f5', // .bg-red-100
    '#fffaf0', // .bg-orange-100
    '#fffff0', // .bg-yellow-100
    '#f0fff4', // .bg-green-100
    '#e6fffa', // .bg-teal-100
    '#ebf8ff', // .bg-blue-100
    '#ebf4ff', // .bg-indigo-100
    '#faf5ff', // .bg-purple-100
    '#fff5f', // .bg-pink-100
]
