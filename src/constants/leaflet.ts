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

export const icons = {
    marker: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>',
    edit: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg>',
    remove: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14 text-xl inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>',
}
