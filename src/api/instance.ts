import axios, { AxiosRequestConfig } from 'axios'

import { toastNotification } from '@/utils/toastNotification'

export type Environment = 'dev' | 'test' | 'acc' | 'prod'

const apiUrl = process.env.REACT_APP_API_URL
const environment = process.env.REACT_APP_API_ENV as Environment

const getAccessToken = () =>
    localStorage.getItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN || '')

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(config => {
    config.headers &&
        (config.headers.Authorization = `Bearer ${getAccessToken()}`)
    return config
})

instance.interceptors.response.use(
    response => response,
    error => {
        const allowedUrls = ['password-reset']
        if (
            error?.response?.status === 401 &&
            !allowedUrls.includes(error?.response?.config?.url)
        ) {
            toastNotification('unauthorized')
        }

        throw error?.response
    }
)

const baseURL = instance.defaults.baseURL

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const promise = instance({ ...config }).then(res => res?.data)

    return promise
}

export { environment, baseURL }
export default instance
