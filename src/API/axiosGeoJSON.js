import axios from 'axios'

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

const CancelToken = axios.CancelToken
const source = CancelToken.source()

const getGeoJsonData = async (type, UUID, cancelToken) => {
    let res = await instance.get(
        `ows?service=wfs&version=${api_version}&request=GetFeature&typeNames=OMGEVINGSBELEID:${type}&cql_filter=UUID=%27${UUID}%27&outputFormat=application/json`,
        { cancelToken: source.token }
    )
    const data = res.data
    return data
}

const getOnderverdeling = async (type, UUID) => {
    let res = await instance.get(
        `https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=OMGEVINGSBELEID%3AWerkingsgebieden_Onderverdeling&maxFeatures=50&outputFormat=application%2Fjson&cql_filter=UUID%20IN%20(%27${UUID}%27)`,
        { cancelToken: source.token }
    )
    const data = res.data
    return data
}

const getWerkingsGebieden = async (pointA, pointB) => {
    let res = await instance.get(
        `ows?service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&typeName=OMGEVINGSBELEID:Werkingsgebieden&cql_filter=INTERSECTS(Shape, POINT (${pointA} ${pointB}))&propertyName=UUID,Gebied`
    )
    const data = res.data.features
    return data
}

const cancelRequest = () => {
    source.cancel('Operation canceled by the user.')
}

instance.interceptors.request.use(function (config) {
    const access_token = localStorage.getItem('access_token')
    config.headers.Authorization = `Token ${access_token}`
    return config
})

export default instance
export {
    getGeoJsonData,
    getOnderverdeling,
    getWerkingsGebieden,
    cancelRequest,
    api_version,
}
