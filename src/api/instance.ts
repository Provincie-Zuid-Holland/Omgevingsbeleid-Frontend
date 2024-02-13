import axios, { AxiosError, AxiosRequestConfig } from 'axios'

import getApiUrl from '@/utils/getApiUrl'

export type Environment = 'dev' | 'test' | 'acc' | 'main'

const environment = import.meta.env.VITE_API_ENV as Environment

export const getAccessToken = () =>
    localStorage.getItem(import.meta.env.VITE_KEY_API_ACCESS_TOKEN || '')

const instance = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
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
        if (
            (error.response?.status === 401 ||
                error.response?.status === 403) &&
            location.pathname !== '/login'
        ) {
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

const baseURL = instance.defaults.baseURL

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const promise = instance({ ...config }).then(res => res?.data)

    return promise
}

export { baseURL, environment }
export default instance
