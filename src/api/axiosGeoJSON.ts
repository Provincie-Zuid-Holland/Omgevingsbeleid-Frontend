import axios, { AxiosRequestConfig } from 'axios'
import { Point } from 'leaflet'

import generateQueryString from '@/utils/queryString'

import { Environment } from './instance'

export interface Feature {
    id: string
    properties: {
        Onderverdeling?: string
        Werkingsgebied?: string
        UUID: string
        symbol: string
    }
}

export interface FeatureCollection {
    features?: Feature[]
}

const api_version = '1.3.0'

// https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/wms?service=WMS&version=1.1.0&request=GetMap&layers=OMGEVINGSBELEID%3AWerkingsgebieden&bbox=43662.62000000104%2C406692.0%2C138647.9990000017%2C483120.0&width=768&height=617&srs=EPSG%3A28992&format=application/openlayers

const instance = axios.create({
    baseURL: `${
        import.meta.env.VITE_GEOSERVER_API_URL
    }/geoserver/Omgevingsbeleid/wms`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Function to fetch data using a generic template
const fetchData = async (
    params: Record<string, string | number | boolean>,
    config?: AxiosRequestConfig
) => {
    const queryString = generateQueryString(params)

    try {
        const response = await instance.get(`?${queryString}`, config)
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
        typeNames: `Omgevingsbeleid:${type}`,
        cql_filter: `UUID='${UUID}'`,
        outputFormat: 'application/json',
    }

    return fetchData(params, config)
}

const getOnderverdeling = async (
    UUID: string,
    config?: AxiosRequestConfig
): Promise<FeatureCollection> => {
    const params = {
        service: 'wfs',
        version: api_version,
        request: 'GetFeature',
        typeName: 'Omgevingsbeleid:Werkingsgebieden_Onderverdeling',
        outputFormat: 'application/json',
        cql_filter: `UUID='${UUID}'`,
        propertyName: 'Onderverdeling,symbol,UUID',
    }

    return fetchData(params, config)
}

const getWerkingsgebied = async (
    UUID: string,
    config?: AxiosRequestConfig
): Promise<FeatureCollection> => {
    const params = {
        service: 'wfs',
        version: api_version,
        request: 'GetFeature',
        typeName: 'Omgevingsbeleid:Werkingsgebieden',
        outputFormat: 'application/json',
        cql_filter: `UUID='${UUID}'`,
        propertyName: 'Werkingsgebied,UUID',
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
        typeName: 'Omgevingsbeleid:Werkingsgebieden',
        cql_filter: `INTERSECTS(Shape, POINT (${pointA} ${pointB}))`,
        propertyName: 'UUID,Werkingsgebied',
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
        typeName: 'Omgevingsbeleid:Werkingsgebieden',
        cql_filter: `CONTAINS(Shape, POLYGON ((${polygon})))`,
        propertyName: 'UUID,Werkingsgebied',
    }

    return fetchData(params, config)
}

const generateImageUrl = (symbol: string) => {
    const params = {
        version: api_version,
        request: 'GetLegendGraphic',
        format: 'image/png',
        layer: 'Omgevingsbeleid:Werkingsgebieden',
        width: 20,
        height: 20,
        rule: symbol,
    }

    const path = generateQueryString(params)

    return `${
        import.meta.env.VITE_GEOSERVER_API_URL
    }/geoserver/Omgevingsbeleid/wms?${path}`
}

const getGeoserverLayer = (isSource?: boolean): string => {
    const environment = isSource
        ? 'source'
        : (import.meta.env.VITE_API_ENV as Environment)

    switch (environment) {
        case 'source':
            return 'Omgevingsbeleid:Werkingsgebieden'
        case 'dev':
            return 'Omgevingsbeleid:Werkingsgebieden_dev'
        case 'test':
            return 'Omgevingsbeleid:Werkingsgebieden_test'
        case 'acc':
            return 'Omgevingsbeleid:Werkingsgebieden_acc'
        case 'main':
            return 'Omgevingsbeleid:Werkingsgebieden_prod'
        default:
            return ''
    }
}

export default instance
export {
    api_version,
    generateImageUrl,
    getGeoJsonData,
    getGeoserverLayer,
    getOnderverdeling,
    getWerkingsGebieden,
    getWerkingsGebiedenByArea,
    getWerkingsgebied,
}
