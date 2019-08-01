import axios from 'axios'

const access_token = localStorage.getItem('access_token')
const api_version = '1.1.0'
const instance = axios.create({
    baseURL: `https://geo-acctest-ob.westeurope.cloudapp.azure.com/geoserver/`,
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
        `ows?service=wfs&version=${api_version}&request=GetFeature&typeNames=Omgevingsbeleid:${type}&cql_filter=UUID=%27${UUID}%27&outputFormat=application/json`,
        { cancelToken: source.token }
    )
    const data = res.data
    return data
}

const cancelRequest = () => {
    source.cancel('Operation canceled by the user.')
}

instance.interceptors.request.use(function(config) {
    const access_token = localStorage.getItem('access_token')
    config.headers.Authorization = `Token ${access_token}`
    return config
})

export default instance
export { getGeoJsonData, cancelRequest }
