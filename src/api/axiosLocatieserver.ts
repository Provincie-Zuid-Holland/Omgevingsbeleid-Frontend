import axios, { AxiosRequestConfig } from 'axios'

interface SuggestionData {
    highlighting: any
    response: {
        docs?: Location[]
    }
    spellcheck: any
}

export interface Location {
    weergavenaam: string
    id: string
    type: string
    score: number
    centroide_ll: string
    centroide_rd: string
}

const api_version = 'v3_1'
const instance = axios.create({
    baseURL: `https://api.pdok.nl/bzk/locatieserver/search/${api_version}/`,
})

const getSuggestData = async (value: string, config?: AxiosRequestConfig) => {
    const res = await instance.get(`/suggest?q=${value}`, {
        ...(config && { ...config }),
    })
    const data = res.data as SuggestionData
    return data
}

const getAddressData = async (lat: string, lng: string) => {
    const res = await instance.get(
        `/suggest?lat=${lat}&lon=${lng}&fq=type:adres&rows=1`
    )
    const data = res.data.response.docs[0] as Location
    return data
}

const getLookupData = async (id: string) => {
    const res = await instance.get(`/lookup?id=${id}`)
    const data = res.data.response.docs[0] as Location
    return data
}

export default instance
export { getSuggestData, getAddressData, getLookupData }
