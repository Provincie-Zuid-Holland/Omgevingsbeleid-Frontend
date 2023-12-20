import 'dotenv/config'

const getApiUrl = (): string | undefined => {
    const environment = process.env.VITE_API_ENV

    switch (environment) {
        case 'dev':
            return process.env.VITE_API_URL_DEV
        case 'test':
            return process.env.VITE_API_URL_TEST
        case 'acc':
            return process.env.VITE_API_URL_ACC
        case 'prod':
            return process.env.VITE_API_URL_PROD
        default:
            return process.env.VITE_API_URL_DEV
    }
}

export default {
    api: {
        input: {
            target: `${getApiUrl()}/openapi.json`,
        },
        output: {
            mode: 'split',
            target: './src/api/fetchers.ts',
            client: 'react-query',
            prettier: true,
            mock: true,
            override: {
                mutator: {
                    path: './src/api/instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
}
