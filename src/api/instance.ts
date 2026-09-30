import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import qs from 'qs'

import getApiUrl from '@/utils/getApiUrl'
import { handleHttpError } from '@/utils/handleHttpError'

export type Environment = 'dev' | 'test' | 'acc' | 'main'

const environment = import.meta.env.VITE_API_ENV as Environment

export const getAccessToken = () =>
    localStorage.getItem(import.meta.env.VITE_KEY_API_ACCESS_TOKEN || '')

const instance = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: {
        serialize: params =>
            qs.stringify(params, {
                arrayFormat: 'repeat',
            }),
    },
})

instance.interceptors.request.use(async config => {
    config.headers &&
        !!getAccessToken() &&
        (config.headers.Authorization = `Bearer ${getAccessToken()}`)

    return config
}, Promise.reject)

instance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        handleAxiosError(error)
        return Promise.reject(error)
    }
)

const handleAxiosError = (error: AxiosError) => {
    const status = error.response?.status
    const isLoginPage = error.response?.config.url === '/login/access-token'
    console.error(`Axios error: ${error.message}`)

    handleHttpError(status, error, { skipAuthHandling: isLoginPage })
}

const baseURL = instance.defaults.baseURL

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const promise = instance({ ...config }).then(res => res?.data)

    return promise
}

export { baseURL, environment }
export default instance
