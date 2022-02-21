import axios from 'axios'

const api_version = 'v3'
const instance = axios.create({
    baseURL: `https://geodata.nationaalgeoregister.nl/locatieserver/${api_version}/`,
})

const getSuggestData = async (value: string, signal?: AbortSignal) => {
    const res = await instance.get(`/suggest?q=${value}`, {
        ...(signal && { signal }),
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
export { getSuggestData, getAddressData, getLookupData }
