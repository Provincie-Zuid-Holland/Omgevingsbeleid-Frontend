import axios, { AxiosError, AxiosRequestConfig } from 'axios'

export type Environment = 'dev' | 'test' | 'acc' | 'prod'

const apiUrl = import.meta.env.VITE_API_URL
const environment = import.meta.env.VITE_API_ENV as Environment

const getAccessToken = () =>
    localStorage.getItem(import.meta.env.VITE_KEY_API_ACCESS_TOKEN || '')

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    async config => {
        config.headers &&
            (config.headers.Authorization = `Bearer ${getAccessToken()}`)

        return config
    },
    error => Promise.reject(error)
)

instance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
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

export { environment, baseURL }
export default instance
