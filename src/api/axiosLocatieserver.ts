import axios, { Canceler } from 'axios'

const api_version = 'v3'
const instance = axios.create({
    baseURL: `https://geodata.nationaalgeoregister.nl/locatieserver/${api_version}/`,
})

// const CancelToken = axios.CancelToken
// const source = CancelToken.source()

const CancelToken = axios.CancelToken
let cancel: Canceler

const cancelRequest = () => {
    // source.cancel('Operation canceled by new input.')
    cancel('Request(s) cancelled by new input.')
}

const getSuggestData = async (value: string) => {
    const res = await instance.get(`/suggest?q=${value}`, {
        cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c
        }),
    })
    const data = res.data
    return data
}

const getAddressData = async (lat: string, lng: string) => {
    const res = await instance.get(
        `/suggest?lat=${lat}&lon=${lng}&fq=type:adres&rows=1`
    )
    const data = res.data.response.docs[0]
    return data
}

const getLookupData = async (id: string) => {
    const res = await instance.get(`/lookup?id=${id}`)
    const data = res.data.response.docs[0]
    return data
}

export default instance
export { cancelRequest, getSuggestData, getAddressData, getLookupData }
