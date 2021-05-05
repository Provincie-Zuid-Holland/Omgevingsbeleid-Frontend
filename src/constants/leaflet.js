import Proj from 'proj4leaflet'
import Leaflet from 'leaflet'

export const RDProj4 =
    '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'

export const leafletBounds = Leaflet.bounds(
    [-285401.92, 903401.92],
    [595401.92, 22598.08]
)

export const RDCrs = new Proj.CRS('EPSG:28992', RDProj4, {
    origin: [-285401.92, 903401.92],
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
    ],
    zoom: 10,
    bounds: leafletBounds,
})

export const leafletCenter = [52.176997, 5.2]

export const tileURL =
    'https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png'

export const tileURLSattelite =
    'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts/1.0.0/2020_ortho25/EPSG:28992/{z}/{x}/{y}.png'
