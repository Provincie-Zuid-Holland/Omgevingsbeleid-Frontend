import axios, { AxiosRequestConfig } from 'axios'

import generateQueryString from '@/utils/queryString'

import { Environment } from './instance'

export interface Feature {
    id: string
    properties: {
        Onderverdeling?: string
        Werkingsgebied?: string
        Onderverdeling_UUID?: string
        Werkingsgebied_UUID?: string
        Symbol: string
    }
}

export interface FeatureCollection {
    features?: Feature[]
}

const api_version = '1.3.0'
export const geoserverBaseURL = `${import.meta.env.VITE_GEOSERVER_API_URL}/geoserver/omgevingsbeleid_werkingsgebieden`

// https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/wms?service=WMS&version=1.1.0&request=GetMap&layers=OMGEVINGSBELEID%3AWerkingsgebieden&bbox=43662.62000000104%2C406692.0%2C138647.9990000017%2C483120.0&width=768&height=617&srs=EPSG%3A28992&format=application/openlayers

const instance = axios.create({
    baseURL: geoserverBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Function to fetch data using a generic template
const fetchData = async (
    params: Record<string, string | number | boolean>,
    config?: AxiosRequestConfig,
    path?: string
) => {
    const queryString = generateQueryString(params)

    try {
        const response = await instance.get(
            `${path || ''}?${queryString}`,
            config
        )
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
        typeNames: getGeoserverLayer(),
        cql_filter: `UUID='${UUID}'`,
        outputFormat: 'application/json',
    }

    return fetchData(params, config)
}

const getWerkingsgebied = async (
    UUID: string,
    config?: AxiosRequestConfig
): Promise<FeatureCollection> => {
    const params = {
        version: api_version,
        request: 'GetFeature',
        typeName:
            'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_dev_input_geo',
        outputFormat: 'application/json',
        cql_filter: `Werkingsgebied_UUID='${UUID}'`,
        propertyName: 'Werkingsgebied,Werkingsgebied_UUID,Symbol',
    }

    return fetchData(params, config, '/wfs')
}

const generateImageUrl = (symbol: string) => {
    const params = {
        version: api_version,
        request: 'GetLegendGraphic',
        format: 'image/png',
        layer: getGeoserverLayer(true),
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
    const environment = import.meta.env.VITE_API_ENV as Environment

    switch (environment) {
        case 'dev':
            if (isSource)
                return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_dev_input_geo'
            return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_dev_areas'
        case 'test':
            if (isSource)
                return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_test_input_geo'
            return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_test_areas'
        case 'acc':
            if (isSource)
                return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_acc_input_geo'
            return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_acc_areas'
        case 'main':
            if (isSource)
                return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_prod_input_geo'
            return 'omgevingsbeleid_werkingsgebieden:Werkingsgebieden_prod_areas'
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
    getWerkingsgebied,
}
