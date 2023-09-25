import axios, { AxiosRequestConfig } from 'axios'
import { Point } from 'leaflet'

const api_version = '1.1.0'

// https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/wms?service=WMS&version=1.1.0&request=GetMap&layers=OMGEVINGSBELEID%3AWerkingsgebieden&bbox=43662.62000000104%2C406692.0%2C138647.9990000017%2C483120.0&width=768&height=617&srs=EPSG%3A28992&format=application/openlayers

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_GEOSERVER_API_URL}/OMGEVINGSBELEID/`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Function to generate the URL for the request
const generateUrl = (params: Record<string, string | number>): string => {
    const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

    return `ows?${queryString}`
}

// Function to fetch data using a generic template
const fetchData = async (
    params: Record<string, string | number>,
    config?: AxiosRequestConfig
) => {
    const url = generateUrl(params)

    try {
        const response = await instance.get(url, config)
        return response.data
    } catch (error) {
        // Handle error if necessary
        console.error('Error fetching data:', error)
        throw error
    }
}

const getGeoJsonData = async (
    type: string,
    UUID: string,
    config?: AxiosRequestConfig
) => {
    const params = {
        service: 'wfs',
        version: api_version,
        request: 'GetFeature',
        typeNames: `OMGEVINGSBELEID:${type}`,
        cql_filter: `UUID='${UUID}'`,
        outputFormat: 'application/json',
    }

    return fetchData(params, config)
}

const getOnderverdeling = async (UUID: string, config?: AxiosRequestConfig) => {
    const params = {
        service: 'wfs',
        version: api_version,
        request: 'GetFeature',
        typeName: 'OMGEVINGSBELEID:Werkingsgebieden_Onderverdeling',
        maxFeatures: 50,
        outputFormat: 'application/json',
        cql_filter: `UUID IN ('${UUID}')`,
    }

    return fetchData(params, config)
}

const getWerkingsGebieden = async (
    pointA: string,
    pointB: string,
    config?: AxiosRequestConfig
) => {
    const params = {
        service: 'wfs',
        version: api_version,
        request: 'GetFeature',
        outputFormat: 'application/json',
        typeName: 'OMGEVINGSBELEID:Werkingsgebieden',
        cql_filter: `INTERSECTS(Shape, POINT (${pointA} ${pointB}))`,
        propertyName: 'UUID,Gebied',
    }

    const data = await fetchData(params, config)
    return data.features
}

const getWerkingsGebiedenByArea = async (
    points: Point[],
    config?: AxiosRequestConfig
) => {
    const polygon = points
        .map((part: Point) => [part.x.toFixed(2), part.y.toFixed(2)].join(' '))
        .join(', ')

    const params = {
        service: 'wfs',
        version: '1.1.0',
        request: 'GetFeature',
        outputFormat: 'application/json',
        typeName: 'OMGEVINGSBELEID:Werkingsgebieden',
        cql_filter: `CONTAINS(Shape, POLYGON ((${polygon})))`,
        propertyName: 'UUID,Gebied',
    }

    return fetchData(params, config)
}

export default instance
export {
    getGeoJsonData,
    getOnderverdeling,
    getWerkingsGebieden,
    getWerkingsGebiedenByArea,
    api_version,
}
