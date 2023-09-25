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

export const leafletCenter: [number, number] = [52.176997, 5.2]

export const tileURL =
    'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=grijs&STYLE=default&FORMAT=image/png&TILEMATRIXSET=EPSG:28992&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'

export const tileURLSattelite =
    'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/2020_ortho25/EPSG:28992/{z}/{x}/{y}.png'

export const MAP_SEARCH_PAGE = '/zoeken-op-kaart'

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
    marker: '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt text-s inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 96c-52.935 0-96 43.065-96 96s43.065 96 96 96 96-43.065 96-96-43.065-96-96-96zm0 160c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.71 64-64 64zm0-256C85.961 0 0 85.961 0 192c0 77.413 26.97 99.031 172.268 309.67 9.534 13.772 29.929 13.774 39.465 0C357.03 291.031 384 269.413 384 192 384 85.961 298.039 0 192 0zm0 473.931C52.705 272.488 32 256.494 32 192c0-42.738 16.643-82.917 46.863-113.137S149.262 32 192 32s82.917 16.643 113.137 46.863S352 149.262 352 192c0 64.49-20.692 80.47-160 281.931z"></path></svg>',
    edit: '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="edit" class="svg-inline--fa fa-edit text-s inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M417.8 315.5l20-20c3.8-3.8 10.2-1.1 10.2 4.2V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h292.3c5.3 0 8 6.5 4.2 10.2l-20 20c-1.1 1.1-2.7 1.8-4.2 1.8H48c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16V319.7c0-1.6.6-3.1 1.8-4.2zm145.9-191.2L251.2 436.8l-99.9 11.1c-13.4 1.5-24.7-9.8-23.2-23.2l11.1-99.9L451.7 12.3c16.4-16.4 43-16.4 59.4 0l52.6 52.6c16.4 16.4 16.4 43 0 59.4zm-93.6 48.4L403.4 106 169.8 339.5l-8.3 75.1 75.1-8.3 233.5-233.6zm71-85.2l-52.6-52.6c-3.8-3.8-10.2-4-14.1 0L426 83.3l66.7 66.7 48.4-48.4c3.9-3.8 3.9-10.2 0-14.1z"></path></svg>',
    remove: '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt text-s inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M296 432h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zm-160 0h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zM440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v368a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V96h24a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zM384 464a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V96h320zm-168-32h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8z"></path></svg>',
    polygon:
        '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="draw-polygon" class="svg-inline--fa fa-draw-polygon text-s inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M96 96a32 32 0 10-64 0 32 32 0 1064 0zm-16 62v196c22.5 5.8 40.2 23.5 46 46h196c2.9-11.1 8.6-21 16.4-28.9l-32.2-53.7c-5.8 1.7-11.9 2.6-18.2 2.6-35.3 0-64-28.7-64-64s28.7-64 64-64c6.3 0 12.4.9 18.2 2.6l32.2-53.7c-7.8-7.9-13.5-17.8-16.4-28.9H126c-5.8 22.5-23.5 40.2-46 46zm285.8 196.6c5.8-1.7 11.9-2.6 18.2-2.6 35.3 0 64 28.7 64 64s-28.7 64-64 64c-29.8 0-54.9-20.4-62-48H126c-7.1 27.6-32.2 48-62 48-35.3 0-64-28.7-64-64 0-29.8 20.4-54.9 48-62V158c-27.6-7.1-48-32.2-48-62 0-35.3 28.7-64 64-64 29.8 0 54.9 20.4 62 48h196c7.1-27.6 32.2-48 62-48 35.3 0 64 28.7 64 64s-28.7 64-64 64c-6.3 0-12.4-.9-18.2-2.6l-32.2 53.7C345 222.6 352 238.5 352 256s-7 33.4-18.4 44.9l32.2 53.7zM64 384a32 32 0 100 64 32 32 0 100-64zM352 96a32 32 0 1064 0 32 32 0 10-64 0zm32 352a32 32 0 100-64 32 32 0 100 64zm-96-160a32 32 0 100-64 32 32 0 100 64z"></path></svg>',
}
