import axios, { AxiosError, AxiosRequestConfig } from 'axios'

import getApiUrl from '@/utils/getApiUrl'
import globalErrorBoundary from '@/utils/globalErrorBoundary'
import globalRouter from '@/utils/globalRouter'
import { toastNotification } from '@/utils/toastNotification'

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
        const status = error.response?.status

        switch (status) {
            case 401:
            case 403:
                toastNotification('notLoggedIn')
                globalRouter.navigate?.('/login')

                return Promise.reject(error)
            case 441:
                toastNotification('error441')

                return Promise.reject(error)
            case 442:
                toastNotification('error442')

                return Promise.reject(error)
            case 443:
                toastNotification('error443')

                return Promise.reject(error)
            case 444:
                toastNotification('error444')

                return Promise.reject(error)
            case 500:
                globalErrorBoundary.showBoundary?.(error)

                return Promise.reject(error)
            default:
                return Promise.reject(error)
        }
    }
)

const baseURL = instance.defaults.baseURL

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const promise = instance({ ...config }).then(res => res?.data)

    return promise
}

export { baseURL, environment }
export default instance
