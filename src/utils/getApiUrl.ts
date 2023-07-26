import { Environment } from '@/api/instance'

const getApiUrl = (): string => {
    const environment = import.meta.env.VITE_API_ENV as Environment

    switch (environment) {
        case 'dev':
            return import.meta.env.VITE_API_URL_DEV
        case 'test':
            return import.meta.env.VITE_API_URL_TEST
        case 'acc':
            return import.meta.env.VITE_API_URL_ACC
        case 'prod':
            return import.meta.env.VITE_API_URL_PROD
        default:
            return import.meta.env.VITE_API_URL_DEV
    }
}

export default getApiUrl
