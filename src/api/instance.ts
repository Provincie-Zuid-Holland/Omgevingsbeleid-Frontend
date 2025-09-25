import axios, { AxiosError, AxiosRequestConfig } from 'axios'

import { ToastType } from '@/config/notifications'
import { ACCESS_TOKEN_KEY, IDENTIFIER_KEY } from '@/context/AuthContext'
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
        handleAxiosError(error)
        return Promise.reject(error)
    }
)

const handleAxiosError = (error: AxiosError) => {
    const status = error.response?.status
    console.error(`Axios error: ${error.message}`)

    // Handle authentication errors
    if (status && (status === 401 || status === 403)) {
        // clear auth
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(IDENTIFIER_KEY)
        toastNotification('notLoggedIn')
        globalRouter.navigate?.('/login')
        return
    }

    // Handle general server error
    if (status === 500) {
        globalErrorBoundary.showBoundary?.(error)
        return
    }

    // Handle specific error codes
    const errorMessages: Map<number, ToastType> = new Map([
        [441, 'error441'],
        [442, 'error442'],
        [443, 'error443'],
        [444, 'error444'],
    ])

    if (status && errorMessages.has(status)) {
        toastNotification(errorMessages.get(status)!)
    }
}

const baseURL = instance.defaults.baseURL

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const promise = instance({ ...config }).then(res => res?.data)

    return promise
}

export { baseURL, environment }
export default instance
