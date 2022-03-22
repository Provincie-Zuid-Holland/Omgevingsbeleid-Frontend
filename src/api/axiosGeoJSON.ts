import axios, { AxiosRequestConfig } from 'axios'
import { Point } from 'leaflet'

const access_token = localStorage.getItem('access_token')
const api_version = '1.1.0'

// https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/wms?service=WMS&version=1.1.0&request=GetMap&layers=OMGEVINGSBELEID%3AWerkingsgebieden&bbox=43662.62000000104%2C406692.0%2C138647.9990000017%2C483120.0&width=768&height=617&srs=EPSG%3A28992&format=application/openlayers

const instance = axios.create({
    baseURL: `https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/`,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${access_token}`,
        'Access-Control-Allow-Origin': 'localhost:3000',
    },
})

const getGeoJsonData = async (
    type: string,
    UUID: string,
    config?: AxiosRequestConfig
) => {
    const res = await instance.get(
        `ows?service=wfs&version=${api_version}&request=GetFeature&typeNames=OMGEVINGSBELEID:${type}&cql_filter=UUID=%27${UUID}%27&outputFormat=application/json`,
        config && { ...config }
    )
    const data = res.data
    return data
}

const getOnderverdeling = async (UUID: string, config?: AxiosRequestConfig) => {
    const res = await instance.get(
        `ows?service=wfs&version=1.0.0&request=GetFeature&typeName=OMGEVINGSBELEID%3AWerkingsgebieden_Onderverdeling&maxFeatures=50&outputFormat=application%2Fjson&cql_filter=UUID%20IN%20(%27${UUID}%27)`,
        config && { ...config }
    )
    const data = res.data
    return data
}

const getWerkingsGebieden = async (pointA: string, pointB: string) => {
    const res = await instance.get(
        `ows?service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&typeName=OMGEVINGSBELEID:Werkingsgebieden&cql_filter=INTERSECTS(Shape, POINT (${pointA} ${pointB}))&propertyName=UUID,Gebied`
    )
    const data = res.data.features
    return data
}

const getWerkingsGebiedenByArea = async (
    points: Point[],
    config?: AxiosRequestConfig
) => {
    const polygon = points
        .map((part: Point) => [part.x.toFixed(2), part.y.toFixed(2)].join(' '))
        .join(', ')

    const res = await instance.get(
        `ows?service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&typeName=OMGEVINGSBELEID:Werkingsgebieden&cql_filter=INTERSECTS(Shape, POLYGON ((${polygon})))&propertyName=UUID,Gebied`,
        config && { ...config }
    )
    const data = res.data
    return data
}

const getGemeenteGrenzen = async () => {
    const res = await instance.get(
        `https://geoservices.zuid-holland.nl/arcgis/rest/services/Utilities/Geometry/GeometryServer/project?f=json&outSR=102100&inSR=28992&geometries=%7B%22geometryType%22%3A%22esriGeometryEnvelope%22%2C%22geometries%22%3A%5B%7B%22xmin%22%3A43583.6799999998%2C%22ymin%22%3A414464.31999999995%2C%22xmax%22%3A138416.3199999998%2C%22ymax%22%3A497899.83999999997%2C%22spatialReference%22%3A%7B%22wkid%22%3A28992%7D%7D%5D%7D`
    )
    const data = res.data.features
    return data
}

instance.interceptors.request.use(function (config) {
    const access_token = localStorage.getItem('access_token')
    config.headers && (config.headers.Authorization = `Token ${access_token}`)
    return config
})

export default instance
export {
    getGeoJsonData,
    getOnderverdeling,
    getWerkingsGebieden,
    getWerkingsGebiedenByArea,
    getGemeenteGrenzen,
    api_version,
}
